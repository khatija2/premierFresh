const nodemailer = require("nodemailer");
require('dotenv').config({ path: './.env' });
//const {google} = require("googleapis");
//var smtpTransport = require('nodemailer-smtp-transport');


//const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
/*try {
	var config = require('../config');
} catch(e) {
	console.log("not local");
	console.log(e);
};



const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});*/


		
		const sendEmail = async (email, subject, text, data) => {
    try {
		//const accessToken = await oAuth2Client.getAccessToken()
        const transporter = nodemailer.createTransport({
            host: 'smtp.nl1-ss24.a2hosting.com',
			port: 465,
			debug: true,
			logger: true,
			secure: true,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASS
            },
			tls: {
    		rejectUnauthorized: false,
  			},
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: text,
			html: data
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;

