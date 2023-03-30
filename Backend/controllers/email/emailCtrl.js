const expressAsyncHandler = require("express-async-handler");
const sgMail = require("@sendgrid/mail");
const EmailMsg = require("../../model/email/email");

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;
  const { _id, email } = req.user;

  try {
    // build up msg
    const msg = {
      to,
      subject,
      text: message,
      from: "tomboban777@gmail.com",
    };
    //send msg
    await sgMail.send(msg);
    //save to our db
    await EmailMsg.create({
      sentBy: _id,
      from: email,
      to,
      message,
      subject,
    });
    res.json("Mail Sent");
  } catch (error) {
    res.json(error);
  }
});

module.exports = { sendEmailMsgCtrl };
