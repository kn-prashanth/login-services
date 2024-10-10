const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    console.log("Send email initiated::options:", options);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
    
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or any other email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
