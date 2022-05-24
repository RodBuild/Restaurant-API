const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviews');
const validation = require('../validation/middleware');

/*GET*/
router.get('/', controller.getAll);
router.get('/:id', controller.getReviewID);
router.get('/state/', controller.getReviewState);
router.get('/:email', controller.getReviewEmail);
// router.get('/:states', controller.getReviewState);

/*POST*/
router.post('/', validation.saveReview, controller.createReview);

/*PUT*/
router.put('/:id', validation.saveReview, controller.editReviewID);
router.put('/:email/:city/:state', validation.saveReview, controller.editReview);

/*DELETE*/
router.delete('/:id', controller.deleteReviewID);
router.delete('/:email/:city/:state', controller.deleteReview);

module.exports = router;
