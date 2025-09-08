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

router.route('/')
    .get(getTasks)
    .post(createTask);


router.get('/search', searchTasks);

router.route('/:id')
    .get(getTask)
    .patch(updateTask) 
    .delete(deleteTask);

module.exports = router;