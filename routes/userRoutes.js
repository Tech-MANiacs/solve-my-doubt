const express  = require('express');


//to respond to requests on these routes, we created functions, need to import those
const {loginController, 
    registerController, 
    authController, 
    applyMentorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllMentors,
    bookeAppointmnetController,
    bookingAvailabilityController,
    userAppointmentsController} = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//created a router object
//we will define routes for login and post in this file and save it in router const
const router = express.Router();


//login || post
router.post('/login', loginController);
//register || post
router.post('/register', registerController);

//Auth || post
router.post('/getUserData', authMiddleware, authController);

//Apply mentor || post
router.post('/apply-mentor', authMiddleware, applyMentorController);

//Notifiaction  Mentor || POST
router.post(
    "/get-all-notification",
    authMiddleware,
    getAllNotificationController
  );

//Notification  Mentor || POST
router.post(
    "/delete-all-notification",
    authMiddleware,
    deleteAllNotificationController
  );


//GET ALL DOC
router.get('/getAllMentors', authMiddleware, getAllMentors)

//BOOK APPOINTMENT
router.post('/book-appointment', authMiddleware, bookeAppointmnetController);


//Booking Availability
router.post('/booking-availbility', authMiddleware, bookingAvailabilityController);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;