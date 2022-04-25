const pug = require('pug');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
// new Email(user, url).sendWelcome();

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `${process.env.NAME_FROM} <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            //TODO Sendgrid
            return 1;
        }
        return nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });
    }

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject,
            }
        );
        // 2) Define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html),
        };
        // 3) Create a transport and send email
        // await transport.sendMail(mailOptions);
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendResetPassword() {
        await this.send(
            'resetPassword',
            'Your Password reset token (valid for 10 minutes !!!)'
        );
    }
};

/*const sendEmail = async (options) => {
    // 1) Create a transporter
    // Gmail
    // const transporter = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD,
    //     },
    //     // Activate in gmail "less secure app" option

    // });
    const transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Elhosen Salama <elhosensalamarashed@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    };

    // 3) Acually send the email
    await transport.sendMail(mailOptions);
};*/
