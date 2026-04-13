# EvaStrong Backend — API REST

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)
[![JWT](https://img.shields.io/badge/Auth-JWT-yellow)]()
[![Render](https://img.shields.io/badge/Deploy-Render.com-purple)]()
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

**API REST para EvaStrong — app de fitness femenino con rutinas personalizadas, planes de dieta, pagos y chat.**

[Endpoints](#endpoints) • [Modelos](#modelos-de-datos) • [Instalación](#instalación) • [Variables de entorno](#variables-de-entorno) • [Deploy](#despliegue)

</div>

---

## Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Base de datos:** MongoDB (Mongoose)
- **Autenticación:** JWT + bcrypt
- **Pagos:** MercadoPago SDK + PayPal
- **Notificaciones:** Twilio (WhatsApp)
- **Seguridad:** Helmet, express-rate-limit, express-validator, CORS
- **Tareas programadas:** node-cron (recordatorios de suscripción)
- **Desplegado en:** Render.com (free tier — cold start ~30s)

---

## Estructura del proyecto

```
EvaStrong-Backend/
├── server.js                    # Entry point, middleware global, rutas
├── config/
│   └── passport.js              # Estrategias OAuth Google/Apple
├── models/
│   ├── User.js                  # Usuario (phone, subscription, role)
│   ├── Routine.js               # Rutina (fases, ejercicios, titleEn/descriptionEn)
│   ├── Exercise.js              # Ejercicio individual
│   ├── Recipe.js                # Receta con ingredientes y macros
│   ├── Plan.js                  # Plan de nutrición
│   ├── Subscription.js          # Suscripción activa (reminderSent5d)
│   ├── Payment.js               # Pago (MercadoPago / PayPal)
│   ├── Feedback.js              # Feedback (rating, category, message)
│   ├── WorkoutHistory.js        # Historial de entrenamientos completados
│   ├── ChatRoom.js              # Sala de chat
│   ├── Message.js               # Mensajes de chat
│   ├── Video.js                 # Video (cloudUrl o filepath)
│   ├── RoutineTemplate.js       # Plantilla de rutina (adjustmentRules: Mixed)
│   ├── AccessLog.js             # Log de acceso
│   ├── SecurityLog.js           # Log de seguridad
│   └── Token.js                 # Token de refresco
├── routes/
│   ├── auth.js                  # Registro, login, OAuth, verify, refresh
│   ├── users.js                 # Perfil, contraseña, cuenta
│   ├── routines.js              # CRUD rutinas + lang param + rating atómico
│   ├── exercises.js             # Ejercicios por tipo/zona
│   ├── dietRecommendations.js   # Planes de dieta personalizados
│   ├── recipes.js               # Recetas con filtros
│   ├── plans.js                 # Planes de suscripción disponibles
│   ├── subscriptions.js         # Gestión de suscripción del usuario
│   ├── payments.js              # MercadoPago + PayPal + webhooks
│   ├── chat.js                  # Salas, mensajes, soporte
│   ├── feedback.js              # POST /feedback
│   ├── videos.js                # Videos demostrativos
│   ├── admin.js                 # Stats reales (WorkoutHistory aggregation)
│   ├── adminContent.js          # CRUD contenido por admin
│   ├── adminPanel.js            # Panel web (ruta secreta en .env)
│   ├── trainerContent.js        # Edición de contenido por entrenador
│   ├── trainerPanel.js          # Panel de entrenador
│   ├── routineRecommendations.js # Rutina personalizada por objetivo
│   ├── security.js              # Logs de seguridad
│   ├── secureAuth.js            # Autenticación reforzada
│   └── trial.js                 # Periodo de prueba gratuito
├── middleware/
│   ├── auth.js                  # verifyToken, requireSubscription (null-safe)
│   ├── adminAuth.js             # requireAdmin
│   └── trainerAuth.js           # requireTrainer
├── utils/
│   └── subscriptionReminder.js  # Cron diario 10am — recordatorio WhatsApp
└── scripts/
    ├── seedRoutines.js           # 5 rutinas base
    ├── seed-routines.js          # 7 rutinas atractivas adicionales
    └── translate-routines.js     # Migración: puebla titleEn/descriptionEn en DB
```

---

## Endpoints

### Autenticación (`/auth`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registro (min 8 chars + mayúscula + minúscula + dígito) |
| POST | `/auth/login` | Login — devuelve JWT |
| GET | `/auth/verify` | Verificar token activo |
| POST | `/auth/refresh` | Renovar token |
| GET | `/auth/google` | Login con Google OAuth |
| GET | `/auth/apple` | Login con Apple OAuth |

### Usuarios (`/users`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users/profile` | Perfil autenticado |
| PUT | `/users/profile` | Actualizar perfil |
| POST | `/users/change-password` | Cambiar contraseña |
| DELETE | `/users/account/delete` | Eliminar cuenta |

### Rutinas (`/routines`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/routines?lang=en` | Listado con localización (titleEn si lang=en) |
| GET | `/routines/:id?lang=en` | Detalle de rutina localizado |
| POST | `/routines/:id/rate` | Calificar (rating atómico con $avg pipeline) |
| GET | `/routines/favorites` | Favoritos del usuario |
| POST | `/routines/:id/favorite` | Agregar a favoritos |

#### Localización de rutinas
- `?lang=en` intercambia `title`/`description` por `titleEn`/`descriptionEn`
- Para poblar traducciones en DB existente: `node scripts/translate-routines.js`

#### Niveles de acceso
| Nivel | Plan requerido |
|-------|----------------|
| `free` | Sin suscripción |
| `basic` | Plan Básico ($9.99) |
| `premium` | Plan Premium ($19.99) |
| `exclusive` | Plan Elite ($29.99) |

### Dietas y recetas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/diet-recommendations` | Planes personalizados por objetivo |
| GET | `/recipes` | Listado de recetas |
| GET | `/recipes/:id` | Detalle de receta |

### Suscripciones y pagos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/subscriptions/current` | Suscripción activa del usuario |
| POST | `/subscriptions/change-plan` | Cambiar plan |
| POST | `/subscriptions/cancel` | Cancelar suscripción |
| POST | `/payments/create-preference` | Crear pago MercadoPago |
| POST | `/payments/paypal/create` | Crear pago PayPal |
| POST | `/payments/webhook` | Webhook MercadoPago |
| GET | `/payments/history` | Historial de pagos |

### Chat (`/chat`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/chat/rooms` | Salas del usuario |
| POST | `/chat/rooms` | Crear sala |
| GET | `/chat/rooms/:id/messages` | Mensajes de una sala |
| POST | `/chat/rooms/:id/messages` | Enviar mensaje |

### Otros

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/feedback` | Enviar feedback (token opcional) |
| GET | `/plans` | Planes de suscripción disponibles |
| GET | `/routine-recommendations` | Rutina personalizada por objetivo/nivel |

### Admin (requiere rol admin)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/admin/users/stats` | Estadísticas reales de usuarios |
| GET | `/admin/revenue/stats` | Ingresos del día/mes |
| GET | `/admin/subscriptions/stats` | Suscripciones activas/vencidas |
| POST | `/admin/subscriptions/send-reminder` | Enviar recordatorio WhatsApp |
| PATCH | `/admin-content/routines/:id` | Editar rutina (whitelist incluye titleEn) |

---

## Modelos de datos

### User
```js
{
  email, name, password,  // password hasheado con bcrypt
  role,                   // user | admin | trainer
  phone,                  // Para recordatorios WhatsApp
  googleId, appleId, provider,
  subscription: { plan, active, startDate, endDate },
  fitnessLevel, goals: [String],
  active, lastLogin
}
```

### Routine
```js
{
  title, description,
  titleEn, descriptionEn,    // Localización EN
  accessLevel,               // free | basic | premium | exclusive
  calentamiento: { exercises: [Exercise] },
  principal: { exercises: [Exercise], cycles },
  enfriamiento: { exercises: [Exercise] },
  rating, ratingsCount,
  isActive
}
```

### Exercise (embebido en Routine)
```js
{
  name, nameEn,
  shortDescription, shortDescriptionEn,
  type, zone,
  sets, repetitions, timeSeconds, restSeconds,
  exerciseId, videoUrl
}
```

### WorkoutHistory
```js
{
  userId, routineName,
  durationMinutes, category,
  completedAt
}
```

### Subscription
```js
{
  userId, plan, period, status,
  startDate, endDate, nextBillingDate,
  amount, autoRenew,
  reminderSent5d    // Evita duplicar recordatorio WhatsApp
}
```

---

## Instalación

```bash
# 1. Clonar
git clone https://github.com/charliepinilla777/evastrong-backend.git
cd evastrong-backend

# 2. Dependencias
npm install

# 3. Variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Poblar DB con rutinas iniciales
node scripts/seedRoutines.js
node scripts/seed-routines.js

# 5. Traducir rutinas existentes al inglés (one-shot)
node scripts/translate-routines.js

# 6. Desarrollo (auto-reload)
npm run dev

# 7. Producción
npm start
```

---

## Variables de entorno

```env
# Base de datos
MONGODB_URI=mongodb+srv://...

# Autenticación
JWT_SECRET=tu_secreto_jwt

# MercadoPago
MERCADO_PAGO_ACCESS_TOKEN=...
MERCADO_PAGO_PUBLIC_KEY=...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Twilio (WhatsApp reminders)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# OAuth Google
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://tu-dominio/auth/google/callback

# Panel admin web (ruta secreta)
ADMIN_PANEL_PATH=eva-admin-privado-2025

# Entorno
NODE_ENV=production
PORT=5000
```

> El archivo `.env` está excluido del repositorio via `.gitignore`.

---

## Despliegue

### Render.com (producción actual)

1. Conectar el repo en [render.com](https://render.com)
2. Build command: `npm install`
3. Start command: `npm start`
4. Agregar variables de entorno en el panel de Render
5. El servicio free tier hiberna tras inactividad — cold start ~30-50s

---

## Recordatorios WhatsApp

El cron job `utils/subscriptionReminder.js` corre diariamente a las 10:00 AM y envía recordatorio por WhatsApp a usuarios con suscripción próxima a vencer (5 días). Usa el campo `reminderSent5d` en `Subscription` para evitar duplicados.

---

## Seguridad

- Contraseñas con bcrypt (salt rounds 12)
- JWT con expiración configurable
- Validación de password: mínimo 8 caracteres, mayúscula, minúscula y dígito
- Rate limiting: 100 requests / 15 min por IP
- Helmet para headers HTTP seguros
- CORS configurado
- `requireSubscription` con null-check seguro
- Panel admin en ruta secreta (variable de entorno)
- Logs de seguridad en `SecurityLog`

---

## Agentes de mantenimiento (CCR)

| Agente | Schedule (UTC) | Descripción |
|--------|----------------|-------------|
| Security Auditor | Diario 13:00 (8am Bogotá) | Revisa vulnerabilidades y logs |
| Bug Hunter + Help Checker | 01:00 y 13:00 UTC | Bugs activos; lunes: deps, TODOs, i18n coverage |

Reportes generados: `BUG_REPORT.md`, `HELP_CHECKER_REPORT.md`
Gestión: https://claude.ai/code/scheduled

---

## Licencia

© 2024-2026 Carlos Andres Pinilla. Todos los derechos reservados.

Queda prohibido copiar, modificar o distribuir este código sin autorización escrita del propietario. Ver [LICENSE](LICENSE).

---

<div align="center">

Desarrollado por [Carlos Andres Pinilla](https://github.com/charliepinilla777)

**Frontend:** [evastrong-front](https://github.com/charliepinilla777/evastrong-front)

</div>
