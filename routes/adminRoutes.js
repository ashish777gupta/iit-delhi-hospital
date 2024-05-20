const express = require("express");
const {
  getAllUsersController,
  getAllDoctorsController,
  registerDoctor,
  updateRoomController,
  scheduleController,
  addScheduleController,
  getUserDataController,
  getAppointmentByIdController,
  handleCheckInUserController,
  handleCheckInAndOutController,
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//GET METHOD || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

router.post("/add-doctor", registerDoctor);

router.post("/updateRoomNumber", updateRoomController)

router.post("/getSchedule", authMiddleware, scheduleController);

router.post("/schedule", authMiddleware, addScheduleController);

router.post("/getAppointmentById", authMiddleware, getAppointmentByIdController);

router.post("/handleCheckInAndOutUser", authMiddleware, handleCheckInAndOutController);

router.post("/getUser", getUserDataController);

module.exports = router;