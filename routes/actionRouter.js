const express = require('express');
const router = express.Router();

const Actions = require('../data/helpers/actionModel');

// CREATE NEW ACTION
router.post('/', validateAction, (req, res) => {
  Actions.insert(req.body)
  .then(action => {
    res.status(201).json({ success: "New action created", action })
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Action not created", err })
  })
});

// RETRIEVE ALL ACTIONS
router.get('/', (req, res) => {
  Actions.get()
    .then(actions => {
      res.status(201).json(actions)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Unable to fetch all actions", err })
    })
});

// RETRIEVE ACTION BY ID
router.get('/:id', validateActionId, (req, res) => {
  const { id } = req.params.id;
  Actions.getById(id)
    .then(action => {
			res.status(200).json(action)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Unable to fetch action by ID", err })
    })
});

// UPDATE ACTION
router.put('/:id', validateAction, validateActionId, (req, res) => {
  const { id } = req.params.id;
  const { body } = req.body;
  Actions.update(id, body)
  .then(action => {
    res.status(201).json(action)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Unable to update action", err })
  })
});

// DELETE ACTION
router.delete('/:id', validateActionId, (req, res) => {
  const { id } = req.params.id;
  Actions.getById(id)
  .then(action => {
    action
      ? Actions.remove(id)
        .then(deleted => {
          deleted
            ? res.status(200).json({ success: `Action ${id} deleted`, info: action })
            : null
        })
        : null
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Unable to delete action", err })
  })
});

// MIDDLEWARE

function validateActionId(req, res, next) {
  const { id } = req.params.id;
  Actions.getById(id)
  .then(action => {
    action
      ? req.action
      : res.status(400).json({ errorMessage: "Invalid action id", err })
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Unable to validate action", err })
  })
  next();
};

function validateAction(req, res, next) {
  const { description, notes } = req.body;
  if(!req.body){
    res.status(400).json({ errorMessage: "Missing action data" })
  } else if(!description || !notes){
    res.status(400).json({ errorMessage: "Missing required information field" })
  } else next();
};

module.exports = router;