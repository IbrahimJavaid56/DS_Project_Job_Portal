import { ApiLogs } from '../models/api_Logs.js';

const apiDetails = async (req, res, next) => {
  //console.log("testing")
  const logData = {
    requestMethod: req.method,
    requestUrl: req.url,
    accept: req.headers.accept,
    userAgent: req.headers["user-agent"],
    acceptEncoding: req.headers["accept-encoding"],
    connection: req.headers.connection,
    requestBody: JSON.stringify({ body: req.body }),
  };
  res.on('finish', async () => {
    logData.statusCode = res.statusCode;
    try {
      // Validate the log data before creating the log entry
      // validateApiLog(logData);
      await ApiLogs.create(logData);
    } catch (error) {
      console.error('Error saving log entry to Sequelize:', error.message);
    }
  });
  next();
};
export default apiDetails;