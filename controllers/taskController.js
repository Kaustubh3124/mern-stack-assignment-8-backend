const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const { status, priority, sortBy = 'createdAt', order = 'asc', page = 1, limit = 10 } = req.query;

        const query = {};
        if (status) query.isCompleted = status === 'completed';
        if (priority) query.priority = priority;

        const sortOrder = order === 'desc' ? -1 : 1;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);``
        const skip = (pageNum - 1) * limitNum;

        const tasks = await Task.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limitNum);

        const totalTasks = await Task.countDocuments(query);

        res.json({
            success: true,
            pagination: {
                total: totalTasks,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalTasks / limitNum)
            },
            data: tasks
        });
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        res.status(500).json({ success: false, error: 'Server error while fetching tasks.' });
    }
};

exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.json({ success: true, data: task });
    } catch (error) {
        console.error(`Failed to fetch task ${req.params.id}:`, error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        console.error("Failed to create task:", error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true 
        });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.json({ success: true, message: 'Task updated successfully', data: task });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        console.error(`Failed to update task ${req.params.id}:`, error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.json({ success: true, message: 'Task removed successfully' });
    } catch (error) {
        console.error(`Failed to delete task ${req.params.id}:`, error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.searchTasks = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, error: 'A search query is required' });
        }

        const tasks = await Task.find({
            $text: { $search: query }
        });

        res.json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        console.error("Search failed:", error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};