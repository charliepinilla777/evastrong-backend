# 🔙 EVA STRONG - DOCUMENTACIÓN BACKEND

## 🎯 ¿QUÉ ES EL BACKEND?

El backend es el **servidor** que procesa datos, guarda información en la base de datos y responde al frontend.

```
Frontend (Flutter App)
          ↓
    HTTP Requests
          ↓
Backend (Node.js) ← TÚ ESTÁS AQUÍ
          ↓
   MongoDB (BD)
```

---

## 🏗️ ARQUITECTURA DEL BACKEND

```
┌─────────────────────────────────────────┐
│        FRONTEND (Solicitudes)           │
└─────────────────┬───────────────────────┘
                  │ HTTP
                  ▼
┌─────────────────────────────────────────┐
│         EXPRESS SERVER (server.js)      │
│  ┌──────────────────────────────────┐   │
│  │ 1. Middlewares                   │   │
│  │    ├─ Helmet (seguridad)         │   │
│  │    ├─ CORS                       │   │
│  │    ├─ Body Parser                │   │
│  │    └─ JWT Auth                   │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ 2. Rutas (Routes)                │   │
│  │    ├─ /auth (autenticación)      │   │
│  │    ├─ /users (perfil)            │   │
│  │    ├─ /payments (pagos)          │   │
│  │    └─ /subscriptions (suscripción)   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ 3. Lógica (Controllers)          │   │
│  │    ├─ Validar datos              │   │
│  │    ├─ Procesar solicitudes       │   │
│  │    └─ Retornar respuestas        │   │
│  └──────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│    EXTERNAL SERVICES (OAuth, MP)        │
│    ├─ Google OAuth                      │
│    ├─ Apple OAuth                       │
│    └─ Mercado Pago API                  │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         MONGODB DATABASE                │
│    ├─ Colección: Users                  │
│    ├─ Colección: Payments               │
│    └─ Colección: Subscriptions          │
└─────────────────────────────────────────┘
```

---

## 📄 server.js - EL CORAZÓN DEL BACKEND

### ¿Qué hace?

```javascript
// 1. Cargar configuración
require('dotenv').config();

// 2. Importar librerías
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// 3. Inicializar app
const app = express();

// 4. Configurar middlewares
app.use(helmet());           // Agregar headers de seguridad
app.use(cors());             // Permitir solicitudes desde frontend
app.use(express.json());     // Parsear JSON

// 5. Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB conectado'))
  .catch((err) => console.error('✗ Error MongoDB:', err));

// 6. Registrar rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/subscriptions', subscriptionRoutes);

// 7. Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
```

### Flujo de una solicitud

```
1. Frontend envía: POST /auth/login
                   {email, password}
                   ↓
2. Express recibe y ejecuta middlewares
   ├─ Helmet: Agrega headers
   ├─ CORS: Verifica origen
   ├─ Body Parser: Parsea JSON
                   ↓
3. Express encuentra ruta /auth/login
   Ejecuta controlador login()
                   ↓
4. Controlador valida datos
   ├─ ¿Email válido?
   ├─ ¿Existe el usuario?
   ├─ ¿Contraseña correcta?
                   ↓
5. Si todo OK: Generar JWT token
   Si hay error: Retornar error
                   ↓
6. Express envía respuesta HTTP
   {
     success: true,
     token: "jwt_token_aqui",
     user: {...}
   }
                   ↓
7. Frontend recibe y procesa
```

---

## 🔐 AUTENTICACIÓN - routes/auth.js

### Endpoints disponibles

#### POST /auth/register
**¿Para qué?** Registrar un nuevo usuario

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "name": "Juan Pérez"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "provider": "local",
    "emailVerified": false,
    "subscription": {
      "plan": "free",
      "active": false
    }
  }
}
```

**Proceso interno:**
```
1. Validar email (debe ser válido)
2. Validar contraseña (mín 8 caracteres)
3. Verificar que email no exista en BD
4. Hashear contraseña con bcrypt
5. Crear documento User en MongoDB
6. Generar JWT token
7. Retornar token + usuario
```

#### POST /auth/login
**¿Para qué?** Iniciar sesión

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "lastLogin": "2026-01-08T12:00:00Z"
  }
}
```

**Proceso interno:**
```
1. Buscar usuario por email
2. Si no existe → Error 401
3. Comparar contraseña ingresada con hash en BD
4. Si no coincide → Error 401
5. Actualizar lastLogin
6. Generar JWT token
7. Retornar token + usuario
```

#### GET /auth/google
**¿Para qué?** Iniciar login con Google

**Proceso:**
```
1. User hace clic "Login con Google"
2. Redirige a: /auth/google
3. Passport redirige a Google OAuth
4. Usuario autoriza a Eva Strong
5. Google redirige a: /auth/google/callback
6. Passport crea/actualiza usuario
7. Frontend recibe deep link con token
8. Frontend guarda token
```

#### POST /auth/logout
**¿Para qué?** Cerrar sesión

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

#### GET /auth/verify
**¿Para qué?** Verificar si un token es válido

**Request:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "userId": "507f1f77bcf86cd799439011"
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

#### POST /auth/refresh
**¿Para qué?** Renovar un token expirado

**Response (200 OK):**
```json
{
  "success": true,
  "token": "nuevo_token_aqui"
}
```

---

## 👤 USUARIOS - routes/users.js

#### GET /users/profile
**¿Para qué?** Obtener datos del usuario autenticado

**Requiere:** JWT token válido

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "phone": "+5491234567890",
    "age": 28,
    "gender": "male",
    "fitnessLevel": "intermediate",
    "goals": ["weight_loss", "muscle_gain"],
    "subscription": {
      "plan": "premium",
      "active": true,
      "endDate": "2026-02-08"
    },
    "createdAt": "2025-12-20T10:00:00Z",
    "lastLogin": "2026-01-08T12:00:00Z"
  }
}
```

#### PUT /users/profile
**¿Para qué?** Actualizar datos del usuario

**Request:**
```json
{
  "name": "Nuevo Nombre",
  "phone": "+549111111111",
  "age": 30,
  "gender": "female",
  "fitnessLevel": "advanced",
  "goals": ["endurance"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Perfil actualizado",
  "user": {...}
}
```

**Proceso:**
```
1. Verificar JWT token
2. Encontrar usuario en BD
3. Actualizar campos permitidos
4. Guardar en BD
5. Retornar usuario actualizado
```

#### POST /users/change-password
**¿Para qué?** Cambiar contraseña

**Request:**
```json
{
  "currentPassword": "contraseña_actual",
  "newPassword": "nueva_contraseña"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Contraseña cambiada exitosamente"
}
```

**Validaciones:**
```
1. ¿La contraseña actual es correcta?
2. ¿La nueva contraseña tiene mín 8 caracteres?
3. Hashear nueva contraseña
4. Guardar en BD
```

---

## 💳 PAGOS - routes/payments.js

#### POST /payments/create-preference
**¿Para qué?** Crear un pago en Mercado Pago

**Request:**
```json
{
  "plan": "premium",
  "period": "monthly"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "preferenceId": "597642781",
  "initPoint": "https://www.mercadopago.com/mla/checkout/start?pref_id=597642781",
  "sandboxUrl": "https://sandbox.mercadopago.com/mla/checkout/start?pref_id=597642781",
  "paymentId": "507f1f77bcf86cd799439011"
}
```

**Flujo:**
```
1. Validar que plan sea válido (basic, premium)
2. Buscar precio según plan y period
3. Calcular monto ($499 básico, $999 premium)
4. Crear preferencia en API Mercado Pago:
   {
     items: [{ title, price, quantity }],
     payer: { email, name },
     back_urls: { success, failure, pending },
     notification_url: "/webhook"
   }
5. Guardar Payment en BD (status: pending)
6. Retornar initPoint (URL de Mercado Pago)
7. Frontend abre URL en navegador
8. Usuario completa pago
```

#### POST /payments/webhook
**¿Para qué?** Recibir notificación de Mercado Pago cuando se completa el pago

**Mercado Pago envía:**
```json
{
  "type": "payment",
  "data": {
    "id": "123456789"
  }
}
```

**Backend procesa:**
```
1. Obtener details del pago de Mercado Pago
2. Buscar Payment en BD con ese ID
3. Verificar status:
   - Si "approved" → Crear suscripción activa
   - Si "declined" → Marcar como rechazado
   - Si "pending" → Esperar más información
4. Actualizar usuario:
   - user.subscription.plan = plan
   - user.subscription.active = true
   - user.subscription.endDate = fecha futura
5. Retornar respuesta a Mercado Pago
```

**Flujo visual:**
```
Mercado Pago detecta pago → 
  Envía webhook a nuestro servidor →
    Backend valida y actualiza BD →
      Usuario obtiene acceso premium
```

#### GET /payments/history
**¿Para qué?** Ver todos los pagos que hizo el usuario

**Response (200 OK):**
```json
{
  "success": true,
  "payments": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "amount": 999,
      "plan": "premium",
      "status": "approved",
      "createdAt": "2026-01-08T10:00:00Z",
      "approvedAt": "2026-01-08T10:05:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "amount": 499,
      "plan": "basic",
      "status": "approved",
      "createdAt": "2025-12-20T10:00:00Z",
      "approvedAt": "2025-12-20T10:05:00Z"
    }
  ]
}
```

---

## 📋 SUSCRIPCIONES - routes/subscriptions.js

#### GET /subscriptions/current
**¿Para qué?** Obtener suscripción actual del usuario

**Response (200 OK):**
```json
{
  "success": true,
  "subscription": {
    "_id": "507f1f77bcf86cd799439011",
    "plan": "premium",
    "period": "monthly",
    "status": "active",
    "startDate": "2026-01-08T10:00:00Z",
    "endDate": "2026-02-08T10:00:00Z",
    "nextBillingDate": "2026-02-08T10:00:00Z",
    "amount": 999,
    "autoRenew": true
  }
}
```

**Si no tiene suscripción:**
```json
{
  "success": true,
  "subscription": null,
  "message": "Usuario sin suscripción"
}
```

#### POST /subscriptions/change-plan
**¿Para qué?** Cambiar de plan (ej: de Basic a Premium)

**Request:**
```json
{
  "newPlan": "premium"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Plan cambiado exitosamente",
  "subscription": {
    "plan": "premium",
    "...": "..."
  }
}
```

**Validaciones:**
```
1. ¿Usuario tiene suscripción activa?
2. ¿El nuevo plan es diferente?
3. Actualizar plan en BD
4. Si es upgrade (basic→premium): cobrar diferencia
5. Si es downgrade (premium→basic): acreditar diferencia
6. Notificar a usuario
```

#### POST /subscriptions/cancel
**¿Para qué?** Cancelar la suscripción

**Request:**
```json
{
  "reason": "No tengo tiempo" // Opcional
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Suscripción cancelada",
  "subscription": {
    "status": "cancelled",
    "cancelledAt": "2026-01-08T12:00:00Z"
  }
}
```

**Proceso:**
```
1. Encontrar suscripción del usuario
2. Verificar que está activa
3. Marcar como cancelled
4. Guardar motivo de cancelación
5. Actualizar usuario:
   - user.subscription.active = false
6. Retornar confirmación
```

#### POST /subscriptions/renew
**¿Para qué?** Renovar suscripción que está por vencer

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Suscripción renovada",
  "subscription": {
    "endDate": "2026-03-08T10:00:00Z",
    "nextBillingDate": "2026-03-08T10:00:00Z",
    "status": "active"
  }
}
```

---

## 📦 MODELOS DE DATOS (MongoDB)

### User Schema

```javascript
{
  _id: ObjectId,

  // Datos básicos
  email: String (unique),
  name: String,
  avatar: String,

  // Autenticación
  password: String (hasheada),
  googleId: String,
  appleId: String,
  provider: String,

  // Verificación
  emailVerified: Boolean,

  // Perfil
  phone: String,
  age: Number,
  gender: String,
  fitnessLevel: String,
  goals: [String],

  // Suscripción
  subscription: {
    plan: String,
    active: Boolean,
    startDate: Date,
    endDate: Date
  },

  // Fechas
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  active: Boolean
}
```

**Ejemplo en BD:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "juan@example.com",
  "name": "Juan Pérez",
  "password": "$2b$10$R9h7cIPz0gi...",  ← Hasheada
  "age": 28,
  "fitnessLevel": "intermediate",
  "goals": ["weight_loss", "muscle_gain"],
  "subscription": {
    "plan": "premium",
    "active": true,
    "endDate": "2026-02-08T10:00:00Z"
  },
  "createdAt": "2025-12-20T10:00:00Z"
}
```

### Payment Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,     // Referencia a User
  amount: Number,
  status: String,       // pending, approved, declined
  plan: String,         // basic, premium
  subscriptionPeriod: String,  // monthly, annual
  mercadoPagoPaymentId: String,
  createdAt: Date,
  approvedAt: Date
}
```

### Subscription Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  plan: String,
  period: String,       // monthly, annual
  status: String,       // active, expired, cancelled
  startDate: Date,
  endDate: Date,
  nextBillingDate: Date,
  autoRenew: Boolean,
  createdAt: Date
}
```

---

## 🔐 MIDDLEWARE DE AUTENTICACIÓN

### Qué hace

```javascript
// middleware/auth.js
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Obtener token del header
    const token = req.headers.authorization?.split(' ')[1];
    // "Bearer eyJhbGciOiJIUzI1NiIs..." → eyJhbGciOiJIUzI1NiIs...

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // 2. Verificar que sea válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Retorna: { id, email, iat, exp }

    // 3. Buscar usuario en BD
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // 4. Adjuntar usuario al request
    req.user = user;  // Ahora en la ruta tenemos req.user

    // 5. Continuar a la ruta
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};
```

### Uso en rutas protegidas

```javascript
// Esta ruta requiere autenticación
router.get('/profile', authMiddleware, async (req, res) => {
  // En este punto:
  // req.user contiene { _id, email, name, ... }

  res.json({
    success: true,
    user: req.user.toJSON()
  });
});
```

---

## 🔍 ERRORES COMUNES

### 401 Unauthorized
```
Causa: Token inválido o expirado
Solución: Renovar token con /auth/refresh
```

### 400 Bad Request
```
Causa: Datos inválidos en request
Solución: Verificar email formato, password length, etc.
```

### 500 Internal Server Error
```
Causa: Error en servidor
Solución: Ver logs de terminal
```

---

**Próxima sección:** DOCUMENTACION_05_INSTALACION.md (en Frontend)
