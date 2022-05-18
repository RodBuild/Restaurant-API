const { response } = require('express');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

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

/*******************************
 * To get a specific review:   *
 *    Takes an email as params *
 *******************************/
const getReviewEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const result = await mongodb.getDb().db().collection('reviews').find({ email: email });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
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
    const result = await mongodb.getDb().db().collection('reviews').find({ state: state });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
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
    const response = await mongodb.getDb().db().collection('reviews').insert(newReview);
    if (response.acknowledged) {
      console.log('POST new review -- success');
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json(
          response.error ||
            `Something went wrong while attempting to publish the new review, email -> ${newReview.email}`
        );
    }
  } catch (err) {
    res.status(500).json(err);
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
    const result = await mongodb
      .getDb()
      .db()
      .collection('reviews')
      .replaceOne({ email: email, city: city, state: state }, newReview);

    if (result.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error ||
            `Something went wrong while attempting to update review with email ${email}, city ${city} and state ${state}`
        );
    }
  } catch (err) {
    res.status(500).json(err);
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
    const result = await mongodb
      .getDb()
      .db()
      .collection('reviews')
      .remove({ email: email, city: city, state: state }, true);

    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          result.error ||
            `Something went wrong while attempting to delete review with email ${email}, city ${city} and state ${state}`
        );
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getAll,
  createReview,
  getReviewEmail,
  getReviewState,
  editReview,
  deleteReview
};
