const { Task, User } = require('../models');
const { Op } = require('sequelize');

const createTask = async (data, userId) => {
  const task = await Task.create({
    title: data.title,
    description: data.description,
    status: data.status || 'PENDING',
    priority: data.priority || 'MEDIUM',
    assignedTo: data.assignedTo || null,
    createdBy: userId,
    dueDate: data.dueDate || null,
  });

  return task;
};

const getTasks = async (user, query) => {
  const { status, priority, page = 1, limit = 10 } = query;
  const offset = (page - 1) * limit;

  const where = {};

  if (user.role === 'USER') {
    where.assignedTo = user.id;
  }

  if (status) where.status = status;
  if (priority) where.priority = priority;

  const { count, rows } = await Task.findAndCountAll({
    where,
    include: [
      { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
  });

  return {
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
    tasks: rows,
  };
};

const getTaskById = async (taskId, user) => {
  const task = await Task.findByPk(taskId, {
    include: [
      { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
    ],
  });

  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  if (user.role === 'USER' && String(task.assignedTo) !== String(user.id)) {
    const err = new Error('Access denied');
    err.status = 403;
    throw err;
  }

  return task;
};

const updateTask = async (taskId, data, user) => {
  const task = await Task.findByPk(taskId);

  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  if (user.role === 'USER') {
    if (String(task.assignedTo) !== String(user.id)) {
      const err = new Error('Access denied');
      err.status = 403;
      throw err;
    }
    if (data.status) task.status = data.status;
  } else {
    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.status !== undefined) task.status = data.status;
    if (data.priority !== undefined) task.priority = data.priority;
    if (data.assignedTo !== undefined) task.assignedTo = data.assignedTo;
    if (data.dueDate !== undefined) task.dueDate = data.dueDate;
  }

  await task.save();
  return task;
};

const deleteTask = async (taskId) => {
  const task = await Task.findByPk(taskId);

  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  await task.destroy();
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
