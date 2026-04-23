const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createTaskSchema, updateTaskSchema } = require('../validators/task.validator');

router.use(authenticate);

router.post('/', requireAdmin, validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', requireAdmin, taskController.deleteTask);

module.exports = router;
