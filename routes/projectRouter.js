const express = require('express');
const router = express.Router();

const Projects = require('../data/helpers/projectModel');

// CREATE NEW PROJECT
router.post('/', validateProjectId, (req, res) => {
  Projects.insert(req.body)
  .then(project => {
    res.status(201).json({ success: "New project created", project })
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Project not created", err })
  })
});

// RETRIEVE ALL PROJECTS
router.get('/', (req, res) => {
  Projects.get()
    .then(projects => {
      res.status(201).json(projects)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Unable to fetch all projects", err })
    })
});

// RETRIEVE PROJECT BY ID
router.get('/:id', validateProjectId, (req, res) => {
  const { id } = req.params.id;
  Projects.getById(id)
    .then(project => {
			res.status(200).json(project)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Unable to fetch project by ID", err })
    })
});

// RETRIEVE ACTIONS BY PROJECT
router.get('/:id/actions', validateProjectId, (req, res) => {
  const { id } = req.params.id;
  Projects.getProjectActions(id)
    .then(actions => {
			res.status(200).json(actions)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Unable to fetch actions by project", err })
    })
});

// UPDATE PROJECT
router.put('/:id', validateProject, validateProjectId, (req, res) => {
  const { id } = req.params.id;
  const { body } = req.body;
  Projects.update(id, body)
  .then(project => {
    res.status(201).json(project)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Unable to update project", err })
  })
});

// DELETE PROJECT
router.delete('/:id', validateProjectId, (req, res) => {
  const { id } = req.params.id;
  Projects.getById(id)
  .then(project => {
    project
      ? Projects.remove(id)
        .then(deleted => {
          deleted
            ? res.status(200).json({ success: `Project ${id} deleted`, info: project })
            : null
        })
        : null
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Unable to delete project", err })
  })
});

// MIDDLEWARE

function validateProjectId(req, res, next) {
  const { id } = req.params.id;
  Projects.getById(id)
  .then(project => {
    project
      ? req.project
      : res.status(400).json({ errorMessage: "Invalid project id", err })
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Unable to validate project", err })
  })
  next();
};

function validateProject(req, res, next) {
  const { name, description } = req.body;
  if(!req.body){
    res.status(400).json({ errorMessage: "Missing project data" })
  } else if(!name || !description){
    res.status(400).json({ errorMessage: "Missing required information field" })
  } else next();
};

module.exports = router;