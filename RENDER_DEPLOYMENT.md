# 🚀 Guía Completa: Desplegar EvaStrong Backend en Render

## ¿Por qué Render?

✅ Hosting gratuito para aplicaciones Node.js
✅ Despliegue automático desde GitHub
✅ Base de datos gratuita (aunque recomendamos MongoDB Atlas)
✅ Soporte para variables de entorno
✅ SSL/HTTPS incluido
✅ Muy fácil de configurar

---

## 📋 Paso 1: Preparar MongoDB Atlas (Base de Datos)

### 1.1 Crear Cuenta en MongoDB Atlas

1. Ve a https://www.mongodb.com/cloud/atlas
2. Haz clic en **"Sign Up"** o **"Register"**
3. Completa el registro
4. Crea una organización

### 1.2 Crear Cluster

1. En el dashboard, haz clic en **"Create Deployment"**
2. Selecciona **"M0 FREE"** (opción gratuita)
3. Elige tu región preferida (ej: AWS N. Virginia)
4. Haz clic en **"Create"**
5. Espera a que se cree el cluster (2-3 minutos)

### 1.3 Obtener Conexión String

1. Una vez creado el cluster, haz clic en **"Connect"**
2. Selecciona **"Drivers"**
3. Elige **"Node.js"** y versión **"4.0 or later"**
4. Copia la connection string
5. Reemplaza `<password>` con tu contraseña
6. Reemplaza `myFirstDatabase` con `evastrong`

**Ejemplo:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/evastrong?retryWrites=true&w=majority
```

---

## 🔑 Paso 2: Configurar Google OAuth

### 2.1 Crear Proyecto en Google Cloud

1. Ve a https://console.cloud.google.com
2. Haz clic en **"Create Project"**
3. Nombre: `EvaStrong`
4. Haz clic en **"Create"**

### 2.2 Habilitar Google+ API

1. Ve a **"APIs & Services"** → **"Library"**
2. Busca **"Google+ API"**
3. Haz clic en **"Enable"**

### 2.3 Crear Credenciales OAuth

1. Ve a **"APIs & Services"** → **"Credentials"**
2. Haz clic en **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Selecciona **"Web application"**
4. En **"Authorized JavaScript origins"** agrega:
   - `http://localhost:5000`
   - `https://evastrong-backend.onrender.com`

5. En **"Authorized redirect URIs"** agrega:
   - `http://localhost:5000/auth/google/callback`
   - `https://evastrong-backend.onrender.com/auth/google/callback`

6. Haz clic en **"Create"**
7. **Copia y guarda:**
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

---

## 🎯 Paso 3: Configurar Render

### 3.1 Conectar GitHub

1. Ve a https://render.com
2. Haz clic en **"Sign Up"** (puedes usar GitHub)
3. Selecciona tu cuenta de GitHub
4. Autoriza Render

### 3.2 Crear Nuevo Servicio Web

1. En el dashboard, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. Selecciona tu repositorio `evastrong-backend`
4. Haz clic en **"Connect"**

### 3.3 Configurar el Servicio

**Información Básica:**
- **Name:** `evastrong-backend`
- **Environment:** `Node`
- **Region:** `Ohio` (o tu región preferida)
- **Branch:** `main`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** `Free`

### 3.4 Agregar Variables de Entorno

En la sección **"Environment Variables"**, agrega:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/evastrong?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_jwt_aleatorio_muy_largo_cambiar
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=https://evastrong-backend.onrender.com/auth/google/callback
MERCADO_PAGO_ACCESS_TOKEN=tu_token_mercado_pago
MERCADO_PAGO_PUBLIC_KEY=tu_public_key
FRONTEND_URL=https://evastrong.com
```

### 3.5 Desplegar

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir tu aplicación
3. Espera a que se complete (2-5 minutos)
4. Verás tu URL: `https://evastrong-backend.onrender.com`

---

## ✅ Verificación Post-Despliegue

Una vez que se complete, verifica que funcione:

### 1. Health Check
```bash
curl https://evastrong-backend.onrender.com/health
```

Deberías ver:
```json
{
  "status": "OK",
  "timestamp": "2024-01-10T12:34:56.789Z"
}
```

### 2. Prueba de Autenticación
```bash
curl -X GET https://evastrong-backend.onrender.com/auth/google
```

### 3. Monitorizar Logs
En Render dashboard → Tu proyecto → **Logs**

---

## 🔧 Configuración Post-Despliegue

### 1. Actualizar CORS

En `server.js`, actualiza:
```javascript
cors({
  origin: ['https://evastrong.com', 'https://evastrong-backend.onrender.com'],
  credentials: true,
})
```

### 2. Configurar Webhooks de Mercado Pago

1. Ve a https://www.mercadopago.com/developers/
2. En Webhooks, agrega:
   - URL: `https://evastrong-backend.onrender.com/payments/webhook`
   - Eventos: `payment.created`, `payment.updated`

### 3. Configurar Dominio Personalizado (Opcional)

En Render:
1. Ve a **Settings** → **Custom Domain**
2. Agrega: `api.evastrong.com`
3. Sigue las instrucciones de DNS

---

## 📝 Variables de Entorno Necesarias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Ambiente | `production` |
| `PORT` | Puerto | `5000` |
| `MONGODB_URI` | BD MongoDB Atlas | `mongodb+srv://...` |
| `JWT_SECRET` | Secreto JWT | Random string muy largo |
| `GOOGLE_CLIENT_ID` | ID de Google OAuth | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Secret de Google | From Google Console |
| `MERCADO_PAGO_ACCESS_TOKEN` | Token Mercado Pago | From MP Dashboard |
| `FRONTEND_URL` | URL del frontend | `https://evastrong.com` |

---

## 🆘 Solución de Problemas

### Error: MongoDB Connection Failed
- Verifica que la connection string sea correcta
- Asegúrate de que tu IP está en whitelist de MongoDB Atlas
- Ve a MongoDB Atlas → Security → Network Access → Add IP Address

### Error: Build Failed
- Ve a Logs en Render
- Verifica que no haya errores en `package.json`
- Asegúrate de que todas las dependencias estén instaladas

### Error: 404 Not Found
- Verifica que el servicio se está ejecutando
- Revisa los logs en Render
- Comprueba que las rutas en `server.js` sean correctas

### Error: CORS
- Verifica que `FRONTEND_URL` sea correcto
- Actualiza la configuración de CORS en `server.js`
- Reinicia el servicio

---

## 🔄 Despliegues Futuros

Cada vez que hagas push a GitHub:

1. Render detecta automáticamente los cambios
2. Comienza el build automáticamente
3. Si todo va bien, se redeploya automáticamente
4. Si hay error, Render te notifica por email

**No necesitas hacer nada manualmente** después del primer setup 🎉

---

## 📊 Monitoreo

En el dashboard de Render puedes:

- **Ver Logs:** Deployments → [Tu servicio] → Logs
- **Ver Métricas:** Metrics (CPU, Memoria, Bandwidth)
- **Configurar Alertas:** Settings → Alerts
- **Ver Historial de Deployments:** Deployments

---

## 🎯 URL Final

Tu backend estará disponible en:

```
https://evastrong-backend.onrender.com
```

Comparte esta URL con tu frontend para conectar.

---

**¡Tu backend está listo para producción! 🚀**
