# 🔧 Render - Configuración de Variables de Entorno

## ✅ Variables Requeridas para Render

Aquí está la lista completa de variables que DEBES configurar en Render:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/evastrong?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_aleatorio_muy_largo_minimo_32_caracteres
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=https://evastrong-backend.onrender.com/auth/google/callback
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxx
MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=https://evastrong.com
```

---

## 🔐 Guía Detallada para Cada Variable

### 1️⃣ NODE_ENV

```
Valor: production
```

**Explicación:** Indica que estamos en producción. Render automáticamente usa este valor.

---

### 2️⃣ PORT

```
Valor: 5000
```

**Explicación:** Puerto donde corre tu servidor. Render lo mapea automáticamente.

---

### 3️⃣ MONGODB_URI

**Obtener en MongoDB Atlas:**

1. Ve a https://www.mongodb.com/cloud/atlas
2. Inicia sesión
3. Ve a tu cluster
4. Haz clic en **"Connect"**
5. Selecciona **"Drivers"**
6. Copia la connection string

**Formato correcto:**

```
mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/evastrong?retryWrites=true&w=majority
```

**Importante:**
- ✅ Reemplaza `usuario` con tu usuario de BD
- ✅ Reemplaza `contraseña` con tu contraseña
- ✅ Reemplaza `xxxxx` con tu cluster ID
- ✅ Agrega `?retryWrites=true&w=majority` al final si no está
- ✅ Verifica que el nombre de BD es `evastrong`

**Ejemplo Real:**

```
mongodb+srv://evastrong_user:MyPassword123@evastrong-cluster.a1b2c3.mongodb.net/evastrong?retryWrites=true&w=majority
```

---

### 4️⃣ JWT_SECRET

**¿Qué es?** Token secreto para firmar JWT tokens

**Cómo generarlo:**

En tu terminal, ejecuta:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Resultado esperado:**

```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

Copia este valor y úsalo en `JWT_SECRET`

**Importante:**
- ✅ Debe ser único
- ✅ Mínimo 32 caracteres
- ✅ Nunca compartas este valor
- ✅ Mantenlo igual en desarrollo y producción para que los tokens sean válidos

---

### 5️⃣ GOOGLE_CLIENT_ID

**Obtener en Google Cloud Console:**

1. Ve a https://console.cloud.google.com
2. Selecciona tu proyecto "EvaStrong"
3. Ve a **"APIs & Services"** → **"Credentials"**
4. Busca tu OAuth 2.0 Client (tipo "Web application")
5. Copia el **"Client ID"**

**Formato:**

```
xxxx.apps.googleusercontent.com
```

**Ejemplo:**

```
123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

---

### 6️⃣ GOOGLE_CLIENT_SECRET

**Obtener en Google Cloud Console:**

1. Mismo lugar que CLIENT_ID
2. Copia el **"Client Secret"**

**Formato:**

```
GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
```

**Ejemplo:**

```
GOCSPX-a1b2c3d4e5f6g7h8i9j0k1l2
```

---

### 7️⃣ GOOGLE_CALLBACK_URL

**Este debe ser:**

```
https://evastrong-backend.onrender.com/auth/google/callback
```

**Importante:**
- ✅ Debe coincidir exactamente con lo que pusiste en Google Cloud Console
- ✅ Reemplaza `evastrong-backend` con tu nombre de servicio en Render
- ✅ Debe estar en HTTPS (Render lo proporciona automáticamente)

---

### 8️⃣ MERCADO_PAGO_ACCESS_TOKEN

**Obtener en Mercado Pago:**

1. Ve a https://www.mercadopago.com/developers/panel/credentials
2. Selecciona **"Sandbox"** o **"Producción"** según lo que necesites
3. Copia el **"Access Token"**

**Formato:**

```
APP_USR-xxxxxxxxxxxxxxxxxxxx
```

**Ejemplo:**

```
APP_USR-1234567890-abcdefghij-klmnopqrst
```

---

### 9️⃣ MERCADO_PAGO_PUBLIC_KEY

**Obtener en Mercado Pago:**

1. Mismo dashboard que ACCESS_TOKEN
2. Copia la **"Public Key"** o **"Clave Pública"**

**Formato:**

```
APP_USR-xxxxxxxxxxxxxxxxxxxx
```

---

### 🔟 FRONTEND_URL

**Este es la URL de tu frontend:**

```
https://evastrong.com
```

O si no tienes dominio aún:

```
https://evastrong-frontend.vercel.app
```

**Importante:**
- ✅ Debe ser la URL completa
- ✅ Sin trailing slash (/)
- ✅ Debe estar en HTTPS
- ✅ Render la usará para CORS

---

## 🚀 Cómo Configurar en Render

### Paso 1: Ir a tu Proyecto en Render

1. Ve a https://render.com/dashboard
2. Selecciona tu proyecto `evastrong-backend`
3. Haz clic en **"Settings"**

### Paso 2: Environment Variables

1. Ve a **"Environment Variables"**
2. Haz clic en **"Add Environment Variable"**

### Paso 3: Agregar Cada Variable

Para cada variable:

```
Name:  [Nombre de la variable]
Value: [Valor]
```

Haz clic en **"Save"** después de cada una

### Paso 4: Redeploy

1. Ve a **"Deployments"**
2. Haz clic en **"Trigger Deploy"** o **"Redeploy"**
3. Espera a que se complete

---

## 📋 Checklist de Configuración

```
NODE_ENV                      [ ] Configurado
PORT                          [ ] 5000
MONGODB_URI                   [ ] Configurado (formato correcto)
JWT_SECRET                    [ ] Generado (32+ caracteres)
GOOGLE_CLIENT_ID              [ ] Copiado de Google Cloud
GOOGLE_CLIENT_SECRET          [ ] Copiado de Google Cloud
GOOGLE_CALLBACK_URL           [ ] Configurado correctamente
MERCADO_PAGO_ACCESS_TOKEN     [ ] Copiado de MP
MERCADO_PAGO_PUBLIC_KEY       [ ] Copiado de MP
FRONTEND_URL                  [ ] Configurado
```

---

## ✅ Verificación Post-Configuración

Una vez configuradas todas las variables:

### 1. Verificar en Logs de Render

1. Ve a **"Logs"** en tu proyecto
2. Debería ver:

```
✅ MongoDB Conectado
   Host: evastrong-cluster.xxxxx.mongodb.net
   Base de datos: evastrong

✅ Passport Google Strategy configurado
✅ Servidor escuchando en puerto 5000
```

### 2. Health Check

En tu terminal:

```bash
curl https://evastrong-backend.onrender.com/health
```

**Respuesta esperada:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-10T12:34:56.789Z"
}
```

### 3. Verificar Google Login

```bash
curl https://evastrong-backend.onrender.com/auth/google
```

Debería redirigir a Google login.

---

## 🆘 Errores Comunes y Soluciones

### Error: "Authentication Failed (MongoDB)"

```
❌ Error: connect ENOTFOUND evastrong-cluster.a1b2c3.mongodb.net

Solución:
1. Verifica que MONGODB_URI sea correcto
2. Asegúrate de que el cluster está "Ready" en MongoDB Atlas
3. Verifica que tu IP está en whitelist (o usa 0.0.0.0/0)
4. Redeploy en Render
```

### Error: "Invalid credentials (Google)"

```
❌ Error: Redirect URI mismatch

Solución:
1. Ve a Google Cloud Console
2. Verifica que en "Authorized redirect URIs" está:
   https://evastrong-backend.onrender.com/auth/google/callback
3. Si cambió, agrega la nueva URL
4. Redeploy en Render
```

### Error: "JWT_SECRET not set"

```
❌ Error: JWT_SECRET is undefined

Solución:
1. Verifica que JWT_SECRET esté en Environment Variables
2. No dejes el campo vacío
3. Usa el secreto generado con crypto
4. Redeploy en Render
```

### Error: "Mercado Pago authentication failed"

```
❌ Error: Invalid credentials

Solución:
1. Verifica que copió correctamente ACCESS_TOKEN
2. Asegúrate de que estás en el ambiente correcto (Sandbox/Producción)
3. En Google Cloud, verifica que PUBLIC_KEY no está vacía
4. Redeploy en Render
```

---

## 🔄 Proceso de Deploy Completo

### Primera vez:

```
1. Crear Web Service en Render
2. Conectar repositorio GitHub
3. Agregar todas las variables de entorno
4. Hacer clic en "Create Web Service"
5. Esperar 3-5 minutos
6. Verificar health check
```

### Cambios posteriores:

```
1. Editar variable en Settings → Environment Variables
2. Hacer clic en "Redeploy"
3. Esperar a que se complete
```

---

## 📝 Formato de Variables - Resumen

```bash
# PRODUCCIÓN
NODE_ENV=production
PORT=5000

# DATABASE
MONGODB_URI=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/evastrong?retryWrites=true&w=majority

# JWT
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

# GOOGLE OAUTH
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-a1b2c3d4e5f6g7h8i9j0k1l2
GOOGLE_CALLBACK_URL=https://evastrong-backend.onrender.com/auth/google/callback

# MERCADO PAGO
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-1234567890-abcdefghij-klmnopqrst
MERCADO_PAGO_PUBLIC_KEY=APP_USR-1234567890-abcdefghij-klmnopqrst

# FRONTEND
FRONTEND_URL=https://evastrong.com
```

---

## 🎯 ¿Qué Hacer Ahora?

1. ✅ Obtén todas tus credenciales reales
2. ✅ Verifica el formato de cada una
3. ✅ Agrega en Render Environment Variables
4. ✅ Redeploy
5. ✅ Verifica con health check
6. ✅ Prueba endpoints

---

**¡Tu backend estará en producción en minutos! 🚀**
