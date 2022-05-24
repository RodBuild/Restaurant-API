/* JSON example */
let newreview = {
  firstName: 'Johh',
  lastName: 'Doe',
  phone: '1231231234',
  email: 'jondo@hotmail.com',
  review: 'The food was great. I think! LOL',
  stars: '1',
  city: 'Rexburg',
  state: 'ID'
};
/* Regex */
var letters = /^[A-Za-z]+$/;
var numbers = /(?<!\d)\d{10}(?!\d)/;
var stars = /^[1-5]$/;
var email = /^\S+@\S+\.\S+$/;
var review = /^(?!.*(select|update|insert|delete|union)).*/gim;

const validateReview = (json) => {
  try {
    Object.entries(json).forEach((entry) => {
      // console.log(entry);
      const [key, value] = entry;
      // console.log(`${key}: ${value}`);
      if (key === 'firstName' || key === 'lastName' || key === 'city' || key === 'state') {
        if (value.match(letters)) {
          console.log(value);
        }
      } else if (key === 'email') {
        if (value.match(email)) console.log(value);
      } else if (key === 'review') {
        if (value.match(review)) {
          console.log(value);
        }
      } else if (key === 'phone') {
        if (value.match(numbers)) {
          console.log(value);
        }
      } else if (key === 'stars') {
        if (value.match(stars)) console.log(value);
      } else {
        throw 'Validation of Create Review: FAILED';
      }
    });
  } catch (err) {
    // essential JSON is bad
    // console.log(err);
    return false;
  }

  // if all good, return true
  return true;
}

module.exports = validateReview

// console.log(validateReview(review));
