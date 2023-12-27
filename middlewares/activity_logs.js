import { ActivityLog } from "../models/activity_Logs.js";
import { User } from "../models/user.js";

const logUserActivity = async (req, res, next) => {
    const path = req.path;
    console.log(path)
    try {
        let logData = {};
        if (req.path === '/create-user' && req.method === 'POST') {
            // For user creation
            const { firstName, email } = req.body;
            const userName = `${firstName}`;
            logData = {
                action: 'User Creation',
                username: userName,
                userEmail: email,
                details: `New User ${userName} (${email})created`,
            };
            console.log('User Creation log detected');
        } else if (req.path === '/login' && req.method === 'POST') {
            // For user login
             const { email } = req.body;
            // Fetch user details from the database based on the provided email
            const user = await User.findOne({ where: { email } });
            if (user) {
                const { firstName } = user;
                const userName = `${firstName}`;
                logData = {
                    action: 'User Login',
                    username: userName,
                    userEmail: email,
                    details: `User "${email}" logged in`,
                };
                console.log('User Login log detected');
            } else {
                console.log(`User with this email: ${email} not found`);
            }
        } else if (req.path === '/forget-password' && req.method === 'POST') {
            // For forget password
            console.log('inside forget password');
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });
            if (user) {
                const { firstName } = user;
                const userName = `${firstName}`;
                logData = {
                    action: 'Forget Password',
                    username: userName,
                    userEmail: email,
                    details: `Password reset request initiated for ${email}`,
                };
                console.log('Forget Password log action detected');
            } else {
                console.log(`User with email ${email} not found`);
            }
        }  else {
            // If the route doesn't match any specific path or method, proceed to next middleware
            return next();
        }
        res.on('finish', async () => {
            try {
                logData.statusCode = res.statusCode;
                if (res.statusCode >= 400 && res.statusCode <= 499) {
                    logData.action = 'Client Error';
                    logData.details = `Client error encountered: ${res.statusMessage}`;
                } else if (res.statusCode >= 500 && res.statusCode <= 599) {
                    logData.action = 'Server Error';
                    logData.details = `Server error encountered: ${res.statusMessage}`;
                }
                await ActivityLog.create(logData);
                console.log('User activity logged successfully:'); // Check the logged createdLog object
            } catch (error) {
                console.error('Error creating log:', error);
            }
        });
        next();
    } catch (error) {
        console.error('Error logging user activity:', error);
        next(error);
    }
};

export {logUserActivity};