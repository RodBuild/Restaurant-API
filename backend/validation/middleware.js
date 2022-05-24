const validator = require('./helpers');

// For validating JSON of Menu
const saveMenuItem = (req, res, next) => {
  const validationRule = {
    // email: 'required|email',
    // username: 'required|string',
    // phone: 'required|string',
    // password: 'required|string|min:6|confirmed',
    // gender: 'string',
    name: 'required|string',
    description: 'required|string',
    calories: 'required|string',
    price: 'required|string',
    image: 'string'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

// For validating JSON of Reviews
const saveReview = (req, res, next) => {
  const validationRule = {
    firstName: 'required|string|min:1',
    lastName: 'required|string|min:1',
    phone: 'required|string|max:10|min:10',
    email: 'required|email',
    review: 'required|string|min:10',
    stars: 'required|string|max:1|min:1',
    city: 'required|string',
    state: 'required|string',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

// For validating JSON of Reviews without email, city, state
const saveReviewShort = (req, res, next) => {
  const validationRule = {
    firstName: 'required|string|min:1',
    lastName: 'required|string|min:1',
    phone: 'required|string|max:10|min:10',
    review: 'required|string|min:10',
    stars: 'required|string|max:1|min:1',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

// For validating JSON of users
const saveUser = (req, res) => {

};

module.exports = {
  saveMenuItem,
  saveReview,
  saveReviewShort,
  saveUser,
};
