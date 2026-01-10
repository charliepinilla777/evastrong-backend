# 🏋️ EvaStrong Backend - Setup Completo

## 📋 Tabla de Contenidos

1. [Descripción](#descripción)
2. [Requisitos](#requisitos)
3. [Instalación Local](#instalación-local)
4. [Configuración](#configuración)
5. [Despliegue](#despliegue)
6. [API Endpoints](#api-endpoints)
7. [Testing](#testing)

---

## 📝 Descripción

**EvaStrong Backend** es una API REST construida con:

- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Passport.js** - Autenticación OAuth (Google, Apple)
- **JWT** - Tokens de seguridad
- **Mercado Pago** - Procesamiento de pagos

**Características principales:**

✅ Autenticación multi-proveedor (Google, Apple, Local)
✅ Sistema de suscripciones
✅ Procesamiento de pagos con Mercado Pago
✅ Gestión de usuarios
✅ JWT para APIs seguras
✅ Rate limiting y validación de datos
✅ Manejo robusto de errores
✅ Logging en producción

---

## 🔧 Requisitos

- **Node.js** >= 18.0.0
- **npm** o **yarn**
- **MongoDB** (local o MongoDB Atlas)
- **Git**

---

## 📥 Instalación Local

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/charliepinilla777/evastrong-backend.git
cd evastrong-backend
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y rellena:

```
PORT=5000
NODE_ENV=development

# MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/evastrong

# O MongoDB Atlas
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/evastrong

JWT_SECRET=tu_secreto_jwt_aqui_cambiar_en_produccion
JWT_EXPIRE=7d

# Google OAuth (obtener de console.cloud.google.com)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Mercado Pago (obtener de mp.com)
MERCADO_PAGO_ACCESS_TOKEN=xxx
MERCADO_PAGO_PUBLIC_KEY=xxx

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Paso 4: Iniciar el Servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

**Resultado esperado:**

```
╔════════════════════════════════════════════╗
║   🎉 Eva Strong Backend - Iniciado        ║
╠════════════════════════════════════════════╣
║   Servidor: http://localhost:5000          ║
║   Ambiente: development                    ║
║   Base de datos: Conectada                 ║
╚════════════════════════════════════════════╝
```

---

## ⚙️ Configuración

### MongoDB

**Opción 1: MongoDB Local**

```bash
# Instalar MongoDB Community
# https://docs.mongodb.com/manual/installation/

# Iniciar MongoDB
mongod
```

**Opción 2: MongoDB Atlas (Recomendado)**

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea un cluster gratuito
3. Obtén la connection string
4. Actualiza `MONGODB_URI` en `.env.local`

### Google OAuth

1. Ve a https://console.cloud.google.com
2. Crea un nuevo proyecto
3. Habilita Google+ API
4. Crea credenciales OAuth
5. Copia `CLIENT_ID` y `CLIENT_SECRET`
6. Actualiza en `.env.local`

### Mercado Pago

1. Ve a https://www.mercadopago.com/developers/
2. Crea una cuenta
3. Ve a **Credenciales** → **Producción**
4. Copia `Access Token` y `Public Key`
5. Actualiza en `.env.local`

---

## 🚀 Despliegue

### Opción 1: Render (Recomendado - Gratuito)

Ver archivo: `RENDER_DEPLOYMENT.md`

```bash
# Quick start
1. Ve a https://render.com
2. Conecta tu repositorio GitHub
3. Sigue la guía en RENDER_DEPLOYMENT.md
```

### Opción 2: Vercel

```bash
# Vercel también soporta Node.js
npm i -g vercel
vercel
```

### Opción 3: Heroku

```bash
# Necesita tarjeta de crédito (no más plan gratuito)
npm i -g heroku
heroku login
heroku create
git push heroku main
```

### Opción 4: DigitalOcean / Linode

Requiere configuración manual de servidor.

---

## 📚 API Endpoints

### 🔐 Autenticación

```
GET    /auth/google              - Inicia login con Google
GET    /auth/google/callback     - Callback de Google
GET    /auth/logout              - Cierra sesión
POST   /auth/register            - Registro local
POST   /auth/login               - Login local
```

### 👤 Usuarios

```
GET    /users/:id                - Obtener usuario
PUT    /users/:id                - Actualizar usuario
DELETE /users/:id                - Eliminar usuario
GET    /users                    - Listar usuarios (admin)
```

### 💳 Pagos

```
POST   /payments/create-payment  - Crear pago
GET    /payments/:id             - Obtener estado de pago
POST   /payments/webhook         - Webhook de Mercado Pago
```

### 📅 Suscripciones

```
GET    /subscriptions            - Obtener suscripción del usuario
POST   /subscriptions/create     - Crear suscripción
PUT    /subscriptions/:id        - Actualizar suscripción
DELETE /subscriptions/:id        - Cancelar suscripción
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
npm test
```

### Pruebas Manuales

Usar **Postman** o **Insomnia**:

1. Descargar: https://www.postman.com/downloads/
2. Importar collection (si está disponible)
3. Configurar variables de entorno
4. Hacer requests de prueba

**Ejemplo - Health Check:**

```bash
curl http://localhost:5000/health
```

Respuesta esperada:

```json
{
  "status": "OK",
  "timestamp": "2024-01-10T12:34:56.789Z"
}
```

---

## 📁 Estructura del Proyecto

```
evastrong-backend/
├── config/
│   ├── passport.js          # Configuración Passport OAuth
│   └── database.js          # Conexión a MongoDB
├── middleware/
│   ├── auth.js              # Middleware de autenticación
│   ├── authJWT.js           # JWT protection
│   └── errorHandler.js      # Manejo de errores
├── models/
│   ├── User.js              # Schema de Usuario
│   ├── Payment.js           # Schema de Pago
│   └── Subscription.js      # Schema de Suscripción
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── users.js             # Rutas de usuarios
│   ├── payments.js          # Rutas de pagos
│   └── subscriptions.js     # Rutas de suscripciones
├── utils/
│   └── logger.js            # Sistema de logging
├── server.js                # Punto de entrada
├── package.json             # Dependencias
├── .env.example             # Variables de ejemplo
└── README.md                # Este archivo
```

---

## 🐛 Solución de Problemas

### MongoDB no conecta

```bash
# Verificar que MongoDB está corriendo
mongod

# O usar MongoDB Atlas connection string
```

### Port ya está en uso

```bash
# Cambiar puerto en .env
PORT=5001

# O matar el proceso
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### JWT_SECRET no configurado

```bash
# Generar secreto fuerte
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Errores de CORS

```javascript
// En server.js, verifica:
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
})
```

---

## 📚 Documentación Adicional

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Passport.js Docs](http://www.passportjs.org/)
- [JWT Docs](https://jwt.io/)
- [Mercado Pago API](https://www.mercadopago.com/developers/es/reference)

---

## 📝 Notas Importantes

⚠️ **Seguridad:**
- Nunca commiteés archivos `.env` con credenciales reales
- Usa variables de entorno para secretos
- Cambia `JWT_SECRET` en producción
- Habilita HTTPS en producción
- Usa HTTPS en las URLs de callbacks

⚠️ **Rendimiento:**
- Implementar caché si es necesario
- Usar indexes en MongoDB
- Rate limiting ya está configurado
- Monitoring de logs

---

## ✅ Checklist Pre-Producción

- [ ] MongoDB Atlas configurado
- [ ] Google OAuth credentials obtenidos
- [ ] Mercado Pago credentials obtenidas
- [ ] Variables de entorno configuradas en Render
- [ ] Dominio personalizado configurado (opcional)
- [ ] CORS configurado correctamente
- [ ] Webhooks de Mercado Pago configurados
- [ ] Logs monitoreados
- [ ] Backups de BD configurados

---

## 🤝 Soporte

Para preguntas o problemas:

1. Ve a Issues en GitHub
2. Crea un issue con detalles
3. Incluye logs de error
4. Incluye steps para reproducir

---

## 📄 Licencia

MIT

---

**¡Tu backend está listo para escalar! 🚀**
