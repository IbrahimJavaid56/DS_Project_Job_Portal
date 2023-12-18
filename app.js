import express from 'express';
import {syncModels} from './models/user.js';
import userRouter from './routes/userRoute.js';
import applicantRouter from './routes/applicant_Route.js';
import { seedingDatabase } from './seeder/seed_File.js';
import cors from 'cors';
import apiDetails from './controllers/api_Logs_Controller.js';

await syncModels();
//seeding database for the first the first time.
//seedingDatabase()
const app = express();
app.use(express.json());
app.use(cors());
app.use(apiDetails);
app.use('/api',userRouter);
app.use('/api',applicantRouter);


app.listen(process.env.SERVER_PORT,process.env.SERVER_HOST, () => {
    console.log(`Server is running at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
});