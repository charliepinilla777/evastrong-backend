const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Error interno del servidor';

  // Log del error
  logger.error(`[${req.method}] ${req.originalUrl}`, {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
  });

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    err.statusCode = 400;
    err.message = `Error de validación: ${message}`;
  }

  // Error de ID inválido de Mongoose
  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = `ID inválido: ${err.value}`;
  }

  // Error de duplicado en base de datos
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.statusCode = 409;
    err.message = `El ${field} ya existe`;
  }

  // JWT inválido
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Token inválido';
  }

  // JWT expirado
  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Token expirado';
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
  AppError,
};
