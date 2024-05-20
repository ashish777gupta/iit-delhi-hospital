const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  loginController,
  registerController,
  authController,
  getProfileController,
  getDoctorController,
  bookAppointmentController,
  scheduleAppointmentController,
  getWaitingNumberController,
  bookedAppointmentsByDateController,
  getScheduleController,
  getScheduleByIdController,
  getBookedAppointmentsByScheduleController,
  getAllDoctorsController,
  getUserAppointmentsController,
  getDoctorsByIdController,
} = require("../controllers/userCtrl");

const router = express.Router();

router.post("/login", loginController);

router.post("/register", registerController);

router.post("/getUserData", authMiddleware, authController);

router.post("/profile", authMiddleware, getProfileController);

router.post("/getDoctor", authMiddleware, getDoctorController);

router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

router.post("/getWaitingNumber", authMiddleware, getWaitingNumberController);

router.post("/bookAppointment", authMiddleware, bookAppointmentController);

router.get("/getAllSchedule", authMiddleware, getScheduleController);

router.post("/getScheduleById", authMiddleware, getScheduleByIdController);

router.post(
  "/getBookedAppointmentsBySchedule",
  authMiddleware,
  getBookedAppointmentsByScheduleController
);

router.post(
  "/schedule-appointment",
  authMiddleware,
  scheduleAppointmentController
);

router.post(
  "/bookedAppointmentsByDate",
  authMiddleware,
  bookedAppointmentsByDateController
);

router.post(
  "/getUserAppointments",
  authMiddleware,
  getUserAppointmentsController
);

router.post("/getDoctorsById", authMiddleware, getDoctorsByIdController);

module.exports = router;
