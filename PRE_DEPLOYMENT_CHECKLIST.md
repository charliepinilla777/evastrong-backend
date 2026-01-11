# ✅ Checklist Pre-Deployment

Usa este checklist antes de hacer deploy a Render.

## 🔧 Paso 1: Preparación Local

- [ ] Clonar/actualizar repositorio
  ```bash
  git clone https://github.com/charliepinilla777/evastrong-backend.git
  cd evastrong_backend
  ```

- [ ] Instalar dependencias
  ```bash
  npm install
  ```

- [ ] Crear `.env.local` para testing (NO commitear)
  ```bash
  cat > .env.local << EOF
  NODE_ENV=development
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/evastrong
  JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  FRONTEND_URL=http://localhost:3000
  EOF
  ```

---

## ✨ Paso 2: Validación Local

- [ ] Ejecutar validación de deployment
  ```bash
  npm run validate
  ```
  
  Debe ver: ✅ Todo validado correctamente

- [ ] Iniciar servidor localmente
  ```bash
  npm start
  ```
  
  Debe ver:
  ```
  ╔════════════════════════════════════════════╗
  ║   🎉 Eva Strong Backend - Iniciado        ║
  ║   Servidor: http://localhost:5000         ║
  ║   Ambiente: development                   ║
  ║   Base de datos: Conectada                ║
  ╚════════════════════════════════════════════╝
  ```

- [ ] Probar health check (en otra terminal)
  ```bash
  curl http://localhost:5000/health
  ```
  
  Debe responder: `{"status":"OK","timestamp":"..."}`

- [ ] Detener servidor (Ctrl+C)

---

## 📤 Paso 3: Git & GitHub

- [ ] Verificar cambios
  ```bash
  git status
  ```

- [ ] Ver archivos modificados
  ```bash
  git diff config/passport.js
  git diff config/database.js
  git diff server.js
  ```

- [ ] Agregar cambios
  ```bash
  git add .
  ```

- [ ] Verificar que NO se agrega `.env` o archivos sensibles
  ```bash
  git status
  ```
  
  Debe mostrar solo archivos `.js`, `.md`, `.json` - NO `.env`

- [ ] Hacer commit
  ```bash
  git commit -m "Fix: Solucionar errores de deployment - validación de variables de entorno"
  ```

- [ ] Push a GitHub
  ```bash
  git push origin main
  ```

- [ ] Verificar en GitHub que los cambios están ahí
  - [ ] `config/passport.js` - Apple OAuth mejorado
  - [ ] `config/database.js` - Validación de URI
  - [ ] `server.js` - Validación de env vars
  - [ ] `.gitignore` - Actualizado
  - [ ] `package.json` - Scripts de validación
  - [ ] `validate-deployment.js` - Nuevo archivo
  - [ ] `DEPLOYMENT_FIX_GUIDE.md` - Nueva guía
  - [ ] `DEPLOYMENT_CHANGES.md` - Documentación

---

## 🚀 Paso 4: Configurar Render

### 4.1 MongoDB Atlas (si aún no lo hiciste)

- [ ] Crear cuenta en https://www.mongodb.com/cloud/atlas
- [ ] Crear cluster M0 (gratuito)
- [ ] Obtener connection string
- [ ] Reemplazar `<password>` con tu password
- [ ] Reemplazar `myFirstDatabase` con `evastrong`
- [ ] Copiar la URI para el siguiente paso

### 4.2 Render Dashboard

- [ ] Ir a https://render.com y hacer login
- [ ] Crear nuevo "Web Service"
- [ ] Conectar repositorio GitHub: `charliepinilla777/evastrong-backend`
- [ ] Seleccionar rama: `main`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`

### 4.3 Configurar Variables de Entorno en Render

En el dashboard de Render, ir a **Environment** y agregar:

**REQUERIDAS:**

- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/evastrong?retryWrites=true&w=majority`
  
  (Reemplaza `usuario`, `password` y `xxxxx` con tus valores reales)

- [ ] `JWT_SECRET` = (genera con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

**OPCIONALES (solo si necesitas):**

- [ ] `FRONTEND_URL` = Tu URL frontend
- [ ] `GOOGLE_CLIENT_ID` = (si tienes Google OAuth)
- [ ] `GOOGLE_CLIENT_SECRET` = (si tienes Google OAuth)
- [ ] `GOOGLE_CALLBACK_URL` = `https://tu-render-app.onrender.com/auth/google/callback`

---

## ⏳ Paso 5: Deploy

- [ ] Hacer clic en **Deploy** en Render
- [ ] Esperar a que termine (2-3 minutos)
- [ ] Ver que no hay errores rojos en los logs

---

## 🧪 Paso 6: Verificación Post-Deploy

- [ ] Copiar URL del servicio (ej: `https://evastrong-backend.onrender.com`)

- [ ] Probar health check
  ```bash
  curl https://evastrong-backend.onrender.com/health
  ```
  
  Debe responder: `{"status":"OK","timestamp":"..."}`

- [ ] Revisar logs en Render por mensajes de error
  - Si ves "✅ MongoDB Conectado" = EXCELENTE
  - Si ves errores rojos = revisar mensaje específico

- [ ] Si falla, revisar Render logs y ejecutar `npm run validate` localmente

---

## 🎉 ¡Listo!

Si pasaste todos los checks, tu deploy debería estar funcionando.

**Pruebas adicionales:**
- [ ] Probar endpoint de autenticación con tu frontend
- [ ] Revisar respuestas de API
- [ ] Monitorear logs en Render

---

## 🚨 Troubleshooting Rápido

Si algo falla:

1. **Error de MongoDB**
   - Verifica connection string en Render
   - Asegúrate que MongoDB Atlas permite conexión desde cualquier IP
   - Prueba localmente que la URI funciona

2. **Error de JWT_SECRET**
   - Genera nuevo: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Agrega en Render Environment

3. **Otros errores**
   - Ejecuta localmente: `npm run validate`
   - Revisa logs de Render
   - Haz "Clear Build Cache" en Render → Redeploy

---

## 📞 Recursos

- 📖 [DEPLOYMENT_FIX_GUIDE.md](./DEPLOYMENT_FIX_GUIDE.md) - Guía detallada de errores
- 📖 [DEPLOYMENT_CHANGES.md](./DEPLOYMENT_CHANGES.md) - Qué cambió y por qué
- 🔗 [Render Docs](https://render.com/docs)
- 🔗 [MongoDB Atlas Docs](https://docs.mongodb.com/atlas/)

