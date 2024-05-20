const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: Array,
      default: []
    },
    recurrence: {
      type: String,
    },
    selectedDays: {
      type: Array,
      default: []
    },
    weekends: {
        type: Array,
        default: []
    },
    validTillDate: {
        type: String,
    }
  },
  { timestamps: true }
);

scheduleSchema.index({ date: 1, doctorId: 1, validTillDate: 1 });

const scheduleModel = mongoose.model("schedule", scheduleSchema);
module.exports = scheduleModel;
