const mentorModel = require("../models/mentorModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");

const getMentorInfoController = async (req, res) => {
  try {

    //fetching mentor based on Id
    const mentor = await mentorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "mentor data fetch success",
      data: mentor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Mentor Details",
    });
  }
};

// update mentor profile
const updateProfileController = async (req, res) => {
  try {
    const mentor = await mentorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Mentor Profile Updated",
      data: mentor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Mentor Profile Update issue",
      error,
    });
  }
};

//get single mentor
//controller to direct user to the booking page of a particular mentor
const getMentorByIdController = async (req, res) => {
  try {
    const mentor = await mentorModel.findOne({ _id: req.body.mentorId });
    res.status(200).send({
      success: true,
      message: "Sigle Mentor Info Fetched",
      data: mentor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Erro in Single Mentor info",
    });
  }
};

const mentorAppointmentsController = async (req, res) => {
  try {
    const mentor = await mentorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      mentorId: mentor._id,
    });
    res.status(200).send({
      success: true,
      message: "Mentor Appointments fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Mentor Appointments",
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    const notification = user.notification;
    notification.push({
      type: "status-updated",
      message: `your appointment has been updated ${status}`,
      onCLickPath: "/mentor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};

module.exports = {
  getMentorInfoController,
  updateProfileController,
  getMentorByIdController,
  mentorAppointmentsController,
  updateStatusController,
};