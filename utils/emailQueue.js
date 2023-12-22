import Queue from 'bull';
const emailQueue = new Queue('emailVerification');
import { transport } from '../config/nodemailer_Config.js';

// EmailQueue process function.
emailQueue.process('emailVerification', async (job) => {
   
    const email = job.data.email;
    const token = job.data.verificationToken;
  try
  {
    let verificationLink = `http://192.168.11.177:8080/set-password/${token}`;
    const mailOptions = {
      from: 'ibrahimjavaid56@gmail.com',
      to: email,
      subject: 'Set Password',
      html: `
      <div style="background-color: #f4f4f4; padding: 20px;">
          <h2 style="color: #333;">Set your Account Password.</h2>
          <p style="color: #666;">Please tap the button below to set  your account password:</p>
          <a href="${verificationLink}" style="text-decoration: none;">
              <div style="background-color: #3498db; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                  Set Password
              </div>
          </a></div>`,
    };
    // Transport object for sending emails
    await transport.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.log('Failed to send verification email', error);
  }
});
export {emailQueue};