const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost/AddTasks");

const UserTasks = mongoose.model("UserTask", {
  name: {
    type: String,
    default: "",
  },
});

app.post("/create", async (req, res) => {
  try {
    const Task = new UserTasks({
      name: req.body.name,
    });
    console.log(Task);
    await Task.save();
    res.status(201).json({ message: "new task added" });
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.get("/", async (req, res) => {
  //console.log("new route");
  try {
    const Tasks = await UserTasks.find();
    res.json(Tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/task-update", async (req, res) => {
  try {
    if (req.body.id && req.body.name) {
      const newUpdate = await UserTasks.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
      });
      await newUpdate.save();
      res.json({ message: "Task updated" });
    } else {
      res.json({ message: "Missing parameters" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/delete", async (req, res) => {
  try {
    if (req.body.id) {
      await UserTasks.findByIdAndDelete(req.body.id);
      res.json({ message: "Task successfully deleted" });
    } else {
      res.json({ message: "missing id" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("server launched");
});
