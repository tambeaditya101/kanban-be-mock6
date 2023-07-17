const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: String,
  isCompleted: Boolean,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  subtasks: [subtaskSchema],
});

const boardSchema = mongoose.Schema(
  {
    name: String,
    tasks: [taskSchema],
  },
  {
    versionKey: false,
  }
);

const BoardModel = mongoose.model("board", boardSchema);

module.exports = {
  BoardModel,
};
