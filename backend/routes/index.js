const router = require('express').Router();
const reviews = require('./reviews');
const menu = require('./menu');
// const users = require('./users');

router.use('/reviews', reviews);
router.use('/menu', menu);
router.use('/', (req, res) => {
  let info = {
    github: 'https://github.com/RodBuild/Backend-Dev;',
    creator: 'Rodrigo Rodriguez'
  };
  res.send(info);
});

module.exports = router;