const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

/*********
 * Regex *
 *********/
var rgx_letters = /^[A-Za-z\s]+$/;
var rgx_email = /^\S+@\S+\.\S+$/;

/***********************
 * To get all reviews: *
 *    Takes no params  *
 ***********************/
const getAll = async (req, res) => {
  try {
    const data = await mongodb.getDb().db().collection('reviews').find();
    data.toArray().then((lists) => {
      // if response is empty -> not found
      if (lists.length === 0) {
        res.status(404).json(`Failed to load, requested content could not be found`);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*****************************
 * To get a specific review: *
 *    Takes an id as params  *
 *****************************/
const getReviewID = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID to get a review.');
  } else {
    const reviewId = new ObjectId(req.params.id);
    mongodb
      .getDb()
      .db()
      .collection('reviews')
      .find({ _id: reviewId })
      .toArray((err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        } else if (result.length === 0) {
          res.status(404).json(`No review was found with ID: ${reviewId}`);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result[0]);
        }
      });
  }
};

/*******************************
 * To get a specific review:   *
 *    Takes an email as params *
 *******************************/
const getReviewEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    if (!email.match(rgx_email)) {
      res.status(412).json(`The email format is invalid.`);
    } else {
      const response = await mongodb.getDb().db().collection('reviews').find({ email: email });
      response.toArray().then((lists) => {
        if (lists.length === 0) {
          res.status(404).json(`No reviews were found with email: ${email}`);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(lists);
        }
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/*******************************
 * To get a specific review:   *
 *    Takes an state as params *
 *******************************/
const getReviewState = async (req, res) => {
  try {
    // query.state -> data from URL
    const state = req.query.state.toLowerCase();
    const response = await mongodb.getDb().db().collection('reviews').find({ state: state });
    response.toArray().then((lists) => {
      if (lists.length === 0) {
        res.status(404).json(`No reviews were found on state: ${state}`);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

/**************************
 * To create a review:    *
 *    Takes no new params *
 **************************/
const createReview = async (req, res) => {
  try {
    // Lowercase email, city, state because they are used on database
    // querrying, case sensitive search
    const newReview = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email.toLowerCase(),
      review: req.body.review,
      stars: req.body.stars,
      city: req.body.city.toLowerCase(),
      state: req.body.state.toLowerCase()
    };
    const response = await mongodb.getDb().db().collection('reviews').insertOne(newReview);
    if (response.acknowledged) {
      console.log('POST new review -- success');
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json(response.error || `Something went wrong while attempting to add a the new menu item`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/****************************
 * To edit a review:        *
 *    Takes an id as params *
 ****************************/
const editReviewID = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID to update a menu item.');
  } else {
    const reviewId = new ObjectId(req.params.id);
    const newReview = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email.toLowerCase(),
      review: req.body.review,
      stars: req.body.stars,
      city: req.body.city.toLowerCase(),
      state: req.body.state.toLowerCase()
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection('reviews')
      .replaceOne({ _id: reviewId }, newReview);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error ||
            `Something went wrong while attempting to update review with ID: ${reviewId}`
        );
    }
  }
};

/****************************************
 * To edit a review:                    *
 *    Takes a email, city, state params *
 ****************************************/
const editReview = async (req, res) => {
  try {
    // lowercase them
    const email = req.params.email.toLowerCase();
    const city = req.params.city.toLowerCase();
    const state = req.params.state.toLowerCase();
    // Lowercase email, city, state because they are used on database
    // querrying, case sensitive search
    // validate user's input
    if (!email.match(rgx_email)) res.status(412).json(`The email format is invalid.`);
    else if (!city.match(rgx_letters)) res.status(412).json(`The city format is invalid.`);
    else if (!state.match(rgx_letters)) res.status(412).json(`The state format is invalid.`);
    else {
      const newReview = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.params.email.toLowerCase(),
        review: req.body.review,
        stars: req.body.stars,
        city: req.params.city.toLowerCase(),
        state: req.params.state.toLowerCase()
      };
      const response = await mongodb
        .getDb()
        .db()
        .collection('reviews')
        .replaceOne({ email: email, city: city, state: state }, newReview);

      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res
          .status(500)
          .json(
            response.error ||
              `Something went wrong while attempting to update review with email ${email}, city ${city} and state ${state}`
          );
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/****************************
 * To delete a review:      *
 *    Takes an id as params *
 ****************************/
const deleteReviewID = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID to delete a menu item.');
  } else {
    const reviewId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('reviews')
      .deleteOne({ _id: reviewId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error ||
            `Something went wrong while attempting to delete review with id: ${reviewId}`
        );
    }
  }
};

/****************************************
 * To delete a review:                    *
 *    Takes a email, city, state params *
 ****************************************/
const deleteReview = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const city = req.params.city.toLowerCase();
    const state = req.params.state.toLowerCase();
    // validate user's input
    if (!email.match(rgx_email)) res.status(412).json(`The email format is invalid.`);
    else if (!city.match(rgx_letters)) res.status(412).json(`The city format is invalid.`);
    else if (!state.match(rgx_letters)) res.status(412).json(`The state format is invalid.`);
    else {
      const response = await mongodb
        .getDb()
        .db()
        .collection('reviews')
        .deleteOne({ email: email, city: city, state: state }, true);

      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        res
          .status(500)
          .json(
            response.error ||
              `Something went wrong while attempting to delete review with email ${email}, city ${city} and state ${state}`
          );
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getAll,
  getReviewID,
  getReviewEmail,
  getReviewState,
  createReview,
  editReviewID,
  editReview,
  deleteReviewID,
  deleteReview
};
