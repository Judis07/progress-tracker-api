const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const userController = require("../controllers/userController");

router.get("/", userController.isUserAuthenticated, taskController.getTasks);

router.get("/:id", userController.isUserAuthenticated, taskController.viewTask);

router.post("/", userController.isUserAuthenticated, taskController.addTask);

router.post(
  "/:id/edit",
  userController.isUserAuthenticated,
  taskController.updateTask
);

router.post(
  "/:id/delete",
  userController.isUserAuthenticated,
  taskController.deleteTask
);

module.exports = router;
