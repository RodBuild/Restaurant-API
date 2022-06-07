const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviews');
const validation = require('../validation/middleware');
const { body } = require('express-validator');
const { requiresAuth } = require('express-openid-connect');

/*GET*/
router.get('/', requiresAuth(), controller.getAll);
router.get('/state/', requiresAuth(), controller.getReviewState);
router.get('/:id', requiresAuth(), controller.getReviewID);
router.get('/email/:email', requiresAuth(), controller.getReviewEmail);
// router.get('/:states', controller.getReviewState);

/*POST*/
router.post(
  '/',
  requiresAuth(),
  body('stars', 'Star rating should be between 1-5').isInt({ min: 1, max: 5 }),
  validation.saveReview,
  controller.createReview
);

/*PUT*/
router.put(
  '/:id',
  requiresAuth(),
  body('stars', 'Star rating should be between 1-5').isInt({ min: 1, max: 5 }),
  validation.saveReview,
  controller.editReviewID
);
router.put(
  '/:email/:city/:state',
  requiresAuth(),
  body('stars', 'Star rating should be between 1-5').isInt({ min: 1, max: 5 }),
  validation.saveReviewShort,
  controller.editReview
);

/*DELETE*/
router.delete('/:id', requiresAuth(), controller.deleteReviewID);
router.delete('/:email/:city/:state', requiresAuth(), controller.deleteReview);

module.exports = router;
