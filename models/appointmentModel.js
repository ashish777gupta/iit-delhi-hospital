const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
    },
    doctorId: {
      type: String,
    },
    scheduleId: {
      type: String,
    },
    date: {
      type: String,
    },
    slotTime: {
      type: String,
    },
    queueNumber: {
      type: Number,
    },
    checkIn: {
      type: Boolean,
      default : false
    }
  },
  { timestamps: true }
);

appointmentSchema.index({ date: 1, doctorId: 1, patientId: 1, scheduleId: 1 });

const appointmentModel = mongoose.model("appointment", appointmentSchema);
module.exports = appointmentModel;
