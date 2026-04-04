# 🏋️‍♀️ Guía para Poblar Rutinas en Eva Strong Backend

## 📋 Rutinas Creadas

Se crearon **7 rutinas atractivas** diseñadas específicamente para mujeres:

### Rutinas Gratuitas (Free) ✅
1. **🔥 Vientre Plano en 21 Días** - 25 min - Principiante
2. **👙 Cintura de Sirena - Curvas Perfectas** - 20 min - Principiante
3. **💪 Brazos de Modelo - Tonifica sin Volumen** - 20 min - Principiante
4. **🧘‍♀️ Flexibilidad Total - Cuerpo de Bailarina** - 25 min - Principiante

### Rutinas Premium 💎
1. **🍑 Glúteos de Acero - Levanta y Tonifica** - 35 min - Intermedio
2. **✨ Adiós Celulitis - Piel Firme y Suave** - 30 min - Intermedio
3. **🔥 Quema Grasa Total - 500 Calorías en 30 Min** - 30 min - Avanzado

---

## 🚀 Cómo Ejecutar el Seed

### **Paso 1: Obtener ID de Instructor**

Primero necesitas el ID de un usuario que será el instructor:

```bash
cd C:\Users\Carlos\Desktop\EvaStrong-Backend
node scripts/get-admin-id.js
```

Esto te mostrará el ID de un usuario admin (o cualquier usuario si no hay admin).

### **Paso 2: Actualizar el ID en el Script**

1. Abre `scripts/seed-routines.js`
2. En la línea 14, reemplaza el ID:
   ```javascript
   const INSTRUCTOR_ID = 'TU_ID_AQUI'; // Pegar el ID del paso 1
   ```

### **Paso 3: Ejecutar el Seed**

```bash
node scripts/seed-routines.js
```

Verás algo como:
```
✓ Conectado a MongoDB

🌱 Iniciando seed de rutinas...

✓ Creada: "🔥 Vientre Plano en 21 Días"
✓ Creada: "🍑 Glúteos de Acero - Levanta y Tonifica"
✓ Creada: "✨ Adiós Celulitis - Piel Firme y Suave"
✓ Creada: "👙 Cintura de Sirena - Curvas Perfectas"
✓ Creada: "💪 Brazos de Modelo - Tonifica sin Volumen"
✓ Creada: "🔥 Quema Grasa Total - 500 Calorías en 30 Min"
✓ Creada: "🧘‍♀️ Flexibilidad Total - Cuerpo de Bailarina"

🎉 ¡7 rutinas creadas exitosamente!

📊 Resumen:
   - Rutinas gratuitas: 4
   - Rutinas premium: 3
   - Dificultad principiante: 4
   - Dificultad intermedia: 2
   - Dificultad avanzada: 1
```

---

## 🔄 Ejecutar Desde Render (Producción)

### **Opción A: Conectar a MongoDB Atlas local**

Si quieres poblar la base de datos de producción:

1. Copia el `MONGODB_URI` de Render (dashboard → Environment)
2. Actualiza tu `.env` local:
   ```
   MONGODB_URI=mongodb+srv://...tu_uri_de_atlas...
   ```
3. Ejecuta el seed localmente (poblará la BD de producción)

### **Opción B: Ejecutar en Render**

1. Sube los scripts a GitHub:
   ```bash
   git add scripts/
   git commit -m "Add seed scripts for routines"
   git push origin main
   ```

2. En Render Dashboard:
   - Ve a tu servicio backend
   - Shell → Conectar
   - Ejecuta:
     ```bash
     node scripts/get-admin-id.js
     # Copia el ID
     # Edita seed-routines.js con el ID
     node scripts/seed-routines.js
     ```

---

## 📝 Personalizar Rutinas

Puedes editar `scripts/seed-routines.js` para:

- Cambiar nombres de rutinas
- Agregar más ejercicios
- Modificar duración
- Cambiar dificultad
- Agregar más rutinas al array `rutinasAtractivas`

### Estructura de una Rutina:

```javascript
{
  title: 'Nombre Atractivo',
  description: 'Descripción motivadora',
  category: 'hiit', // strength, cardio, flexibility, hiit, pilates, yoga
  difficulty: 'beginner', // beginner, intermediate, advanced, expert
  duration: 30, // minutos
  accessLevel: 'free', // free, basic, premium
  objectives: ['Objetivo 1', 'Objetivo 2'],
  targetMuscles: ['Músculo 1', 'Músculo 2'],
  equipment: ['Equipo necesario'],
  tags: ['tag1', 'tag2'],
  rating: 4.8,
  ratingCount: 1000,
  completedCount: 2000,
  blocks: {
    calentamiento: [...ejercicios...],
    principal: [...ejercicios...],
    enfriamiento: [...ejercicios...]
  }
}
```

---

## ✅ Verificar que las Rutinas se Crearon

### **Desde MongoDB Compass**

1. Conecta a tu base de datos
2. Ve a la colección `routines`
3. Deberías ver 7 documentos nuevos

### **Desde el Backend (API)**

```bash
curl https://evastrong-backend.onrender.com/routines?page=1&limit=10
```

### **Desde el Frontend**

Las rutinas aparecerán automáticamente en la pestaña **"Todas"** de la pantalla de rutinas.

---

## 🗑️ Limpiar Rutinas (Si es necesario)

Si quieres eliminar todas las rutinas y empezar de nuevo:

1. Abre `scripts/seed-routines.js`
2. Descomenta las líneas 228-229:
   ```javascript
   await Routine.deleteMany({});
   console.log('✓ Rutinas antiguas eliminadas\n');
   ```
3. Ejecuta el script nuevamente

---

## 🎯 Próximos Pasos

Después de poblar las rutinas:

1. ✅ Verificar en el frontend (pestaña "Todas")
2. ✅ Probar acceso free vs premium
3. ✅ Verificar que el sistema de prueba funciona
4. ✅ Compilar nueva versión del AAB para Play Store

---

## 📞 Soporte

Si tienes problemas:
- Verifica que `MONGODB_URI` en `.env` sea correcto
- Asegúrate de tener usuarios en la base de datos
- Revisa los logs del script para ver errores específicos

---

¡Disfruta de tus nuevas rutinas! 💪💜
