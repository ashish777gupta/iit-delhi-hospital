const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");

const doctorLoginController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ phone: req.body.phoneNumber });

    if (!doctor) {
      return res
        .status(200)
        .send({ message: "Doctor not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, doctor.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid Phone Number or Password", success: false });
    }
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const doctorAuthController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById({ _id: req.body.doctorId });
    doctor.password = undefined;
    // console.log(user);
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
    res.status(500).send({ message: "auth error", success: false, error });
  }
};

const getTodayAppointmentsController = async (req, res) => {
  try {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); 
    const year = today.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    const appointmentIds = req.body.appointmentIds;
    
    const appointments = await appointmentModel.find({
      $and: [{ _id: { $in: appointmentIds } }, { date: formattedDate }],
    });
    
    if (!appointments) {
      return res.status(200).send({
        message: "No appoinment found!",
        status: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: appointments
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "auth error", success: false, error });
  }
};

const getPatientsByIdController = async (req, res) => {
  try {
    const patientId = req.body.patientId;
    
    const patient = await userModel.findById({ _id: patientId });
    
    if (!patient) {
      return res.status(200).send({
        message: "No patient found!",
        status: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: patient
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "auth error", success: false, error });
  }
};

module.exports = {
  doctorLoginController,
  doctorAuthController,
  getTodayAppointmentsController,
  getPatientsByIdController
};
