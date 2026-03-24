const { loadAdditionalTemplates } = require('./additionalTemplates');
const { loadAdditionalTemplates2 } = require('./additionalTemplates2');
const { loadAdditionalTemplates3 } = require('./additionalTemplates3');
const { loadAdditionalTemplates4 } = require('./additionalTemplates4');
const { loadAdditionalTemplates5 } = require('./additionalTemplates5');

// Función principal para cargar todas las plantillas adicionales
async function loadAllAdditionalTemplates() {
  console.log('🚀 Iniciando carga de todas las plantillas adicionales...');
  
  try {
    // Cargar todos los lotes en secuencia
    console.log('\n📦 Cargando lote 1 (Grupo 1-2)...');
    await loadAdditionalTemplates();
    
    console.log('\n📦 Cargando lote 2 (Grupo 3-4)...');
    await loadAdditionalTemplates2();
    
    console.log('\n📦 Cargando lote 3 (Grupo 5-6)...');
    await loadAdditionalTemplates3();
    
    console.log('\n📦 Cargando lote 4 (Grupo 7-8)...');
    await loadAdditionalTemplates4();
    
    console.log('\n📦 Cargando lote 5 (Grupo 9-10)...');
    await loadAdditionalTemplates5();
    
    console.log('\n✅ Todas las plantillas adicionales se cargaron exitosamente');
    console.log('\n🎯 Resumen de plantillas cargadas:');
    console.log('📋 Grupo 1: 18-35 años, principiante, rodilla sana (2 plantillas)');
    console.log('📋 Grupo 2: 18-35 años, principiante, rodillas sensibles (1 plantilla)');
    console.log('📋 Grupo 3: 18-35 años, intermedio, rodilla sana (2 plantillas)');
    console.log('📋 Grupo 4: 18-35 años, intermedio, rodillas sensibles (1 plantilla)');
    console.log('📋 Grupo 5: 36-55 años, principiante, rodilla sana (2 plantillas)');
    console.log('📋 Grupo 6: 36-55 años, principiante, rodillas sensibles (1 plantilla)');
    console.log('📋 Grupo 7: 36-55 años, intermedio, rodilla sana (2 plantillas)');
    console.log('📋 Grupo 8: 36-55 años, intermedio, rodillas sensibles (1 plantilla)');
    console.log('📋 Grupo 9: 55+ años, principiante (2 plantillas)');
    console.log('📋 Grupo 10: 55+ años, intermedio (2 plantillas)');
    console.log('\n🏆 Total: 16 plantillas adicionales + 4 originales = 20 plantillas completas');
    
  } catch (error) {
    console.error('❌ Error durante la carga de plantillas adicionales:', error);
    process.exit(1);
  }
}

// Exportar la función principal
module.exports = { loadAllAdditionalTemplates };

// Ejecutar si se corre directamente
if (require.main === module) {
  // Cargar variables de entorno
  require('dotenv').config();
  
  loadAllAdditionalTemplates()
    .then(() => {
      console.log('\n🏁 Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}
