const mongoose = require('mongoose');

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
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
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
