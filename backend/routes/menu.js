const express = require('express');
const router = express.Router();
const controller = require('../controllers/menu');
const validation = require('../validation/middleware')

/* GET */
router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);

/* POST */
router.post('/', validation.saveMenuItem, controller.createMenuItem);

/* PUT */
router.put('/:id', validation.saveMenuItem, controller.editMenuItem);

/* DELETE */
router.delete('/:id', controller.deleteMenuItem);


module.exports = router;
