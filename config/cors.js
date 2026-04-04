/**
 * Configuración CORS mejorada y segura
 */

const cors = require('cors');

// Permitir múltiples orígenes según ambiente
const getAllowedOrigins = () => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    return [
      process.env.FRONTEND_URL || 'https://evastrong.com',
      'https://www.evastrong.com',
    ];
  }
  
  // Desarrollo: permitir localhost y IPs locales
  return [
    'http://localhost:54321',      // Flutter web
    'http://localhost:3000',       // React dev
    'http://127.0.0.1:54321',
    'http://192.168.1.*',          // Red local
    process.env.FRONTEND_URL || 'http://localhost:54321',
  ];
};

const corsOptions = {
  // Orígenes permitidos
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    
    // Permitir requests sin origin (mobile apps, Postman, etc)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar si el origen está permitido
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        // Wildcard pattern: 192.168.1.*
        const pattern = allowed.replace(/\*/g, '[0-9]+');
        return new RegExp(`^${pattern}$`).test(origin);
      }
      return origin === allowed;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // En desarrollo logueamos el origen rechazado, pero NO lo permitimos
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️  Origen CORS rechazado: ${origin}`);
      }
      callback(new Error('No permitido por CORS'));
    }
  },
  
  // Permitir credenciales (cookies, authorization headers)
  credentials: true,
  
  // Métodos HTTP permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  
  // Headers permitidos
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'Accept',
    'Accept-Language',
    'Content-Language',
    'Last-Event-ID',
  ],
  
  // Headers expuestos al cliente
  exposedHeaders: [
    'X-Total-Count',      // Para paginación
    'X-Page-Count',
    'X-RateLimit-Limit',  // Rate limiting
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  
  // Máximo tiempo de cache del preflight (en segundos)
  maxAge: 86400, // 24 horas
};

module.exports = cors(corsOptions);
