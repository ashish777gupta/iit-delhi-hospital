const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const scheduleModel = require("../models/scheduleModel");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: `User already Exist`, success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: `Register Succesfully`, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error in Register Controller ${error}`,
      });
  }
};
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ phoneNumber: req.body.phoneNumber });

    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid Phone Number or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
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
        data: user
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "auth error", success: false, error });
  }
};

const getProfileController = async (req, res) => {
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
        data: user
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Fetching user profile error", success: false, error });
  }
}

const getDoctorController = async (req, res) => {
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
        data: doctor
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error in Fetching Doctor Schedule Controller ${error}`,
      });
  }
}

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

const getWaitingNumberController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.body.doctorId);
    doctor.password = undefined;

    if (!doctor) {
      res.status(200).send({
        message: "Doctor not found!",
        status: false,
      });
    } else {
      if (!doctor.appointmentId || doctor.appointmentId.length === 0) {
        res.status(200).send({
          success: true,
          data: {
            waitingNumber: 0
          }
        });
      } else {
        res.status(200).send({
          success: true,
          data: {
            waitingNumber: doctor.appointmentId.length
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Fetching Doctor Schedule Controller ${error}`,
    });
  }
};


const scheduleAppointmentController = async (req, res) => {
  try {
    const schedule = {
      date: req.body.date,
      time: req.body.time,
      recurrence: req.body.recurrence,
      selectedDays: req.body.selectedDays,
      weekends: req.body.weekends,
      validTillDate: req.body.validTillDate
    }
    
    const doctor = await doctorModel.findByIdAndUpdate(req.body.id, { schedule });
    await doctor.save();
    res.status(201).send({
      success: true,
      message: "Schedule Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error in Fetching Doctor Schedule Controller ${error}`,
      });
  }
}

const bookAppointmentController = async (req, res) => {
  try {
    const bookedAppointmentsSlot = await appointmentModel.find(
      { date: req.body.date, 
        doctorId: req.body.doctorId, 
        slotTime: req.body.slotTime,
        scheduleId: req.body.scheduleId
      });
    
    const appointment = {
      patientId: req.body.patientId,
      doctorId: req.body.doctorId,
      scheduleId: req.body.scheduleId,
      date: req.body.date,
      slotTime: req.body.slotTime,
      queueNumber: bookedAppointmentsSlot.length + 1
    }
    const newAppointment = new appointmentModel(appointment);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(
      req.body.doctorId,
      { $push: { appointmentId: newAppointment._id } },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      req.body.patientId,
      { $push: { appointmentId: newAppointment._id } },
      { new: true }
    );

    res.status(201).send({
      success: true,
      message: "Appointment Booked",
      data: newAppointment,
    }
    );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error in Booking Appointment Controller ${error}`,
      });
  }
}


const bookedAppointmentsByDateController = async (req, res) => {
  try {
    
    const appointments = await appointmentModel.find({ date: req.body.date, doctorId: req.body.doctorId });
    

    res.status(201).send({
      success: true,
      message: "Appointment Fetched",
      data: appointments,
    }
    );

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error in Booking Appointment Controller ${error}`,
      });
  }
}

const getScheduleController = async (req, res) => {
  try {
    const schedule = await scheduleModel.find({});
    res.status(200).send({
      success: true,
      message: "Schedule fetched",
      data: schedule,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error in getting schedule controller ${error}`,
      });
  }
}

const getScheduleByIdController = async (req, res) => {
  try {
    const schedule = await scheduleModel.find({_id: req.body.scheduleId});
    
    res.status(200).send({
      success: true,
      message: "Schedule fetched",
      data: schedule,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error in getting schedule by Id controller ${error}`,
      });
  }
}

const getBookedAppointmentsByScheduleController = async (req, res) => {
  try {
    const appointment = await appointmentModel.find({scheduleId: req.body.scheduleId, date: req.body.date});
    
    res.status(200).send({
      success: true,
      message: "Appointment fetched",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error in getting schedule by Id controller ${error}`,
      });
  }
}

const getUserAppointmentsController = async (req, res) => {
  try {
    const appointmentIds = req.body.appointmentIds;
    const appointments = await appointmentModel.find({
      _id: { $in: appointmentIds },
    });

    if (!appointments) {
      return res.status(200).send({
        message: "No appoinment found!",
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
    res.status(500).send({ message: "auth error", success: false, error });
  }
};

const getDoctorsByIdController = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const doctor = await doctorModel.findById({ _id: doctorId });
    if (!doctor) {
      return res.status(200).send({
        message: "No Doctor found!",
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

module.exports = { loginController, 
                      registerController, 
                      authController, 
                      getProfileController, 
                      getDoctorController, 
                      getAllDoctorsController,
                      scheduleAppointmentController, 
                      bookAppointmentController,
                      getWaitingNumberController,
                      bookedAppointmentsByDateController,
                      getScheduleController,
                      getScheduleByIdController,
                      getBookedAppointmentsByScheduleController,
                      getUserAppointmentsController,
                      getDoctorsByIdController,
                    };
