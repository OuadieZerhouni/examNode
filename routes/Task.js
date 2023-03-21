const express = require("express");
const session = require("express-session");
const Task = require("../models/Task");

const router = express.Router();

router.use(
  session({
    secret: "Ouadie_MERN",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
  })
);

router.get("/tasks", (req, res) => {
  const taskList = req.session.taskList || [];
  res.json(taskList);
});

router.post("/tasks", (req, res) => {
  const text = req.body.text;
  if (text == "" || !text) return res.status(400).send("text required!");
  let taskList = req.session.taskList || [];
  let ordre = taskList.length;
  const task = new Task(text, ordre);
  taskList.push(task);
  req.session.taskList = taskList;
  res.status(201).json(task);
});

router.put("/tasks/:index", (req, res) => {
  const { index } = req.params;
  const { ordre } = req.body;
  let taskList = req.session.taskList || [];
  const task = taskList[index];
  if (!task) {
    return res.status(404).send("Task not found");
  }

  const oldOrdre = task.ordre;
  const newOrdre = Number(ordre);

  task.ordre = newOrdre;

  for (let i = 0; i < taskList.length; i++) {
    const otherTask = taskList[i];
    if (i != index) {
      const otherOrdre = otherTask.ordre;
      if (newOrdre < oldOrdre && otherOrdre >= newOrdre && otherOrdre < oldOrdre) {
        otherTask.ordre++;
      } else if (newOrdre > oldOrdre && otherOrdre <= newOrdre && otherOrdre > oldOrdre) {
        otherTask.ordre--;
      }

      if (otherTask.ordre < 0) {
        otherTask.ordre = 0;
      } else if (otherTask.ordre >= taskList.length) {
        otherTask.ordre = taskList.length - 1;
      }
    }
  }

  req.session.taskList = taskList;
  res.json(task);
});

router.delete("/tasks/:index", (req, res) => {
  const { index } = req.params;
  let taskList = req.session.taskList || [];
  const task = taskList[index];
  if (!task) {
    return res.status(404).send("Task not found!");
  }
  taskList.splice(index, 1);
  req.session.taskList = taskList;
  res.status(200).json(task);
});

module.exports = router;
