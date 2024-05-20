const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const scheduleModel = require("../models/scheduleModel");
const appointmentModel = require("../models/appointmentModel");
const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while fetching users",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors Data list",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting doctors data",
      error,
    });
  }
};

const registerDoctor = async (req, res) => {
  // console.log(req.body)
  try {
    const existingDoctor = await doctorModel.findOne({
      phone: req.body.phone,
    });
    if (existingDoctor) {
      return res
        .status(200)
        .send({ message: `Doctor already Exist`, success: false });
    }
    req.body.password = "12345";
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newDoctor = new doctorModel(req.body);
    await newDoctor.save();
    res
      .status(201)
      .send({ message: `Doctor added Succesfully`, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Register Controller ${error}`,
    });
  }
};

const updateRoomController = async (req, res) => {
  try {
    const { doctorId, roomNo } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { roomNo });
    await doctor.save();
    res.status(201).send({
      success: true,
      message: "Room Number Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Room Update Controller ${error}`,
    });
  }
};

const scheduleController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById({ _id: req.body.doctorId });
    doctor.password = undefined;
    if (!doctor) {
      return res.status(200).send({
        message: "Doctor not found!",
        status: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: doctor,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Fetching Doctor Schedule Controller ${error}`,
    });
  }
};

const addScheduleController = async (req, res) => {
  try {
    const schedule = {
      doctorId: req.body.id,
      date: req.body.date,
      time: req.body.time,
      recurrence: req.body.recurrence,
      selectedDays: req.body.selectedDays,
      weekends: req.body.weekends,
      validTillDate: req.body.validTillDate,
    };

    let lastScheduleId = null;

    const doctorByID = await doctorModel.findById(req.body.id);
    if (doctorByID.scheduleId.length > 0) {
      const lastSchedule = await scheduleModel.findById(
        doctorByID.scheduleId[doctorByID.scheduleId.length - 1]
      );
      lastScheduleId = lastSchedule._id;

      const currentDate = new Date()
        .toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");
      const validTillDate = new Date(
        lastSchedule.validTillDate.split("-").reverse().join("-")
      );

      console.log(currentDate);
      console.log(validTillDate);

      const updatedValidTillDate = new Date(
        req.body.date.split("-").reverse().join("-")
      );
      updatedValidTillDate.setDate(updatedValidTillDate.getDate() - 1);

      const formattedDate =
        ("0" + updatedValidTillDate.getDate()).slice(-2) +
        "-" +
        ("0" + (updatedValidTillDate.getMonth() + 1)).slice(-2) +
        "-" +
        updatedValidTillDate.getFullYear();

      await scheduleModel.findByIdAndUpdate(
        lastScheduleId,
        {
          validTillDate: formattedDate,
        },
        { new: true }
      );
    }

    const newSchedule = new scheduleModel(schedule);
    await newSchedule.save();

    await doctorModel.findByIdAndUpdate(
      req.body.id,
      { $push: { scheduleId: newSchedule._id } },
      { new: true }
    );

    res.status(201).send({
      success: true,
      message: "Schedule Updated",
      data: newSchedule,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Fetching Doctor Schedule Controller ${error}`,
    });
  }
};

const getUserDataController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "User not found!",
        status: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Fetching User Details ${error}`,
    });
  }
};

const getAppointmentByIdController = async (req, res) => {
  try {
    const appointmentIds = req.body.appointmentIds;
    const appointments = await appointmentModel.find({ _id: { $in: appointmentIds } });
    if (!appointments) {
      return res.status(200).send({
        message: "Appointment not found!",
        status: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: appointments,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Fetching Appoinment Details ${error}`,
    });
  }
};

const handleCheckInAndOutController = async (req, res) => {
  try {
    const appointmentId = req.body.appointmentId;
    const previousAppointment = await appointmentModel.findById({ _id: appointmentId });
    const checkInOrOut = previousAppointment.checkIn;
    console.log(checkInOrOut);
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        checkIn: !checkInOrOut,
      },
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(200).send({
        message: "Error! Appoinment not fount",
        status: false,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Successfully updated the Check in & out for the user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in while checking in the user ${error}`,
    });
  }
};

module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  registerDoctor,
  updateRoomController,
  scheduleController,
  addScheduleController,
  getUserDataController,
  getAppointmentByIdController,
  handleCheckInAndOutController
};
