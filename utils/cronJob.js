import cron from 'node-cron';
import { promises as fs } from 'fs';
import path from 'path';
import { Applicant } from '../models/applicants.js';
const cronJobFunction = async () => {
  try {
    const rejectedJobs = await Applicant.findAll({
      where: {
        status: 'rejected',
        isDelete:false
      },
    });
    console.log(rejectedJobs)
    console.log('Rejected Files Deleted.');
  
  } catch (error) {
    console.error('Error executing cron job:', error);
  }
};

cronJobFunction()


// module.exports = {cronJobFunction};