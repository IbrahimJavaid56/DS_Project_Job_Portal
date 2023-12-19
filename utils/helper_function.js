function handleSuccess(res, statusCode,data = [], message) {
    res.status(statusCode).json({
      status: 'Success',
      statusCode,
      data: Array.isArray(data) ? data : [data],
      message,
    });
  }

function handleFailure(res, statusCode, error, message) {
    res.status(statusCode).json({
        status: 'Failure',
        statusCode,
        error: error,
        message: message || 'failed.',
    });
}

export { handleSuccess,handleFailure};

// When returning some data along with a message:

// handleSuccess(
//   res,
//   200,
//   "User information retrieved successfully.",
//   { username: "JohnDoe", email: "johndoe@example.com" }
// );

// {
//     "status": "Success",
//     "statusCode": 200,
//     "data": [{ "username": "JohnDoe", "email": "johndoe@example.com" }],
//     "message": "User information retrieved successfully."
// }