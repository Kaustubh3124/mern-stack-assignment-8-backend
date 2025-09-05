const Task = require('../models/Task'); // Import the Task Mongoose model

// Get all tasks with filtering, sorting, and pagination
exports.getTasks = async (req, res) => {
    try {
        const { status, priority, sortBy = 'createdAt', order = 'asc', page = 1, limit = 10 } = req.query;

        // Build the filter query
        const query = {};
        if (status) query.isCompleted = status === 'completed';
        if (priority) query.priority = priority;

        // Sorting
        const sortOrder = order === 'desc' ? -1 : 1;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const tasks = await Task.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit));

        const totalTasks = await Task.countDocuments(query);

        res.json({
            success: true,
            count: tasks.length,
            total: totalTasks,
            pagination: { page: parseInt(page), limit: parseInt(limit) },
            data: tasks
        });
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        res.status(500).json({ success: false, error: 'Something went wrong on our end.' });
    }
};