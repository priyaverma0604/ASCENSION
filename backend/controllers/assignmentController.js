const Program = require('../models/Program');
const UserProgramProgress = require('../models/UserProgramProgress');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const { isCloudinaryConfigured } = require('../config/cloudinary');

// Helper to check enrollment
const checkEnrollment = (program, userId) => {
  return program.enrolledUsers.some(
    (id) => id._id ? id._id.toString() === userId.toString() : id.toString() === userId.toString()
  );
};

// ==========================================
// ADMIN CONTROLLERS
// ==========================================

// @desc    Create assignment
// @route   POST /api/programs/:id/assignments
// @access  Private/Admin
exports.createAssignment = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const { dayNumber, title, content, estimatedDuration, status } = req.body;

    // Check if assignment for this day already exists in the program
    const existing = await Assignment.findOne({ program: program._id, dayNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: `An assignment for Day ${dayNumber} already exists in this program.` });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    }

    const assignment = await Assignment.create({
      program: program._id,
      dayNumber: Number(dayNumber),
      title,
      content,
      estimatedDuration,
      image: imageUrl,
      status: status || 'Active'
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all assignments for a program (Admin view)
// @route   GET /api/programs/:id/assignments/admin
// @access  Private/Admin
exports.getAssignmentsAdmin = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const assignments = await Assignment.find({ program: program._id }).sort('dayNumber');
    
    // Enrich with submission statistics
    const enrichedAssignments = await Promise.all(assignments.map(async (assign) => {
      const stats = await AssignmentSubmission.aggregate([
        { $match: { assignment: assign._id } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } }
          }
        }
      ]);

      const assignObj = assign.toObject();
      assignObj.stats = stats[0] || { total: 0, pending: 0, approved: 0 };
      return assignObj;
    }));

    res.json({ success: true, data: enrichedAssignments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assignment details
// @route   GET /api/programs/assignments/:assignmentId
// @access  Private/Admin
exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assignment
// @route   PUT /api/programs/assignments/:assignmentId
// @access  Private/Admin
exports.updateAssignment = async (req, res, next) => {
  try {
    let assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const { dayNumber, title, content, estimatedDuration, status } = req.body;

    // Check unique constraint if dayNumber is changing
    if (dayNumber && Number(dayNumber) !== assignment.dayNumber) {
      const existing = await Assignment.findOne({ program: assignment.program, dayNumber: Number(dayNumber) });
      if (existing) {
        return res.status(400).json({ success: false, message: `An assignment for Day ${dayNumber} already exists in this program.` });
      }
      assignment.dayNumber = Number(dayNumber);
    }

    if (title) assignment.title = title;
    if (content) assignment.content = content;
    if (estimatedDuration) assignment.estimatedDuration = estimatedDuration;
    if (status) assignment.status = status;

    if (req.file) {
      assignment.image = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    }

    await assignment.save();

    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle assignment status (active/inactive)
// @route   PATCH /api/programs/assignments/:assignmentId/status
// @access  Private/Admin
exports.toggleAssignmentStatus = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    assignment.status = assignment.status === 'Active' ? 'Inactive' : 'Active';
    await assignment.save();

    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for program (Admin view)
// @route   GET /api/programs/:id/submissions/admin
// @access  Private/Admin
exports.getSubmissionsAdmin = async (req, res, next) => {
  try {
    const submissions = await AssignmentSubmission.find({ program: req.params.id })
      .populate('user', 'name email')
      .populate('assignment', 'title')
      .sort('-submittedAt');

    res.json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};

// @desc    Review submission (Approve / Reject)
// @route   PATCH /api/programs/submissions/:submissionId/review
// @access  Private/Admin
exports.reviewSubmission = async (req, res, next) => {
  try {
    const submission = await AssignmentSubmission.findById(req.params.submissionId)
      .populate('program')
      .populate('user');
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const { status, adminComment } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid status: approved or rejected.' });
    }

    submission.status = status;
    submission.adminComment = adminComment || '';
    submission.reviewedAt = new Date();
    submission.reviewedBy = req.user._id;

    await submission.save();

    // If approved, update user program progress
    if (status === 'approved') {
      let progress = await UserProgramProgress.findOne({
        user: submission.user._id,
        program: submission.program._id
      });

      if (!progress) {
        progress = await UserProgramProgress.create({
          user: submission.user._id,
          program: submission.program._id,
          currentDay: 1,
          completed: false,
          submissions: []
        });
      }

      // Check if this day is already recorded in the progress submissions
      const alreadySubmitted = progress.submissions.some(sub => sub.day === submission.dayNumber);
      if (!alreadySubmitted) {
        progress.submissions.push({
          day: submission.dayNumber,
          photo: submission.imageUrl,
          submittedAt: submission.submittedAt
        });

        if (submission.dayNumber >= 30) {
          progress.completed = true;
        } else {
          progress.currentDay = submission.dayNumber + 1;
        }

        await progress.save();
      }
    }

    res.json({ success: true, message: `Submission reviewed successfully and marked as ${status}.`, data: submission });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// USER CONTROLLERS
// ==========================================

// @desc    Get user's active assignments
// @route   GET /api/programs/:id/assignments
// @access  Private
exports.getAssignmentsUser = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    if (!checkEnrollment(program, req.user._id)) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this program.' });
    }

    let progress = await UserProgramProgress.findOne({ user: req.user._id, program: program._id });
    const currentDay = progress ? progress.currentDay : 1;

    // Fetch active assignments
    const assignments = await Assignment.find({ program: program._id, status: 'Active' }).sort('dayNumber');

    // Return assignments list indicating locked status
    const data = assignments.map(assign => {
      const isLocked = assign.dayNumber > currentDay;
      const isCompleted = progress ? progress.submissions.some(sub => sub.day === assign.dayNumber) : false;
      return {
        _id: assign._id,
        dayNumber: assign.dayNumber,
        title: assign.title,
        estimatedDuration: assign.estimatedDuration,
        isLocked,
        isCompleted
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assignment for user's current day
// @route   GET /api/programs/:id/assignments/current
// @access  Private
exports.getCurrentAssignment = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    if (!checkEnrollment(program, req.user._id)) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this program.' });
    }

    const progress = await UserProgramProgress.findOne({ user: req.user._id, program: program._id });
    const currentDayNum = progress ? progress.currentDay : 1;

    const assignment = await Assignment.findOne({
      program: program._id,
      dayNumber: currentDayNum,
      status: 'Active'
    });

    if (!assignment) {
      return res.json({ success: false, code: 'ASSIGNMENT_NOT_FOUND', message: 'This assignment is not available yet. Please check back soon.' });
    }

    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit current day assignment work
// @route   POST /api/programs/assignments/:assignmentId/submit
// @access  Private
exports.submitAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId).populate('program');
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const program = assignment.program;

    if (!checkEnrollment(program, req.user._id)) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this program.' });
    }

    let progress = await UserProgramProgress.findOne({
      user: req.user._id,
      program: program._id
    });

    if (!progress) {
      progress = await UserProgramProgress.create({
        user: req.user._id,
        program: program._id,
        currentDay: 1,
        completed: false,
        submissions: []
      });
    }

    // Check expiration: 35 days limit for Gratitude Program
    if (program.title.toLowerCase().includes('gratitude') || program._id.toString() === '6a4963f49e941f93f91f5abf') {
      const startDate = progress.createdAt || new Date();
      const expirationDate = new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000);
      if (new Date() > expirationDate) {
        return res.status(403).json({ success: false, message: 'Your enrollment in this program has expired (maximum 35 days limit).' });
      }
    }

    if (progress.completed) {
      return res.status(400).json({ success: false, message: 'You have already completed this 30-day program!' });
    }

    // Backend Security: Verify that the submitted assignment day matches the user's progress day
    if (assignment.dayNumber !== progress.currentDay) {
      return res.status(403).json({
        success: false,
        message: `Security validation failed. You are currently on Day ${progress.currentDay} and cannot submit Day ${assignment.dayNumber}.`
      });
    }

    // Check for duplicate pending/approved submissions
    const existingSubmission = await AssignmentSubmission.findOne({
      user: req.user._id,
      program: program._id,
      assignment: assignment._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${existingSubmission.status} submission for this day. Duplicate submissions are not allowed.`
      });
    }

    let photoUrl = '';
    if (req.file) {
      photoUrl = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ success: false, message: 'Please upload a photo of your work' });
    }

    // Always bypass approval, mark as approved directly
    const submission = await AssignmentSubmission.create({
      user: req.user._id,
      program: program._id,
      assignment: assignment._id,
      dayNumber: assignment.dayNumber,
      imageUrl: photoUrl,
      status: 'approved'
    });

    // Advance progress immediately
    progress.submissions.push({
      day: assignment.dayNumber,
      photo: photoUrl,
      submittedAt: new Date()
    });

    if (assignment.dayNumber >= 30) {
      progress.completed = true;
    } else {
      progress.currentDay = assignment.dayNumber + 1;
    }

    await progress.save();

    res.json({
      success: true,
      message: `Day ${assignment.dayNumber} work completed successfully! Next day unlocked!`,
      data: {
        submission,
        progress
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assignment
// @route   DELETE /api/programs/assignments/:assignmentId
// @access  Private/Admin
exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Security check: Check if submissions exist for this assignment
    const submissionsCount = await AssignmentSubmission.countDocuments({ assignment: assignment._id });
    if (submissionsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete assignment because submissions already exist. Deactivate it instead.'
      });
    }

    await Assignment.findByIdAndDelete(req.params.assignmentId);

    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's unlocked assignment by day number
// @route   GET /api/programs/:id/assignments/day/:dayNumber
// @access  Private
exports.getAssignmentByDayNum = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    if (!checkEnrollment(program, req.user._id)) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this program.' });
    }

    const dayNumber = Number(req.params.dayNumber);

    // Security verification: check if this day is unlocked for the user
    const progress = await UserProgramProgress.findOne({ user: req.user._id, program: program._id });
    const currentDay = progress ? progress.currentDay : 1;
    if (dayNumber > currentDay) {
      return res.status(403).json({ success: false, message: 'This assignment is locked.' });
    }

    const assignment = await Assignment.findOne({ program: program._id, dayNumber, status: 'Active' });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};


