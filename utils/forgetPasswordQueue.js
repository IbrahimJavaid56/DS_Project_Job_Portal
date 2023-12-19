import Queue from 'bull';
const forgetPassQueue = new Queue('sendPasswordResetEmail');
import { transport } from '../config/nodemailer_Config.js';


forgetPassQueue.process('sendPasswordResetEmail', async (job) => {
    try {
        const { user } = job.data;

        const resetPasswordLink = `http://192.168.11.172:3000/user/setPassword/${user.rememberToken}`;

        // Sending the password reset email
        await transport.sendMail({
            from: 'ibrahimjavaid56@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            html: `
          <p>Dear User,</p>
          <p>Click the following link to reset your password:</p>
          <p><a href="${resetPasswordLink}">Reset Password</a></p>
        `,
        });

        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
});

export {forgetPassQueue}