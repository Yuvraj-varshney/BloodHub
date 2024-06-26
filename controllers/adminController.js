const userModel = require("../models/userModel");
const sgMail = require('@sendgrid/mail');
const paypal = require('paypal-rest-sdk');

//GET DONAR LIST
const getDonarsListController = async (req, res) => {
  try {
    const donarData = await userModel
      .find({ role: "donar" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: donarData.length,
      message: "Donar List Fetched Successfully",
      donarData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In DOnar List API",
      error,
    });
  }
};
//GET HOSPITAL LIST
const getHospitalListController = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "donar" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: hospitalData.length,
      message: "HOSPITAL List Fetched Successfully",
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital List API",
      error,
    });
  }
};


// Set up SendGrid API key
sgMail.setApiKey(process.env.API_KEY);


//get all users
const getAllUsers = async (req,res) => {
  try{
    const { message } = req.body;  
        // Fetch all users from the database
        const users = await userModel
        .find({role:["donar","hospital"]});
      

        // Iterate through users and send emails
        users.forEach(async (user) => {
          console.log("hello");
          const msg = {
            to: user.email,
            from: 'yuvrajvarshney2021@gmail.com', // your verified sender email address on SendGrid
            subject: 'Notification from Your App',
            text: message // Use the message received from the frontend
          };
          await sgMail.send(msg);
        });
    
        res.status(200).json({ message: 'Emails sent successfully' });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In users List API",
      error,
    });
  }
   
};





//for raising fund

paypal.configure({
  mode: 'sandbox', // Change it to 'live' for production
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET
});

const fundDonate = async (req, res) => {

  const { amount, currency, description } = req.body;

  const paymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    transactions: [{
      amount: {
        total: amount,
        currency: currency
      },
      description: description
    }],
    redirect_urls: {
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    }
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.error(error);
      res.redirect('/cancel');
    } else {
      for (let link of payment.links) {
        if (link.rel === 'approval_url') {
          res.json({ redirect_url: link.href });
        }
      }
    }
  });




};


const successCont = async (req,res) => {
  try{

  } catch {

  }
};

const cancelCont = async (req,res) => {
  try {

  } catch {

  }
};





















//GET ORG LIST
const getOrgListController = async (req, res) => {
  try {
    const orgData = await userModel
      .find({ role: "organisation" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: orgData.length,
      message: "ORG List Fetched Successfully",
      orgData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG List API",
      error,
    });
  }
};
// =======================================

//DELETE DONAR
const deleteDonarController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: " Record Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting ",
      error,
    });
  }
};

//EXPORT
module.exports = {
  getDonarsListController,
  getHospitalListController,
  getOrgListController,
  deleteDonarController,
  getAllUsers,
  fundDonate,
  successCont,
  cancelCont,
};
