const { loadRoutineTemplates } = require('./routineTemplates');
const { loadExercises } = require('./exercises');
const { loadAllAdditionalTemplates } = require('./loadAllAdditional');

// Función principal para cargar todos los seeds
async function loadAllSeeds() {
  console.log('🚀 Iniciando carga completa de datos semilla...');
  
  try {
    // Cargar ejercicios primero (dependencia de plantillas)
    console.log('\n📝 Cargando ejercicios...');
    await loadExercises();
    
    // Cargar plantillas de rutinas originales
    console.log('\n📋 Cargando plantillas de rutinas originales...');
    await loadRoutineTemplates();
    
    // Cargar todas las plantillas adicionales
    console.log('\n📦 Cargando plantillas adicionales...');
    await loadAllAdditionalTemplates();
    
    console.log('\n✅ Todos los datos semilla se cargaron exitosamente');
    console.log('\n🎉 Sistema listo para usar rutinas personalizadas');
    console.log('📊 Total de plantillas disponibles: 20');
    console.log('🏋️ Total de ejercicios disponibles: 30+');
    
  } catch (error) {
    console.error('❌ Error durante la carga de datos semilla:', error);
    process.exit(1);
  }
}

// Exportar funciones individuales y la función principal
module.exports = {
  loadAllSeeds,
  loadRoutineTemplates,
  loadExercises,
  loadAllAdditionalTemplates
};

// Ejecutar si se corre directamente
if (require.main === module) {
  // Cargar variables de entorno
  require('dotenv').config();
  
  loadAllSeeds()
    .then(() => {
      console.log('\n🏁 Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}
