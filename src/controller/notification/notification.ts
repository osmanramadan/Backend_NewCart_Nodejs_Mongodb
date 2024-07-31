import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv'; 

dotenv.config();

interface Options {
  email?:string;
  subject?:string;
  message?:string;
  orderid?:string;
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
      intro: '',
      table: {
        data: [
          {
            'message': 'Your order has been sended with orderid',
            code: options.orderid
          }
        ]
      },
      outro: options.message
    }
  };
  const mail = MailGenerator.generate(response);

  const message = {
    from: 'mycart@mycart.com',
    to: options.email,
    subject: options.subject,
    html: mail
  };
  await transporter.sendMail(message);
};

export default sendEmail;