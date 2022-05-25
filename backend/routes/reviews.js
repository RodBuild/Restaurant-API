const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviews');
const validation = require('../validation/middleware');
const { body } = require('express-validator');

/*GET*/
router.get('/', controller.getAll);
router.get('/state/', controller.getReviewState);
router.get('/:id', controller.getReviewID);
router.get('/email/:email', controller.getReviewEmail);
// router.get('/:states', controller.getReviewState);

/*POST*/
router.post(
  '/',
  body('stars', 'Star rating should be between 1-5').isInt({ min: 1, max: 5 }),
  validation.saveReview,
  controller.createReview
);

/*PUT*/
router.put(
  '/:id',
  body('stars', 'Star rating should be between 1-5').isInt({ min: 1, max: 5 }),
  validation.saveReview,
  controller.editReviewID
);
router.put(
  '/:email/:city/:state',
  body('stars', 'Star rating should be between 1-5').isInt({ min: 1, max: 5 }),
  validation.saveReviewShort,
  controller.editReview
);

/*DELETE*/
router.delete('/:id', controller.deleteReviewID);
router.delete('/:email/:city/:state', controller.deleteReview);

module.exports = router;
