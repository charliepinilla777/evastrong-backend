/**
 * Script para crear un usuario con rol 'trainer'.
 *
 * Uso:
 *   node create_trainer.js
 *
 * Asegúrate de tener el archivo .env configurado con MONGODB_URI y JWT_SECRET.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User     = require('./models/User');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB\n');

  const name     = await ask('Nombre del entrenador: ');
  const email    = await ask('Email: ');
  const password = await ask('Contraseña: ');

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    if (existing.role === 'trainer') {
      console.log('\nEse email ya tiene rol de entrenador.');
    } else {
      existing.role = 'trainer';
      await existing.save();
      console.log(`\nRol actualizado a 'trainer' para ${existing.email}`);
    }
    rl.close();
    await mongoose.disconnect();
    return;
  }

  const trainer = new User({
    name:          name.trim(),
    email:         email.toLowerCase().trim(),
    password,
    role:          'trainer',
    emailVerified: true,
    provider:      'local',
    subscription:  { plan: 'premium', active: true },
  });

  await trainer.save();
  console.log(`\nEntrenador creado exitosamente:`);
  console.log(`  Nombre : ${trainer.name}`);
  console.log(`  Email  : ${trainer.email}`);
  console.log(`  Rol    : ${trainer.role}`);

  rl.close();
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
