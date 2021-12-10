const Task = require("../model/Task");

exports.getTasks = async function (req, res) {
  const page = parseInt(req.query.page);

  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  try {
    const tasks = await Task.find({ authorID: req.apiUser._id })
      .limit(endIndex)
      .skip(startIndex)
      .exec();

    const prev = {};
    const next = {};

    if (
      endIndex <
      (await Task.countDocuments({ authorID: req.apiUser._id }).exec())
    ) {
      next.page = page + 1;
      next.limit = limit;
      console.log("getting this far 1");
    }

    if (startIndex > 0) {
      prev.page = page - 1;
      prev.limit = limit;
      console.log("getting this far 2");
    }

    console.log(endIndex, tasks.length);

    res.status(200).json({ data: { tasks, prev, next } });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong", error: err });
  }
};

exports.viewTask = async function (req, res) {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    res.status(200).json({ data: task });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", error: err });
  }
};

exports.addTask = async function (req, res) {
  const title = req.body.title;
  const startValue = parseInt(req.body.startValue);
  const maxValue = parseInt(req.body.maxValue);

  console.log(req.apiUser);

  try {
    const task = await Task.create({
      title,
      startValue,
      maxValue,
      authorID: req.apiUser._id,
    });

    await task.save();

    res.status(201).json({ data: task, message: "Task created successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong", error: err });
  }
};

exports.updateTask = async function (req, res) {
  const { title, startValue, maxValue } = req.body;

  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    task.title = title;
    task.startValue = parseInt(startValue);
    task.maxValue = parseInt(maxValue);

    await task.save();

    res.status(201).json({ data: task, message: "Task updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong", error: err });
  }
};

exports.deleteTask = async function (req, res) {
  try {
    const { id } = req.params;

    await Task.findByIdAndDelete(id);

    res.status(201).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", error: err });
  }
};
