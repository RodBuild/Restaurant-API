const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

/**************************
 * To get all menu items: *
 *    Takes no params     *
 **************************/
const getAll = async (req, res) => {
  try {
    const data = await mongodb.getDb().db().collection('menu').find();
    data.toArray((err, lists) => {
      // if data is empty -> not found
      if (err) {
        res.status(400).json({ message: err });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*************************
 * To get one menu item: *
 *    Takes an id        *
 *************************/
const getSingle = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID to find a menu item.');
  } else {
    const itemId = new ObjectId(req.params.id);
    mongodb
      .getDb()
      .db()
      .collection('menu')
      .find({ _id: itemId })
      .toArray((err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        } else if (result.length === 0) {
          res.status(404).json(`No menu item was found with ID: ${itemId}`);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result[0]);
        }
      });
  }
};

/******************************
 * To create a new menu item: *
 *    Takes no params         *
 ******************************/
const createMenuItem = async (req, res) => {
  const newItem = {
    name: req.body.name,
    description: req.body.description,
    calories: req.body.calories,
    price: req.body.price,
    image: req.body.image
  };
  const response = await mongodb.getDb().db().collection('menu').insertOne(newItem);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to create a new menu item.`);
  }
};

/*************************
 * To edit a menu item:  *
 *    Takes a name param *
 *************************/
const editMenuItem = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID to update a menu item.');
  } else {
    const itemId = new ObjectId(req.params.id);
    const newItem = {
      name: req.body.name,
      description: req.body.description,
      calories: req.body.calories,
      price: req.body.price,
      image: req.body.image
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection('menu')
      .replaceOne({ _id: itemId }, newItem);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error ||
            `Something went wrong while attempting to update menu item with ID: ${itemId}`
        );
    }
  }
};

/**************************
 * To delete a menu item: *
 *    Takes no params     *
 **************************/
const deleteMenuItem = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID to delete a menu item.');
  } else {
    const itemId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('menu').deleteOne({ _id: itemId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error ||
            `Something went wrong while attempting to delete menu item with id: ${itemId}`
        );
    }
  }
};

module.exports = {
  getAll,
  getSingle,
  createMenuItem,
  editMenuItem,
  deleteMenuItem
};
