const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviews');

/*GET*/
router.get('/', controller.getAll);
router.get('/state/', controller.getReviewState);
router.get('/:email', controller.getReviewEmail);
// router.get('/:states', controller.getReviewState);

/*POST*/
router.post('/', controller.createReview);

/*PUT*/
router.put('/:email/:city/:state', controller.editReview);

/*DELETE*/
router.delete('/:email/:city/:state', controller.deleteReview);

module.exports = router;
