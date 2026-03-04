const monsoose = require("mongoose");

const Schema = monsoose.Schema;

const medicationSchema = new Schema({
  title: {
    required: true,

    type: String,
  },

  dosage: {
    required: true,

    type: String,
  },

  frequency: {
    required: true,

    type: Number,
  },

  quantity: {
    required: true,

    type: Number,
  },

  refills: {
    required: true,

    type: Number,
  },
});

const patientSchema = new Schema({
  name: {
    required: true,

    type: String,
  },

  dob: {
    required: true,

    type: String,
  },

  memberId: {
    required: true,

    type: String,
  },

  doi: {
    required: true,

    type: String,
  },

  insurance: {
    required: true,

    type: String,
  },

  insFax: String,

  meds: {
    type: [medicationSchema],

    required: false,
  },

  icdCodes: {
    type: [String],

    required: true,
  },

  employer: String,
});

const Patient = monsoose.model("Patient", patientSchema);

module.exports = Patient;
