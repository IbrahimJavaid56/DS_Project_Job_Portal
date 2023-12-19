import express from 'express';
import { submitForm, handleFileUpload, getAllapplicants, updateApplicantStatus, downloadCv } from '../controllers/applicant_Controller.js';
import { authenticateMiddleware } from '../middlewares/auth_Middlewear.js';
const applicantRouter = express.Router()

applicantRouter.post('/submit-form',handleFileUpload,submitForm);
applicantRouter.get('/get-applicants/',authenticateMiddleware,getAllapplicants);
applicantRouter.patch('/update-applicants/:id',authenticateMiddleware,updateApplicantStatus);
applicantRouter.get('/download-cv/:id',authenticateMiddleware,downloadCv);

export default applicantRouter;