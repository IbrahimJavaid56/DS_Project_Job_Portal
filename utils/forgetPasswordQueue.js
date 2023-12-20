import Queue from 'bull';
const forgetPassQueue = new Queue('sendPasswordResetEmail');
import { transport } from '../config/nodemailer_Config.js';


forgetPassQueue.process('sendPasswordResetEmail', async (job) => {
    const {user}=job.data;
        console.log("job",job);
        console.log("job.data",job.data);
  try
  {
    let Link = `http://192.168.11.177:8080/set-password/${user.rememberToken}`;
    const mailOptions = {
      from: 'ibrahimjavaid56@gmail.com',
      to: user.email,
      subject: 'Set Password',
      html: `
      <div style="background-color: #f4f4f4; padding: 20px;">
          <h2 style="color: #333;">Set your Account Password.</h2>
          <p style="color: #666;">Please tap the button below to set  your account password:</p>
          <a href="${Link}" style="text-decoration: none;">
              <div style="background-color: #3498db; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                  Set Password
              </div>
          </a></div>`,
    };
    // Transport object for sending emails
    await transport.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}`);
    // Remove the job details from the Jobs table
  } catch (error) {
    console.log('Failed to send email', error);
  }
});

export {forgetPassQueue}