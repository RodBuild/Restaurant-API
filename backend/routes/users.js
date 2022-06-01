/* TEST account
        test@test.com
        Test1234567890-
*/
const express = require('express');
const router = express.Router();
// const controller = require('../controllers/reviews');
// const validation = require('../validation/middleware');
const { requiresAuth } = require('express-openid-connect');

// req.isAuthenticated is provided from the auth router
router.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
// Middleware to check for valid user session
router.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

module.exports = router;