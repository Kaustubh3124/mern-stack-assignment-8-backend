const express = require('express');
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    searchTasks
} = require('../controllers/taskController');

const router = express.Router();

// Base routes for getting all tasks and creating a new one
router.route('/')
    .get(getTasks)
    .post(createTask);

// Search route
router.get('/search', searchTasks);

// Routes for a specific task by ID
router.route('/:id')
    .get(getTask)
    .patch(updateTask)
    .delete(deleteTask);

// Route to update just the status of a task
router.patch('/:id/status', updateTaskStatus);

module.exports = router;