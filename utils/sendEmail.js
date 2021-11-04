const nodemailer = require("nodemailer");
const {google} = require("googleapis");


const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

/*try {
	var config = require('../config');
} catch(e) {
	console.log("not local");
	console.log(e);
};*/



const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});


		
		const sendEmail = async (email, subject, text, data) => {
    try {
		const accessToken = await oAuth2Client.getAccessToken()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: process.env.EMAIL,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: accessToken
            },
        });

        await transporter.sendMail({
            from:  process.env.EMAIL,
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

