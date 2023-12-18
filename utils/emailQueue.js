import Queue from 'bull';
const emailQueue = new Queue('emailVerification');
import { transport } from '../config/nodemailer_Config.js';

// EmailQueue process function.
emailQueue.process('emailVerification', async (job) => {
   
    const email = job.data.email;
    const token = job.data.verificationToken;
  try
  {
    let verificationLink = `http://localhost:8080/admin/set-password/?${email}`;
    const mailOptions = {
      from: 'ibrahimjavaid56@gmail.com',
      to: email,
      subject: 'Set Password',
      //html: `Click <a href="${verificationLink}">here</a> to verify your account.`,
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
    // Remove the job details from the Jobs table
  } catch (error) {
    console.log('Failed to send verification email', error);
    // await saveFailedJob(email);
  }
});
// async function saveFailedJob(email) {
//   try {
//     const failedJob = new FailedJob({
//       email: email,
//     });
//     await failedJob.save();
//     console.log(`Failed job saved for email: ${email}`);
//   } catch (error) {
//     console.error('Failed to save failed job details', error);
//   }
// }
export {emailQueue};