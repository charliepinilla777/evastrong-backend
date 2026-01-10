const requiredEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI',
];

const optionalEnvVars = [
  'PORT',
  'NODE_ENV',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'MERCADO_PAGO_ACCESS_TOKEN',
  'MERCADO_PAGO_PUBLIC_KEY',
  'FRONTEND_URL',
];

// Validar variables requeridas
const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error(
    '❌ Error: Las siguientes variables de entorno son requeridas:'
  );
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  process.exit(1);
}

// Log de variables configuradas
if (process.env.NODE_ENV === 'development') {
  console.log('📋 Variables de entorno configuradas:');
  requiredEnvVars.concat(optionalEnvVars).forEach((varName) => {
    const value = process.env[varName];
    const status = value ? '✅' : '⚠️';
    const displayValue = value ? '***' : 'no configurada';
    console.log(`   ${status} ${varName}: ${displayValue}`);
  });
  console.log('');
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  mercadoPagoAccessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  mercadoPagoPublicKey: process.env.MERCADO_PAGO_PUBLIC_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
