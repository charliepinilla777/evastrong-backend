const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
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
