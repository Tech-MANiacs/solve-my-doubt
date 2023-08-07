const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const moment = require('moment');

//we dont want user to login everytime he visits the site, instead we will provide them a token with duration of 1day

const jwt = require('jsonwebtoken');
const mentorModel = require('../models/mentorModel')
const appointmentModel = require('../models/appointmentModel');

const registerController = async (req,res) =>{
    try {
        //fist we check if the user is an existing user, if he/she is then redirect them to the login page
        const existingUser = await userModel.findOne({email: req.body.email});
        if(existingUser)
        {
            return res.status(200).send({success: true, message: 'User with this email already exists'});
        }
        //if new user
        //We store password hash in the db.
        const password = req.body.password;


        //To ecrypt password i.e take hash we use bcrypt salt (read its doc)
        //this parameter denotes the number of roundes, more the roundes more time it will take to take hash 
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt); //hash 10 times


        //replace original password with this hashed password in the request body and then store it in the database. 
        req.body.password = hashPassword;


        //now creating new user using user model
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({success: true, message: "Registered successfully"});
        
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false, message: `Register Controller ${error.message}`});
    }
};



const loginController = async (req,res) =>{
    try {

        //cheching if the user already exists or not
        const user = await userModel.findOne({email: req.body.email}); 

        if(!user){
            return res.status(200).send({message: `user not found!`, success: false});
        }
        //if user email exists, now we check password using the .compare method of bcryptjs

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch){
            //to make it secure we directly do not want the user to know if its password that is incorrect or the email
            return res.status(200).send({message: 'Icorrect email or password', success: false});
        }

        //all conditions checked, now we'll send a login success response and a token as well

        //created a secret key in the .env file

        //database has a field of _id, assigning token based on that id and signing it with our secret key

        //token is nothing but some info (json object here) which we are signing using our secret key
        //upon decoding, we will be access the info which we signed
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '1d'});

        //we'll send success reponse as well as token
        res.status(200).send({message: `Login success`, success: true, token:token});
    } catch (error) {
        console.log(error);
        res.status(500).send({message:`Error in login CTRL ${error.message}` });
    }
};


//this function will be called only when the authMiddleware function runs successfuly. In the authMiddleware function, we are just checking the authenticity of the token and if the token is correct, we add the _id of the token on with it was signed to the request body.
//Now in this function we check using that id in the req which we added if any user with that id exists in the database or not

const authController = async(req,res) => {
    try {
        //finding user in the database with the userId which we created in the req.body in the authMiddleware
        const user = await userModel.findById({_id: req.body.userId});
        //we dont want to return password to the browser, so will hide it after fetching it from the database
        user.password = undefined;
        if(!user){
            return res.status(200).send({message:"User not found", success:false});
        }

        
        //sending every data about the user from the database to the frontend
        else{
            res.status(200).send({
                success:true,
                data: user,
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Auth failed", success: false, error});
    }
}


//apply mentor ctrl 
const applyMentorController = async(req,res) =>{
    try {

        const newMentor = await mentorModel({...req.body, status:'pending'});
        await newMentor.save()
        console.log(newMentor);
        //fetching an user account to notify him/her about the mentor req
        const adminUser = await userModel.findOne({isAdmin:true});
        const notification = adminUser.notification

        //pushing in the notification array

        notification.push({
            type:'Apply-mentor-request',
            message: `${newMentor.firstName} ${newMentor.lastName} has applied for a mentor account`,
            data:{
                mentorId: newMentor._id,
                name: newMentor.firstName+" "+newMentor.lastName,
                onClickPath: '/admin/mentors'
            }
        });

        //sending this notification by updating our admin user
        await userModel.findByIdAndUpdate(adminUser._id,{notification});
        res.status(201).send({
            success: true,
            message:'Mentor account applied successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while applying for mentor"
        })
    }
}


//notification ctrl
const getAllNotificationController = async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.body.userId });
      const seennotification = user.seennotification;
      const notification = user.notification;
      seennotification.push(...notification);
      user.notification = [];
      user.seennotification = notification;
      const updatedUser = await user.save();
      res.status(200).send({
        success: true,
        message: "all notification marked as read",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error in notification",
        success: false,
        error,
      });
    }
  };


  // delete notifications
const deleteAllNotificationController = async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.body.userId });
      user.notification = [];
      user.seennotification = [];
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "Notifications Deleted successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "unable to delete all notifications",
        error,
      });
    }
  };
  

//GET ALL 
const getAllMentors = async (req, res) => {
    try {

        //fetching a list of all mentors with status approved
      const mentors = await mentorModel.find({ status: "approved" });
      res.status(200).send({
        success: true,
        message: "Mentors Lists Fetched Successfully",
        data: mentors,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error WHile Fetching Mentor",
      });
    }
  };
  
  //BOOK APPOINTMENT
const bookeAppointmnetController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.mentorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

// booking bookingAvailabilityController
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const mentorId = req.body.mentorId;
    const appointments = await appointmentModel.find({
      mentorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyMentorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllMentors,
  bookeAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
};