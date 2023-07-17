const express = require("express");
const { BoardModel } = require("../Models/board.model");
const boardRouter = express.Router();

boardRouter.get("/", async (req, res) => {
  try {
    const boards = await BoardModel.find();
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

boardRouter.get("/boards/:_id", async (req, res) => {
  const id = req.params._id;
  try {
    const board = await BoardModel.findOne({ _id: id });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

boardRouter.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    // console.log(req.body);
    const newBoard = new BoardModel({ name, task: [] });
    await newBoard.save();
    res.status(200).json({ msg: "Succes Created Board" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

boardRouter.post("/boards/:_id/tasks", async (req, res) => {
  const id = req.params._id;
  const newTask = req.body;
  try {
    const board = await BoardModel.findOne({ _id: id });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    board.tasks.push(newTask);
    await board.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

boardRouter.post("/boards/:_id/tasks/:taskId/subtasks", async (req, res) => {
  const id = req.params._id;
  const taskId = req.params.taskId;
  const newSubtask = req.body;
  try {
    const board = await BoardModel.findOne({ _id: id });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    const task = board.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    task.subtasks.push(newSubtask);
    await board.save();
    res.status(201).json(newSubtask);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

boardRouter.patch(
  "/boards/:_id/tasks/:taskId/subtasks/:subtaskId",
  async (req, res) => {
    const id = req.params._id;
    const taskId = req.params.taskId;
    const subtaskId = req.params.subtaskId;
    const isCompleted = req.body.isCompleted;
    try {
      const board = await BoardModel.findOne({ _id: id });
      if (!board) {
        return res.status(404).json({ error: "Board not found" });
      }
      const task = board.tasks.id(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      const subtask = task.subtasks.id(subtaskId);
      if (!subtask) {
        return res.status(404).json({ error: "Subtask not found" });
      }
      subtask.isCompleted = isCompleted;
      await board.save();
      res.json(subtask);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = { boardRouter };
