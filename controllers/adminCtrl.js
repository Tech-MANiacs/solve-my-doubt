const mentorModel = require("../models/mentorModel");
const userModel = require("../models/userModels");



//getting hold of every user from the database
const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "erorr while fetching users",
      error,
    });
  }
};


//getting hold of every user in the database
const getAllMentorsController = async (req, res) => {
  try {
    const mentors = await mentorModel.find({});
    res.status(200).send({
      success: true,
      message: "Mentors Data list",
      data: mentors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting mentors data",
      error,
    });
  }
};

// mentor account status
const changeAccountStatusController = async (req, res) => {
    try {

        //we are passing mentorId and status from the frontend
      const { mentorId, status } = req.body;

      //finding the mentor based on its id and as we want to change the status, we are passing it as an object here and then we send notification to the mentor
      const mentor = await mentorModel.findByIdAndUpdate(mentorId, { status });
      const user = await userModel.findOne({ _id: mentor.userId });
      const notification = user.notification;
      notification.push({
        type: "mentor-account-request-updated",
        message: `Your Mentor Account Request Has been ${status} `,
        onClickPath: "/notification",
      });
      user.isMentor = status === "approved" ? true : false;
      await user.save();
      res.status(201).send({
        success: true,
        message: "Account Status Updated",
        data: mentor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  };
  
  module.exports = {
    getAllMentorsController,
    getAllUsersController,
    changeAccountStatusController,
  };