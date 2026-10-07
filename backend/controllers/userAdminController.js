const User = require('../models/User');
const Order = require('../models/Order');
const ProgramRegistration = require('../models/ProgramRegistration');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const WebinarRegistration = require('../models/WebinarRegistration');
const AssignmentSubmission = require('../models/AssignmentSubmission');

// @desc    Get all registered users with activity & stats
// @route   GET /api/users
// @access  Private / Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-password -resetPasswordCode -resetPasswordExpire')
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // Fetch supplementary activity counts in parallel for all users
    const [orders, progRegs, wsRegs, webRegs, submissions] = await Promise.all([
      Order.find({}).select('user').lean(),
      ProgramRegistration.find({}).select('user email').lean(),
      WorkshopRegistration.find({}).select('user email').lean(),
      WebinarRegistration.find({}).select('user email').lean(),
      AssignmentSubmission.find({}).select('user').lean()
    ]);

    // Build user counts map
    const orderCountMap = {};
    orders.forEach(o => {
      if (o.user) {
        const uid = o.user.toString();
        orderCountMap[uid] = (orderCountMap[uid] || 0) + 1;
      }
    });

    const regCountMap = {};
    const countReg = (r) => {
      if (r.user) {
        const uid = r.user.toString();
        regCountMap[uid] = (regCountMap[uid] || 0) + 1;
      }
    };
    progRegs.forEach(countReg);
    wsRegs.forEach(countReg);
    webRegs.forEach(countReg);

    const submissionCountMap = {};
    submissions.forEach(s => {
      if (s.user) {
        const uid = s.user.toString();
        submissionCountMap[uid] = (submissionCountMap[uid] || 0) + 1;
      }
    });

    const enrichedUsers = users.map(u => {
      const uid = u._id.toString();
      const lastActiveDate = u.lastActive ? new Date(u.lastActive) : null;
      const isOnline = !!(lastActiveDate && lastActiveDate >= fiveMinutesAgo);

      return {
        ...u,
        isOnline,
        ordersCount: orderCountMap[uid] || 0,
        registrationsCount: regCountMap[uid] || 0,
        submissionsCount: submissionCountMap[uid] || 0
      };
    });

    res.json({
      success: true,
      count: enrichedUsers.length,
      data: enrichedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user metrics overview
// @route   GET /api/users/stats
// @access  Private / Admin
exports.getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [onlineNow, activeToday, activeThisWeek, newThisMonth, adminsCount] = await Promise.all([
      User.countDocuments({ lastActive: { $gte: fiveMinutesAgo } }),
      User.countDocuments({ lastActive: { $gte: startOfToday } }),
      User.countDocuments({ lastActive: { $gte: sevenDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ role: 'admin' })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        onlineNow,
        activeToday,
        activeThisWeek,
        newThisMonth,
        adminsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private / Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Protect against self-demotion if last admin
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot demote your own admin account' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private / Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
