const express = require('express');
const router = express.Router();
const controller = require('../controllers/menu');
const validation = require('../validation/middleware')
const { requiresAuth } = require('express-openid-connect');

/* GET */
router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);

/* POST */
router.post('/', requiresAuth(), validation.saveMenuItem, controller.createMenuItem);

/* PUT */
router.put('/:id', requiresAuth(), validation.saveMenuItem, controller.editMenuItem);

/* DELETE */
router.delete('/:id', requiresAuth(), controller.deleteMenuItem);


module.exports = router;
