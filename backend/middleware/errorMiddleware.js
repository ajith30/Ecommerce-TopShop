//The notFound middleware is responsible for handling requests to routes that are not found or do not exist in your Express application.
//Remember to define the errorHandler middleware (or a default error handling mechanism) after the notFound middleware to handle this error and provide a meaningful response to the client.
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(400);
  next(error); // The next function in the middleware chain
}

const errorHandler = (err, req, res, next) => {
  let statusCode = (res.statusCode === 200) ? 500 : res.statusCode;  
  //Here checking 200 because we may throw intentionaly error at any successful routes request also and set to any cutom error message.
  let message = err.message;  
  // when we throw new error with any error message passed will be available at err.message EX: throw new Error("any error message").

  //If mongoose not found error, set to 404 and change message
  if(err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resourse not found";
  }

  res.status(statusCode).json({ message, stack: (process.env.NODE_ENV === "production") ? null : err.stack});
}

export {notFound, errorHandler};