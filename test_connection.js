#!/usr/bin/env node

/**
 * Script para validar que todo está configurado correctamente
 * Uso: node test_connection.js
 */

const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testAll() {
  console.log(`\n${colors.blue}╔═══════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   TEST DE CONEXIÓN - EVA STRONG BACKEND   ║${colors.reset}`);
  console.log(`${colors.blue}╚═══════════════════════════════════════════╝${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  // Test 1: Verificar variables de ambiente
  console.log(`${colors.yellow}Test 1: Variables de ambiente${colors.reset}`);
  const requiredEnvVars = ['PORT', 'JWT_SECRET', 'MONGODB_URI', 'NODE_ENV'];
  let missingVars = [];

  for (const varName of requiredEnvVars) {
    if (process.env[varName]) {
      log(colors.green, `  ✓ ${varName} = ${varName === 'JWT_SECRET' ? '***' : process.env[varName]}`);
      passed++;
    } else {
      log(colors.red, `  ✗ ${varName} no está configurada`);
      missingVars.push(varName);
      failed++;
    }
  }

  if (missingVars.length > 0) {
    log(colors.red, `\n  ⚠️  Falta configurar: ${missingVars.join(', ')}`);
    log(colors.yellow, '  Copia .env.example a .env y configura los valores\n');
  }

  // Test 2: MongoDB
  console.log(`\n${colors.yellow}Test 2: Conexión a MongoDB${colors.reset}`);
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong';
    
    // Usar opciones de conexión sin deprecaciones
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    log(colors.green, `  ✓ MongoDB conectado exitosamente`);
    log(colors.green, `  ✓ URI: ${mongoUri}`);
    passed++;
    
    await mongoose.connection.close();
  } catch (err) {
    log(colors.red, `  ✗ Error conectando a MongoDB`);
    log(colors.red, `  ✗ ${err.message}`);
    failed++;
    log(colors.yellow, `\n  💡 Soluciones:`);
    log(colors.yellow, `     - Verifica que MongoDB está corriendo (mongod)`);
    log(colors.yellow, `     - Verifica que MONGODB_URI es correcta en .env\n`);
  }

  // Test 3: Puerto disponible
  console.log(`${colors.yellow}Test 3: Puerto disponible${colors.reset}`);
  const PORT = process.env.PORT || 5000;
  
  const server = http.createServer();
  server.listen(PORT, () => {
    log(colors.green, `  ✓ Puerto ${PORT} disponible`);
    passed++;
    server.close();
    
    // Test 4: Health check simulado
    console.log(`\n${colors.yellow}Test 4: Estructura del proyecto${colors.reset}`);
    const requiredFiles = [
      { path: './server.js', name: 'server.js' },
      { path: './routes/auth.js', name: 'routes/auth.js' },
      { path: './models/User.js', name: 'models/User.js' },
      { path: './middleware/auth.js', name: 'middleware/auth.js' },
    ];

    const fs = require('fs');
    for (const file of requiredFiles) {
      if (fs.existsSync(file.path)) {
        log(colors.green, `  ✓ ${file.name}`);
        passed++;
      } else {
        log(colors.red, `  ✗ ${file.name} no encontrado`);
        failed++;
      }
    }

    // Resumen
    console.log(`\n${colors.blue}╔═══════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║              RESULTADOS                   ║${colors.reset}`);
    console.log(`${colors.blue}╠═══════════════════════════════════════════╣${colors.reset}`);
    log(colors.green, `║  ✓ Pasaron: ${passed}`.padEnd(43) + '║');
    
    if (failed > 0) {
      log(colors.red, `║  ✗ Fallaron: ${failed}`.padEnd(43) + '║');
    } else {
      log(colors.green, `║  ✗ Fallaron: ${failed}`.padEnd(43) + '║');
    }
    
    console.log(`${colors.blue}╚═══════════════════════════════════════════╝${colors.reset}\n`);

    if (failed === 0) {
      log(colors.green, '✓ ¡TODO ESTÁ CONFIGURADO CORRECTAMENTE!');
      log(colors.green, '\nPuedes iniciar el servidor con: npm run dev\n');
      process.exit(0);
    } else {
      log(colors.red, '✗ Hay problemas que necesitan ser solucionados\n');
      process.exit(1);
    }
  });

  server.on('error', (err) => {
    log(colors.red, `  ✗ Puerto ${PORT} no disponible`);
    log(colors.red, `  ✗ ${err.message}`);
    failed++;
  });
}

testAll().catch(err => {
  log(colors.red, `\nError inesperado: ${err.message}`);
  process.exit(1);
});
