const express = require("express");
const { sendEmailMsgCtrl } = require("../../controllers/email/emailCtrl");
const authMiddleware = require("../../middleware/authMiddleware");
const emailMsgRoute = express.Router();

emailMsgRoute.post("/", authMiddleware, sendEmailMsgCtrl);

module.exports = emailMsgRoute;
