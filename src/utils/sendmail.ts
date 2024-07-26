import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';

dotenv.config();

interface Options {
  email?: string;
  subject?: string;
  message?: string;
  resetCode?: string;
}

const sendEmail = async (options: Options) => {
  const config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_HOST,
      pass: process.env.EMAIL_PASSWORD
    }
  };

  const transporter = nodemailer.createTransport(config);

  const MailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: ' ',
      link: ' '
    }
  });

  const response = {
    body: {
      name: options.email,
      intro: 'Your reset code has arrived!',
      table: {
        data: [
          {
            '*****************************': 'Password Reset Code',
            code: options.resetCode
          }
        ]
      },
      outro: options.message
    }
  };
  const mail = MailGenerator.generate(response);

  const message = {
    from: 'osman@gmail.com',
    to: options.email,
    subject: options.subject,
    html: mail
  };
  await transporter.sendMail(message);
};

export default sendEmail;
