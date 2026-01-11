# 🚀 Quick Start: Deploy en 5 Minutos

Si tu deploy anterior falló, esta es la guía rápida para arreglarlo.

## ⚡ Resumen de Cambios

Se han solucionado estos errores críticos:

1. ✅ **Apple OAuth no crashea** si no hay credenciales
2. ✅ **Variables de entorno validadas** antes de iniciar
3. ✅ **MongoDB URI verificada** para evitar valores por defecto
4. ✅ **Scripts de validación** para detectar problemas temprano

---

## 🔧 Paso 1: Setup Local (2 minutos)

### En Windows:
```bash
setup-local.bat
```

### En Mac/Linux:
```bash
bash setup-local.sh
```

Esto:
- ✅ Instala dependencias
- ✅ Genera JWT_SECRET seguro
- ✅ Crea `.env.local`
- ✅ Valida todo

---

## 🧪 Paso 2: Prueba Local (1 minuto)

```bash
npm start
```

Deberías ver:
```
╔════════════════════════════════════════════╗
║   🎉 Eva Strong Backend - Iniciado        ║
║   Servidor: http://localhost:5000         ║
║   Ambiente: development                   ║
║   Base de datos: Conectada                ║
╚════════════════════════════════════════════╝
```

Si ves esto = ✅ Listo para deploy

---

## 📤 Paso 3: Push a GitHub (1 minuto)

```bash
git add .
git commit -m "Fix: Deployment fixes"
git push origin main
```

---

## 🚀 Paso 4: Deploy en Render (1 minuto)

### Variables de Entorno REQUERIDAS:

```
NODE_ENV = production
MONGODB_URI = mongodb+srv://usuario:password@cluster.mongodb.net/evastrong?retryWrites=true&w=majority
JWT_SECRET = [generar: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
```

### Si usas Google OAuth (OPCIONAL):
```
GOOGLE_CLIENT_ID = tu_client_id
GOOGLE_CLIENT_SECRET = tu_client_secret
GOOGLE_CALLBACK_URL = https://tu-render-app.onrender.com/auth/google/callback
FRONTEND_URL = https://tu-app.com
```

---

## ✅ Verificación Final

```bash
curl https://tu-render-app.onrender.com/health
# Respuesta: {"status":"OK","timestamp":"..."}
```

---

## 📚 Documentación Completa

- 📖 [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md) - Checklist detallado
- 📖 [DEPLOYMENT_FIX_GUIDE.md](./DEPLOYMENT_FIX_GUIDE.md) - Solución de errores
- 📖 [DEPLOYMENT_CHANGES.md](./DEPLOYMENT_CHANGES.md) - Qué cambió y por qué

---

## 🚨 Si Falla

1. Ejecuta localmente:
   ```bash
   npm run validate
   ```

2. Lee los mensajes de error específicos

3. Revisa los logs en Render dashboard

4. Consulta [DEPLOYMENT_FIX_GUIDE.md](./DEPLOYMENT_FIX_GUIDE.md)

---

¡Eso es todo! 🎉

