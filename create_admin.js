const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function createAdminUser() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');
    console.log('✓ Conectado a MongoDB');

    // Verificar si ya existe un administrador
    const existingAdmin = await User.findOne({ email: 'admin@evastrong.com' });
    if (existingAdmin) {
      console.log('✓ El usuario administrador ya existe');
      
      // Asegurarse de que tenga rol de admin
      if (existingAdmin.role !== 'admin') {
        await User.updateOne(
          { email: 'admin@evastrong.com' },
          { role: 'admin' }
        );
        console.log('✓ Rol de administrador actualizado');
      }
      
      const admin = await User.findOne({ email: 'admin@evastrong.com' });
      const token = admin.generateJWT();
      console.log('\n🔑 Token de administrador para pruebas:');
      console.log(token);
      console.log('\n📋 Puedes usar este token en el header Authorization:');
      console.log('Authorization: Bearer ' + token);
      
      return;
    }

    // Crear usuario administrador
    const adminUser = new User({
      name: 'Administrador Eva Strong',
      email: 'admin@evastrong.com',
      password: 'admin123456', // Será hasheado automáticamente
      role: 'admin',
      emailVerified: true,
      active: true,
      fitnessLevel: 'advanced',
      goals: ['muscle_gain', 'endurance'],
      avatar: '👨‍💼'
    });

    await adminUser.save();
    console.log('✓ Usuario administrador creado exitosamente');
    console.log('📧 Email: admin@evastrong.com');
    console.log('🔒 Contraseña: admin123456');

    // Generar token para pruebas
    const token = adminUser.generateJWT();
    console.log('\n🔑 Token de administrador para pruebas:');
    console.log(token);
    console.log('\n📋 Puedes usar este token en el header Authorization:');
    console.log('Authorization: Bearer ' + token);

  } catch (error) {
    console.error('✗ Error al crear usuario administrador:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Desconectado de MongoDB');
  }
}

createAdminUser();
