const express = require('express');
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    searchTasks
} = require('../controllers/taskController');

const router = express.Router();

// Main collection routes
router.route('/')
    .get(getTasks)
    .post(createTask);

// Search is a special GET route, so it comes before routes with /:id
router.get('/search', searchTasks);

// Routes for a single document by ID
router.route('/:id')
    .get(getTask)
    .patch(updateTask) // PATCH is used for partial updates
    .delete(deleteTask);

module.exports = router;