import { Task } from '../Models/Task.js';

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { title, description, status, priority, due_date } = req.body;

        if (!title || !description || !due_date) {
            return res.status(400).json({ message: "Title, description, and due_date are required" });
        }

        const task = await Task.create({
            project_id,
            title,
            description,
            status: status || 'todo',
            priority: priority || 'low',
            due_date
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get tasks by project ID with filtering and sorting
export const getTasksByProject = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { status, sort, search, page = 1, limit = 10 } = req.query;

        const query = { project_id };
        
        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOption = sort === 'due_date' ? { due_date: 1 } : { createdAt: -1 };

        const tasks = await Task.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Task.countDocuments(query);

        res.json({
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            },
            data: tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update task
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const task = await Task.findByIdAndUpdate(id, updates, { new: true });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
