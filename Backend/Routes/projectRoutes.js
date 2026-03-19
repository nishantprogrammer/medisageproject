import express from 'express';
import { createProject, getAllProjects, getProjectById, deleteProject } from '../Controllers/project.js';
import { createTask, getTasksByProject } from '../Controllers/task.js';

const router = express.Router();

router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.delete('/:id', deleteProject);

// Task routes nested under projects
router.post('/:project_id/tasks', createTask);
router.get('/:project_id/tasks', getTasksByProject);

export default router;
