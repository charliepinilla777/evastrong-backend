# 🎉 Eva Strong Backend - API REST

Backend para la app Eva Strong con autenticación OAuth (Google/Apple) y pagos con Mercado Pago.

## 📋 Características

- ✅ Autenticación OAuth con Google y Apple
- ✅ Autenticación manual (email/password)
- ✅ Integración Mercado Pago (pagos y suscripciones)
- ✅ Gestión de usuarios y perfiles
- ✅ Webhooks para eventos de pago
- ✅ JWT tokens
- ✅ Validación de datos
- ✅ Rate limiting
- ✅ CORS configurado

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Base de datos:** MongoDB
- **Autenticación:** Passport.js, JWT
- **Pagos:** Mercado Pago SDK
- **Validación:** express-validator
- **Seguridad:** Helmet, bcrypt, JWT

## 📁 Estructura del Proyecto

```
EvaStrong-Backend/
├── config/
│   └── passport.js              # Configuración de estrategias OAuth
├── models/
│   ├── User.js                  # Modelo de usuario
│   ├── Payment.js               # Modelo de pagos
│   └── Subscription.js          # Modelo de suscripciones
├── routes/
│   ├── auth.js                  # Rutas de autenticación
│   ├── users.js                 # Rutas de usuarios
│   ├── payments.js              # Rutas de pagos
│   └── subscriptions.js         # Rutas de suscripciones
├── middleware/
│   └── auth.js                  # Middleware de autenticación JWT
├── server.js                    # Archivo principal
├── package.json                 # Dependencias
├── .env.example                 # Variables de ambiente (template)
└── README.md                    # Este archivo
```

## 🚀 Instalación

### 1. Clonar repositorio

```bash
cd C:\Users\Carlos\Desktop\EvaStrong-Backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de ambiente

```bash
# Copiar .env.example a .env
cp .env.example .env

# Editar .env con tus valores
```

### 4. Configurar MongoDB

#### Opción A: Local (recomendado para desarrollo)

```bash
# Instalar MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Iniciar MongoDB
mongod
```

#### Opción B: MongoDB Atlas (cloud)

1. Ir a [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cuenta gratuita
3. Crear cluster
4. Copiar connection string a `.env` como `MONGODB_ATLAS_URI`

### 5. Configurar OAuth

#### Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear nuevo proyecto
3. Habilitar Google+ API
4. Crear credenciales (OAuth 2.0 Client ID)
5. Copiar a `.env`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL` = `http://localhost:5000/auth/google/callback`

#### Apple OAuth

1. Ir a [Apple Developer](https://developer.apple.com)
2. Crear App ID
3. Configurar Sign in with Apple
4. Descargar private key
5. Copiar a `.env`:
   - `APPLE_CLIENT_ID`
   - `APPLE_TEAM_ID`
   - `APPLE_KEY_ID`
   - `APPLE_PRIVATE_KEY_PATH` = `./keys/AuthKey.p8`

### 6. Configurar Mercado Pago

1. Registrarse en [Mercado Pago](https://www.mercadopago.com.ar)
2. Ir a [Panel de desarrollador](https://www.mercadopago.com.ar/developers/panel)
3. Copiar credenciales a `.env`:
   - `MERCADO_PAGO_ACCESS_TOKEN`
   - `MERCADO_PAGO_PUBLIC_KEY`

### 7. Iniciar servidor

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:5000`

## 📚 API Endpoints

### Autenticación

```
POST   /auth/register                    # Registro manual
POST   /auth/login                       # Login manual
GET    /auth/google                      # Login con Google
GET    /auth/google/callback             # Callback Google
GET    /auth/apple                       # Login con Apple
GET    /auth/apple/callback              # Callback Apple
POST   /auth/logout                      # Logout
GET    /auth/verify                      # Verificar token
POST   /auth/refresh                     # Renovar token
```

### Usuarios

```
GET    /users/profile                    # Obtener perfil
PUT    /users/profile                    # Actualizar perfil
POST   /users/change-password            # Cambiar contraseña
GET    /users/:userId                    # Obtener usuario por ID
DELETE /users/account/delete             # Eliminar cuenta
```

### Pagos

```
POST   /payments/create-preference       # Crear preferencia Mercado Pago
POST   /payments/webhook                 # Webhook Mercado Pago
GET    /payments/history                 # Historial de pagos
GET    /payments/:paymentId              # Detalles de pago
POST   /payments/:paymentId/refund       # Reembolsar pago
```

### Suscripciones

```
GET    /subscriptions/current            # Suscripción actual
GET    /subscriptions/history            # Historial de suscripciones
POST   /subscriptions/change-plan        # Cambiar plan
POST   /subscriptions/cancel             # Cancelar suscripción
POST   /subscriptions/renew              # Renovar suscripción
```

## 🔑 Ejemplos de Requests

### Registro

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "name": "Juan Pérez"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

### Obtener Perfil (requiere token)

```bash
curl -X GET http://localhost:5000/users/profile \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

### Crear Preferencia de Pago

```bash
curl -X POST http://localhost:5000/payments/create-preference \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "plan": "premium",
    "period": "monthly"
  }'
```

## 📊 Esquema de BD

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  avatar: String,
  password: String (hasheada),
  googleId: String,
  appleId: String,
  provider: String,
  emailVerified: Boolean,
  phone: String,
  age: Number,
  gender: String,
  fitnessLevel: String,
  goals: [String],
  subscription: {
    plan: String,
    active: Boolean,
    startDate: Date,
    endDate: Date,
  },
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  active: Boolean
}
```

### Payment
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  amount: Number,
  currency: String,
  status: String,
  mercadoPagoPaymentId: String,
  plan: String,
  subscriptionPeriod: String,
  description: String,
  createdAt: Date,
  approvedAt: Date,
}
```

### Subscription
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  plan: String,
  period: String,
  status: String,
  startDate: Date,
  endDate: Date,
  nextBillingDate: Date,
  amount: Number,
  autoRenew: Boolean,
  createdAt: Date,
}
```

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT tokens con expiración
- Rate limiting (100 requests por 15 min)
- CORS configurado
- Helmet para headers seguros
- Validación de inputs
- HTTPS recomendado en producción

## 🧪 Testing

```bash
npm test
```

## 📦 Deployment

### En Vercel

```bash
npm install -g vercel
vercel
```

### En Heroku

```bash
heroku create evastrong-api
git push heroku main
```

### En DigitalOcean

```bash
# SSH a tu servidor
ssh root@tu_ip

# Clonar repo
git clone <repo_url>
cd EvaStrong-Backend

# Instalar dependencias
npm install

# Configurar .env
nano .env

# Instalar PM2 para mantener el servidor activo
npm install -g pm2
pm2 start server.js --name "eva-strong"
pm2 save
```

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Verificar que MongoDB está corriendo: `mongod`
- Verificar MONGODB_URI en `.env`

### "Token inválido"
- Verificar JWT_SECRET en `.env`
- Verificar que el token no ha expirado

### "Mercado Pago error"
- Verificar MERCADO_PAGO_ACCESS_TOKEN
- Usar sandbox token para pruebas

## 📝 Notas

- Los planes tienen precios en pesos argentinos (ARS)
- Las suscripciones se renuevan automáticamente
- Los webhooks deben estar configurados en Mercado Pago
- El email es único por usuario

## 📞 Soporte

Para problemas o sugerencias, contacta al equipo de desarrollo.

## 📄 Licencia

MIT

---

**Versión:** 1.0.0  
**Última actualización:** 2026-01-08  
**Estado:** ✅ Producción
