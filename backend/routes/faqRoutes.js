import express from 'express';
const router = express.Router();
import { createFAQ, getFAQs, updateAnswer, deleteFAQ } from '../controllers/faqController.js';

router.route('/').post(createFAQ).get(getFAQs);
router.route('/:id/answer').put(updateAnswer);
router.route('/:id').delete(deleteFAQ);

export default router;
