const Product = require('../models/Product');
const { isCloudinaryConfigured } = require('../config/cloudinary');

// Helper to get image paths from req.files
const getImagesPaths = (req) => {
  if (req.files && req.files.length > 0) {
    return req.files.map(file => {
      if (isCloudinaryConfigured) {
        return file.path;
      } else {
        return `/uploads/${file.filename}`;
      }
    });
  }
  return [];
};

// @desc    Get all products (with search, category, and sorting filters)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let productsQuery = Product.find(query);

    // Sorting
    if (sort) {
      if (sort === 'price-low') {
        productsQuery = productsQuery.sort({ pricing: 1 });
      } else if (sort === 'price-high') {
        productsQuery = productsQuery.sort({ pricing: -1 });
      } else if (sort === 'newest') {
        productsQuery = productsQuery.sort({ createdAt: -1 });
      }
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 }); // Default to newest
    }

    const products = await productsQuery;
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, pricing, category, stock } = req.body;

    const images = getImagesPaths(req);
    if (images.length === 0 && req.body.images) {
      if (Array.isArray(req.body.images)) {
        images.push(...req.body.images);
      } else {
        images.push(req.body.images);
      }
    }

    const product = await Product.create({
      name,
      description,
      pricing,
      category,
      stock: stock || 0,
      images
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, description, pricing, category, stock } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.pricing = pricing !== undefined ? pricing : product.pricing;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;

    const newImages = getImagesPaths(req);
    if (newImages.length > 0) {
      product.images = newImages;
    } else if (req.body.images) {
      product.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide a rating and a comment' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    };

    product.reviews.push(review);
    await product.save();

    res.status(201).json({ success: true, message: 'Review added successfully', data: product });
  } catch (error) {
    next(error);
  }
};
