const mongoose = require('mongoose');

// Timeout global de queries: 30 segundos
mongoose.set('maxTimeMS', 30000);

// Event handlers de conexión
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB desconectado');
});
mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconectado');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
});

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong';

    // Validar que la URI no sea un placeholder
    if (mongoURI.includes('username:password') || mongoURI.includes('xxxxx')) {
      console.error(`\n❌ Error: MONGODB_URI contiene valores por defecto`);
      console.error(`   Configura MONGODB_URI en las variables de entorno\n`);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      return;
    }

    const conn = await mongoose.connect(mongoURI, {
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000, // 10s para selección de servidor
      socketTimeoutMS: 45000,
      maxPoolSize: 50,    // Máx conexiones simultáneas
      minPoolSize: 5,     // Conexiones mínimas siempre activas
      maxIdleTimeMS: 45000,
    });

    console.log(`\n✅ MongoDB Conectado`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Base de datos: ${conn.connection.name}\n`);

    return conn;
  } catch (error) {
    console.error(`\n❌ Error al conectar MongoDB:`);
    console.error(`   ${error.message}\n`);

    // En producción, termina el proceso si no se puede conectar
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
