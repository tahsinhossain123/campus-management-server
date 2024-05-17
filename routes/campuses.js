/*==================================================
/routes/campuses.js

It defines all the campuses-related routes.
==================================================*/
// Import Express module
const express = require('express');
// Create an Express router function called "router"
const router = express.Router();
// Import database models
const { Student, Campus } = require('../database/models');
// Import a middleware to replace "try and catch" for request handler, for a concise coding (fewer lines of code)
const ash = require('express-async-handler');

/* GET ALL CAMPUSES: async/await using "try-catch" */
// router.get('/', async (req, res, next) => {
//   try {
//     let campuses = await Campus.findAll({include: [Student]});
//     res.status(200).json(campuses);
//   } 
//   catch(err) {
//     next(err);
//   }
// });

/* GET ALL CAMPUSES */
router.get('/', ash(async (req, res) => {
  let campuses = await Campus.findAll({ include: [Student] });  // Get all campuses and their associated students
  res.status(200).json(campuses);  // Status code 200 OK - request succeeded
}));

/* GET CAMPUS BY ID */
router.get('/:id', ash(async (req, res) => {
  // Find campus by Primary Key
  let campus = await Campus.findByPk(req.params.id, { include: [Student] });  // Get the campus and its associated students
  if (campus) {
    res.status(200).json(campus);  // Status code 200 OK - request succeeded
  } else {
    res.status(404).json({ error: 'Campus not found' });  // Status code 404 Not Found
  }
}));

/* ADD NEW CAMPUS */
router.post('/', function (req, res, next) {
  Campus.create(req.body)
    .then(createdCampus => res.status(201).json(createdCampus)) // Status code 201 Created - successful creation of a resource
    .catch(err => next(err));
});

/* EDIT CAMPUS */
router.put('/:id', ash(async (req, res) => {
  const [updated] = await Campus.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  if (updated) {
    let campus = await Campus.findByPk(req.params.id, { include: [Student] });  // Get the campus and its associated students
    res.status(200).json(campus);  // Status code 200 OK - request succeeded
  } else {
    res.status(404).json({ error: 'Campus not found' });  // Status code 404 Not Found
  }
}));

/* DELETE CAMPUS */
router.delete('/:id', ash(async (req, res) => { // Deletes the campus based on the id
  const deleted = await Campus.destroy({
    where: {
      id: req.params.id
    }
  });
  if (deleted) {
    res.status(200).json("Deleted a campus!");  // Status code 200 OK - request succeeded
  } 
  else {
    res.status(404).json({ error: 'Campus not found' });  // Status code 404 Not Found
  }
}));

// Export router, so that it can be imported to construct the apiRouter (app.js)
module.exports = router;
