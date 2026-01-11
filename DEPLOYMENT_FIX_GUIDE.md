# 🔧 Guía Rápida: Solucionar Errores de Deploy

## ❌ Errores Comunes y Soluciones

### Error 1: "Cannot find module" o "File not found" durante Build

**Causa:** Falta la carpeta `keys/` o archivos de certificados

**Solución:**
```bash
# NO necesitas incluir los archivos de certificados en el repo
# El proyecto ahora está configurado para funcionar sin ellos
# Solo necesita variables de entorno en Render
```

---

### Error 2: "MONGODB_URI contiene valores por defecto"

**Causa:** No configuraste la variable `MONGODB_URI` en Render

**Solución en Render:**
1. Ve al dashboard de tu servicio
2. Abre **Environment** tab
3. Agrega variable: `MONGODB_URI`
4. Valor: Tu connection string de MongoDB Atlas

**Ejemplo:**
```
mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/evastrong?retryWrites=true&w=majority
```

---

### Error 3: "JWT_SECRET no configurado"

**Causa:** Falta la variable `JWT_SECRET`

**Solución en Render:**
1. Genera un JWT_SECRET seguro:
```bash
# Ejecuta esto en tu terminal local:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Copia el resultado
3. En Render, agrega variable: `JWT_SECRET`
4. Pega el valor generado

---

## ✅ Pasos para Deploy Exitoso

### 1. **Verifica localmente primero**

```bash
cd evastrong_backend

# Instala dependencias
npm install

# Crea archivo .env.local con variables
cat > .env.local << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/evastrong
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
EOF

# Prueba el servidor
npm start
```

Si ves esto, está bien:
```
╔════════════════════════════════════════════╗
║   🎉 Eva Strong Backend - Iniciado        ║
╠════════════════════════════════════════════╣
║   Servidor: http://localhost:5000         ║
║   Ambiente: development                   ║
║   Base de datos: Conectada                ║
╚════════════════════════════════════════════╝
```

### 2. **Push a GitHub**

```bash
git add .
git commit -m "Fix: Solucionar errores de deployment"
git push origin main
```

### 3. **Configura en Render**

#### Variables de Entorno Requeridas:

| Variable | Ejemplo | Notas |
|----------|---------|-------|
| `NODE_ENV` | `production` | Requerido |
| `PORT` | `5000` | Render lo configura automáticamente |
| `MONGODB_URI` | `mongodb+srv://...` | **CRÍTICO** - MongoDB Atlas |
| `JWT_SECRET` | Long random string | Genéralo con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `FRONTEND_URL` | `https://tu-app.com` | Tu URL frontend |

#### Variables de Entorno Opcionales:

Si necesitas Google OAuth:
| Variable | Dónde obtenerlo |
|----------|-----------------|
| `GOOGLE_CLIENT_ID` | https://console.cloud.google.com |
| `GOOGLE_CLIENT_SECRET` | https://console.cloud.google.com |
| `GOOGLE_CALLBACK_URL` | `https://tu-render-app.onrender.com/auth/google/callback` |

#### Apple OAuth (si necesitas):
Si usas Apple OAuth, agrega:
- `APPLE_CLIENT_ID`
- `APPLE_TEAM_ID`
- `APPLE_KEY_ID`
- `APPLE_PRIVATE_KEY` (el contenido de la key, no un path)

---

## 🧪 Verificar que el Deploy Funciona

Después de deployar:

```bash
# Verifica el health check
curl https://tu-render-app.onrender.com/health

# Deberías recibir:
# {"status":"OK","timestamp":"2024-01-10T..."}
```

---

## 🚨 Si sigue fallando:

### 1. **Revisa los logs en Render**
- Dashboard → Tu servicio → Logs
- Busca mensajes de error rojo

### 2. **Verifica MongoDB Atlas**
- ¿El cluster está activo?
- ¿La conexión string es correcta?
- ¿Hay IP whitelist configurada? (Permitir acceso desde cualquier IP: 0.0.0.0/0)

### 3. **Valida localmente**
```bash
# Simula el ambiente de producción
NODE_ENV=production npm start
```

### 4. **Limpia el build**
En Render:
1. Ve a **Settings**
2. Haz clic en **Clear Build Cache**
3. Redeploy

---

## 📞 Soporte Adicional

- **MongoDB Atlas**: https://docs.mongodb.com/atlas/
- **Render Docs**: https://render.com/docs
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2

