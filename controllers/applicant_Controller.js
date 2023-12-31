import { handleSuccess,handleFailure } from '../utils/helper_function.js';
import { Applicant,validateApplicant } from '../models/applicants.js';
import { rejectEmailQueue } from '../utils/rejectEmailQueue.js';
import { DownloadQueue } from '../utils/downloadFileQueue.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder where the uploaded files will be stored
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Customize the filename to include the email address with PDF extension
    const email = req.body.email || "default";
    const fileName = `${email}.pdf`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage }).single('file');
const handleFileUpload = (req, res, next) => {
  upload(req, res, function (err) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'File upload error' });
  } else if (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  next();
});
};
// const handleFailure = (res, statusCode, message) => {
//   return res.status(statusCode).json({ success: false, message });
// };
const submitForm = async (req, res) => {
  const { error } = validateApplicant(req.body);

  if (error) {
    console.log('Validation error:', error.message);
    return handleFailure(res, 400, `Validation error: ${error.message}`);
  }

  const { userName, email, qualification, cnic, address, phoneNumber, status, age, isDelete } = req.body;
  let cvPath = '';

  if (req.file) {
    cvPath = req.file.path;
  }
// // Remove CV files and destroy job applications
//   for (const job of rejectedJobs) {
//   const pdfPath = `/home/raja/Express/Project#1/cvs/${job.email}.pdf`;
//   // Check if the CV file exists before attempting to delete
//   if (fs.existsSync(pdfPath)) {
//     fs.unlinkSync(pdfPath);
//   }
//}
  try {
    const newApplicant = await Applicant.create({
      applicantId: uuidv4(),
      userName,
      email,
      qualification,
      cnic,
      address,
      phoneNumber,
      cv: cvPath,
      status,
      age,
      isDelete,
    });

    return res.status(201).json({ message: 'Applicant created successfully', data: newApplicant });
  } catch (error) {
    console.error('Error creating new applicant:', error);

    return handleFailure(res, 500, 'Failed to create new applicant');
  }
};

//GET ALL APPLICANTS
const getAllapplicants = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const search = req.query.search || '';
      const status = req.query.status || '';
      const skip = (page - 1) * limit;
      const whereClause = {
          [Op.or]: [
              { username: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
          ],
          status: { [Op.like]: `%${status}%` },
      };
      const applicants = await Applicant.findAndCountAll({
          where: whereClause,
          skip,
          limit,
      });

      if (!applicants) {
          return res.status(400).json({
              status: "failed",
          });
      }
      const totalPages = Math.ceil(applicants.count / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextLink = hasNextPage ? `/api/get-applicants?page=${page + 1}&limit=${limit}&search=${search}&status=${status}` : null;
      const prevLink = hasPrevPage ? `/api/get-applicants?page=${page - 1}&limit=${limit}&search=${search}&status=${status}` : null;

      res.status(200).json({
          status: "success",
          data: applicants.rows,
          pagination: {
              totalApplicants: applicants.count,
              page,
              totalPages,
              hasNextPage,
              hasPrevPage,
              nextLink,
              prevLink,
          },
      });
  } catch (error) {
      res.status(400).json({
          message: error.message,
      });
  }
};

const cronSchedule = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const rejectedApplicants = await Applicant.findAll({
        where: {
          status: 'rejected'
        }
      });
      if (rejectedApplicants && rejectedApplicants.length > 0) {
        // Soft delete rejected jobs
        const result = await Applicant.destroy({
          where: {
            status: 'rejected'
          }
        });
        console.log(`Soft deletion completed successfully.`);
      } else {
        console.log("No rejected Applicants found to be deleted.");
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};
const updateApplicantStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(id);
  console.log(status);
  try {
    const applicant = await Applicant.findOne({
      where: {
        applicantId: id,
      },
    });
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    if (status === 'rejected') {
      applicant.status = status;
      await applicant.save();
      await rejectEmailQueue.add('rejectEmailQueue', { user: applicant.email }); // Use the email property
      res.status(200).json({ message: 'rejection email sent successfully' });
    }
    else if(status === 'accepted'){
      applicant.status = status;
      await applicant.save();
      res.status(200).json({ message: 'Applicant has been accepted.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'internal server error' });
  }
};

async function downloadCv(req, res) {
  try {
        const { id } = req.params;
        const applicant = await Applicant.findOne({
          where: {
            applicantId: id,
          },
        });
    
        if (!applicant) {
          return res.status(404).send('Applicant not found');
        }
        const cvFilePath = applicant.cv;
        console.log(cvFilePath);
        await DownloadQueue.add({ cvFilePath });
        res.json({
         message: "File downloaded successfully",
        });
  } catch (error) {
    console.error('Error initiating download process:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export  { submitForm , handleFileUpload , getAllapplicants , updateApplicantStatus , downloadCv,cronSchedule};
