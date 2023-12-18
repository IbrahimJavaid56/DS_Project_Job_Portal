import nodemailer from "nodemailer";
const transport = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: "ibrahimjavaid56@gmail.com",
    pass: "wkuscemobeigehqj"
  }
});

export {transport};