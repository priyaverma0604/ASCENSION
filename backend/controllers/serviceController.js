const Service = require('../models/Service');
const { isCloudinaryConfigured } = require('../config/cloudinary');

// Helper to get image path from req.file
const getImagePath = (req) => {
  if (req.file) {
    if (isCloudinaryConfigured) {
      return req.file.path; // Cloudinary returns absolute url in .path
    } else {
      return `/uploads/${req.file.filename}`; // Local fallback
    }
  }
  return '';
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find({});
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res, next) => {
  try {
    const { title, description, benefits, duration, pricing } = req.body;

    const benefitsArray = Array.isArray(benefits) 
      ? benefits 
      : benefits ? benefits.split(',').map(b => b.trim()) : [];

    const image = getImagePath(req) || req.body.image || '';

    const service = await Service.create({
      title,
      description,
      benefits: benefitsArray,
      duration: duration || 60,
      pricing,
      image
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const { title, description, benefits, duration, pricing } = req.body;

    service.title = title || service.title;
    service.description = description || service.description;
    service.duration = duration || service.duration;
    service.pricing = pricing || service.pricing;

    if (benefits) {
      service.benefits = Array.isArray(benefits) 
        ? benefits 
        : benefits.split(',').map(b => b.trim());
    }

    const newImage = getImagePath(req);
    if (newImage) {
      service.image = newImage;
    } else if (req.body.image !== undefined) {
      service.image = req.body.image;
    }

    const updatedService = await service.save();
    res.json({ success: true, data: updatedService });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await service.deleteOne();
    res.json({ success: true, message: 'Service removed successfully' });
  } catch (error) {
    next(error);
  }
};
