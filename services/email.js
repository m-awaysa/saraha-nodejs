const nodemailer = require("nodemailer");

const sendEmail =async (dest, subject, message) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:process.env.SENDERMAIL, // generated ethereal user
            pass:process.env.SENDERMAILPASSWORD, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from:`"sarah app"<${process.env.SENDERMAIL}>`, // sender address
        to: dest, // list of receivers
        subject: subject, // Subject line
        html: message, // html body
    });
}

module.exports = {sendEmail};