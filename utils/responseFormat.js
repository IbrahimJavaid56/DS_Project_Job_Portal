const sendApiResponse = (res, data, message = "Success", statusCode = 200) => {
    const responseData = {
        success: true,
        statusCode,
        data,
        message,
    };
    if (data.redirectUrl) {
        console.log(data.redirectUrl);
        // Redirect to the specified URL
        res.redirect(data.redirectUrl);
    } else {
        // Send JSON response
        res.status(statusCode).json(responseData);
    }
};
 const sendApiError = (
    res,
    error,
    statusCode = 500,
    defaultMessage = "Internal Server Error"
  ) => {
    let errorMessage = defaultMessage;
    if (typeof error === "string") {
      errorMessage = error || defaultMessage;
    } else if (error instanceof Error) {
      console.error(error.stack);
      errorMessage = error.message || defaultMessage;
    }
    res.status(statusCode).json({
      success: false,
      statusCode,
      message: errorMessage,
    });
  };

export {sendApiError,sendApiResponse};