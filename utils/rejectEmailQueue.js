import Queue from 'bull';
const  rejectEmailQueue= new Queue('rejectEmailQueue');
import { transport } from '../config/nodemailer_Config.js';

rejectEmailQueue.process('rejectEmailQueue', async (job) => {
    try {
        const email = job.data.user;
        console.log(email);

        const mailOptions = {
            from: 'ibrahimjavaid56@gmail.com',
            to: email, // Use the extracted email address
            subject: 'Application Status',
            html: `
            <p>We regret to inform you that your application has been rejected.</p>
          `
        };
        await transport.sendMail(mailOptions);
        console.log('Rejection email sent');
    } catch (error) {
        console.error('Error sending rejection email:', error);
    }
});


export {rejectEmailQueue};