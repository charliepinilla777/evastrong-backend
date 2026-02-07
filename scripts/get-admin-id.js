const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✓ Conectado a MongoDB\n');
  
  // Buscar un usuario admin o el primero disponible
  const admin = await User.findOne({ role: 'admin' });
  const anyUser = await User.findOne();
  
  if (admin) {
    console.log('✓ Usuario Admin encontrado:');
    console.log(`   ID: ${admin._id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nombre: ${admin.name}\n`);
    console.log(`Copia este ID para usar en seed-routines.js:`);
    console.log(`const INSTRUCTOR_ID = '${admin._id}';`);
  } else if (anyUser) {
    console.log('⚠️  No hay usuario admin, usando primer usuario:');
    console.log(`   ID: ${anyUser._id}`);
    console.log(`   Email: ${anyUser.email}`);
    console.log(`   Nombre: ${anyUser.name}\n`);
    console.log(`Copia este ID para usar en seed-routines.js:`);
    console.log(`const INSTRUCTOR_ID = '${anyUser._id}';`);
  } else {
    console.log('❌ No hay usuarios en la base de datos.');
    console.log('   Crea un usuario primero antes de ejecutar el seed.');
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
