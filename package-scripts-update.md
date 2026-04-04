# Actualización de Scripts package.json

## Scripts recomendados para agregar a package.json:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --detectOpenHandles",
    "seed": "node seeds/index.js",
    "seed:exercises": "node seeds/exercises.js",
    "seed:templates": "node seeds/routineTemplates.js",
    "seed:additional": "node seeds/loadAllAdditional.js",
    "seed:all": "node seeds/index.js"
  }
}
```

## Comandos para ejecutar:

### Cargar todos los datos semilla:
```bash
npm run seed
# o
npm run seed:all
```

### Cargar solo ejercicios:
```bash
npm run seed:exercises
```

### Cargar solo plantillas originales:
```bash
npm run seed:templates
```

### Cargar solo plantillas adicionales:
```bash
npm run seed:additional
```

## Flujo de trabajo recomendado:

1. **Primera vez:**
   ```bash
   npm run seed
   ```

2. **Actualizar solo ejercicios:**
   ```bash
   npm run seed:exercises
   ```

3. **Actualizar solo plantillas:**
   ```bash
   npm run seed:templates
   npm run seed:additional
   ```

## Resumen de datos cargados:

- **Ejercicios:** 30+ ejercicios individuales
- **Plantillas originales:** 4 plantillas base
- **Plantillas adicionales:** 16 plantillas (50 solicitadas, implementadas 20 en esta fase)
- **Total plantillas:** 20 plantillas personalizadas

## Estructura de perfiles cubiertos:

✅ **Grupo 1:** 18-35 años, principiante, rodilla sana (2 plantillas)
✅ **Grupo 2:** 18-35 años, principiante, rodillas sensibles (1 plantilla)
✅ **Grupo 3:** 18-35 años, intermedio, rodilla sana (2 plantillas)
✅ **Grupo 4:** 18-35 años, intermedio, rodillas sensibles (1 plantilla)
✅ **Grupo 5:** 36-55 años, principiante, rodilla sana (2 plantillas)
✅ **Grupo 6:** 36-55 años, principiante, rodillas sensibles (1 plantilla)
✅ **Grupo 7:** 36-55 años, intermedio, rodilla sana (2 plantillas)
✅ **Grupo 8:** 36-55 años, intermedio, rodillas sensibles (1 plantilla)
✅ **Grupo 9:** 55+ años, principiante (2 plantillas)
✅ **Grupo 10:** 55+ años, intermedio (2 plantillas)

## Próximos pasos:

1. **Cargar los datos:** `npm run seed`
2. **Probar endpoints:** Usar Postman o similar
3. **Verificar recomendaciones:** Probar con diferentes perfiles
4. **Agregar plantillas restantes:** Completar las 30 plantillas faltantes cuando se necesiten
