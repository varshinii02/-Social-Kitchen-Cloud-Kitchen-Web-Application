import asyncHandler from 'express-async-handler';
import FAQ from '../models/faqModel.js';

// @desc    Create a new FAQ entry
// @route   POST /api/faq
// @access  Public
const createFAQ = asyncHandler(async (req, res) => {
  const { name, email, comment } = req.body;

  if (!name || !email || !comment) {
    res.status(400);
    throw new Error('Please provide name, email, and comment');
  }

  const faqEntry = new FAQ({
    name,
    email,
    comment,
  });

  const createdFAQ = await faqEntry.save();
  res.status(201).json(createdFAQ);
});

// @desc    Get all FAQ entries
// @route   GET /api/faq
// @access  Public
const getFAQs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find({});
  res.json(faqs);
});

// @desc    Update answer for a FAQ entry
// @route   PUT /api/faq/:id/answer
// @access  Private/Admin
const updateAnswer = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (faq) {
    faq.answer = req.body.answer || faq.answer;

    const updatedFAQ = await faq.save();
    res.json(updatedFAQ);
  } else {
    res.status(404);
    throw new Error('FAQ entry not found');
  }
});

// @desc    Delete a FAQ entry
// @route   DELETE /api/faq/:id
// @access  Private/Admin
const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (faq) {
    await faq.remove();
    res.json({ message: 'FAQ entry removed' });
  } else {
    res.status(404);
    throw new Error('FAQ entry not found');
  }
});

export { createFAQ, getFAQs, updateAnswer, deleteFAQ };
