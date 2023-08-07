const express = require("express");
const {
  getMentorInfoController,
  updateProfileController,
  getMentorByIdController,
  mentorAppointmentsController,
  updateStatusController,
} = require("../controllers/mentorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//POST SINGLE MENTOR INFO
router.post("/getMentorInfo", authMiddleware, getMentorInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST GET SINGLE MENTOR INFO
router.post("/getMentorById", authMiddleware, getMentorByIdController);

//GET Appointments
router.get(
  "/mentor-appointments",
  authMiddleware,
  mentorAppointmentsController
);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;