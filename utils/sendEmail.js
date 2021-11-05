const nodemailer = require("nodemailer");

		
		const sendEmail = async (email, subject, text, data) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.nl1-ss24.a2hosting.com',
			port: 465,
			debug: true,
			logger: true,
			secure: true,
			auth: {
				user: process.env.PF_MAIL,
				pass: process.env.PF_PASS
            },
			tls: {
    		rejectUnauthorized: false,
  			},
        });

        await transporter.sendMail({
            from: process.env.PF_MAIL,
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

