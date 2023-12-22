import { Op } from "sequelize";
import { handleFailure,handleSuccess } from "../utils/helper_function.js";
import { ActivityLog } from "../models/activity_Logs.js";
const getAllLogs = async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const search = req.query.search || '';
      const offset = (page - 1) * limit;
      // Build the where clause for filtering logs
      const whereClause = {
        [Op.or]: [
          { username: { [Op.like]: `%${search}%` } },
          { userEmail: { [Op.like]: `%${search}%` } },
          { action: { [Op.like]: `%${search}%` } },
          { details: { [Op.like]: `%${search}%` } },
        ],
      };
      // Find logs based on the provided criteria
      const logs = await ActivityLog.findAndCountAll({
        where: whereClause,
        offset,
        limit,
      });
      // If no logs found, return a failed status
      if (!logs) {
        return handleFailure(res, 404, {
          status: 'failed',
          message: 'No logs found based on the provided criteria.',
        });
      }
      // Calculate pagination details
      const totalPages = Math.ceil(logs.count / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextLink = hasNextPage ? `/api/log/get-logs?page=${page + 1}&limit=${limit}&search=${search}` : null;
      const prevLink = hasPrevPage ? `/api/log/get-logs?page=${page - 1}&limit=${limit}&search=${search}` : null;
      // Return the response with the retrieved data and pagination details
      handleSuccess(res, 200, {
        pagination: {
          totalLogs: logs.count,
          page,
          totalPages,
          hasNextPage,
          hasPrevPage,
          nextLink,
          prevLink,
        },
        data: logs.rows,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      handleFailure(res, 500, {
        message: 'An error occurred while fetching logs.',
        error: error.message,
      });
    }
  };

  export {getAllLogs};