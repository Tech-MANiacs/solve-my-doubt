const express = require("express");
const { changeAccountStatusController } = require("../controllers/adminCtrl");
const {
  getAllUsersController,
  getAllMentorsController,
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//GET METHOD || DOCTORS
router.get("/getAllMentors", authMiddleware, getAllMentorsController);


//POST ACCOUNT STATUS
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController);

module.exports = router;