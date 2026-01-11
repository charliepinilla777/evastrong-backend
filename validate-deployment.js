#!/usr/bin/env node

/**
 * Script de Validación de Deployment
 * Verifica que todas las variables de entorno requeridas estén configuradas
 * Uso: node validate-deployment.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════╗');
console.log('║  🔍 Validación de Deployment              ║');
console.log('╚════════════════════════════════════════════╝\n');

// Variables requeridas para producción
const REQUIRED_VARS = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NODE_ENV',
];

// Variables opcionales pero recomendadas
const OPTIONAL_VARS = [
  'FRONTEND_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
];

let hasErrors = false;
let hasWarnings = false;

// Cargar .env
require('dotenv').config();

// Validar variables requeridas
console.log('📋 Validando variables requeridas...\n');

REQUIRED_VARS.forEach(varName => {
  const value = process.env[varName];
  
  if (!value) {
    console.log(`  ❌ ${varName}: NO CONFIGURADA`);
    hasErrors = true;
  } else if (value.includes('username') || value.includes('tu_') || value.includes('xxxxx') || value.includes('CAMBIAR')) {
    console.log(`  ⚠️  ${varName}: Contiene valores por defecto`);
    console.log(`      Valor actual: ${value.substring(0, 50)}...`);
    hasErrors = true;
  } else {
    console.log(`  ✅ ${varName}: Configurada`);
  }
});

// Validar variables opcionales
console.log('\n📋 Validando variables opcionales...\n');

OPTIONAL_VARS.forEach(varName => {
  const value = process.env[varName];
  
  if (!value) {
    console.log(`  ⚠️  ${varName}: No configurada`);
    hasWarnings = true;
  } else if (value.includes('tu_') || value.includes('CAMBIAR')) {
    console.log(`  ⚠️  ${varName}: Contiene valores por defecto`);
    hasWarnings = true;
  } else {
    console.log(`  ✅ ${varName}: Configurada`);
  }
});

// Validar archivos críticos
console.log('\n📁 Validando estructura de archivos...\n');

const criticalFiles = [
  'server.js',
  'package.json',
  'config/database.js',
  'config/passport.js',
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file}: NO ENCONTRADO`);
    hasErrors = true;
  }
});

// Validar que node_modules existe
console.log('\n📦 Validando dependencias...\n');

const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('  ✅ node_modules instalado');
} else {
  console.log('  ⚠️  node_modules no encontrado');
  console.log('     Ejecuta: npm install');
  hasWarnings = true;
}

// Resumen
console.log('\n╔════════════════════════════════════════════╗');

if (hasErrors) {
  console.log('║  ❌ Errores encontrados                    ║');
  console.log('╚════════════════════════════════════════════╝\n');
  console.log('⚡ Acciones requeridas:');
  console.log('   1. Configura todas las variables requeridas');
  console.log('   2. Reemplaza valores por defecto con valores reales');
  console.log('   3. Ejecuta nuevamente este script\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('║  ⚠️  Advertencias encontradas             ║');
  console.log('╚════════════════════════════════════════════╝\n');
  console.log('💡 Recomendaciones:');
  console.log('   1. Instala dependencias: npm install');
  console.log('   2. Configura variables opcionales si necesitas esas features');
  console.log('   3. El deploy debería funcionar, pero con features limitadas\n');
  process.exit(0);
} else {
  console.log('║  ✅ Todo validado correctamente           ║');
  console.log('╚════════════════════════════════════════════╝\n');
  console.log('🚀 Listo para deploy!\n');
  process.exit(0);
}
