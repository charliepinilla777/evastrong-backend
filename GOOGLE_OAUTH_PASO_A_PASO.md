# 🔐 Obtener Google OAuth Credentials - Paso a Paso (15 minutos)

## 🎯 Objetivo

Obtener estas 2 credenciales de Google:

```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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o5p6
```

---

## ⏱️ Tiempo Estimado

- **PARTE 1 (Crear Proyecto):** 5 minutos
- **PARTE 2 (Habilitar API):** 3 minutos
- **PARTE 3 (Crear OAuth Client):** 5 minutos
- **TOTAL:** 13 minutos

---

## PARTE 1️⃣: CREAR PROYECTO EN GOOGLE CLOUD

### PASO 1: Ve a Google Cloud Console

**URL:** https://console.cloud.google.com

**¿Qué ves?**

Una página con un logo de Google y opciones para ingresar

```
┌─ GOOGLE CLOUD CONSOLE ───────────────────┐
│                                          │
│  🔵 Google Cloud                        │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ Inicia sesión con Google         │   │
│  │                                  │   │
│  │ Email: [_________________]       │   │
│  │                                  │   │
│  │ [Siguiente]                      │   │
│  └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

### PASO 2: Inicia Sesión

**¿Qué haces?**

1. Haz clic en el campo de email
2. Escribe tu email de Google (ej: tumail@gmail.com)
3. Haz clic en "Siguiente"
4. Escribe tu contraseña
5. Haz clic en "Siguiente" nuevamente

**✅ Resultado:** Estás logueado en Google Cloud Console

---

### PASO 3: Selecciona o Crea Proyecto

Una vez dentro, verás la pantalla principal. En la parte superior izquierda:

```
┌─ PROYECTO ───────────────────────────────┐
│                                          │
│  📁 [Nombre Proyecto]  ▼                │
│                                          │
│  ← Si haces clic aquí...                │
│                                          │
└──────────────────────────────────────────┘
```

Haz clic en el **selector de proyecto** (donde dice el nombre)

```
┌─ SELECTOR DE PROYECTO ───────────────────┐
│                                          │
│  Mis Proyectos                           │
│                                          │
│  [Buscar proyectos...]                   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ + CREAR NUEVO PROYECTO           │   │
│  └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

Haz clic en **"+ CREAR NUEVO PROYECTO"** (o "+ NEW PROJECT")

---

### PASO 4: Llena el Formulario

**¿Qué ves?**

Un formulario con campos:

```
┌─ CREAR PROYECTO ─────────────────────────┐
│                                          │
│  Nombre del Proyecto                     │
│  [________________________]              │
│                                          │
│  ID del Proyecto (auto-generado)        │
│  [________________________]              │
│                                          │
│  Ubicación                               │
│  [Selecciona una organización]           │
│                                          │
│  [CREAR]                                 │
│                                          │
└──────────────────────────────────────────┘
```

**¿Qué escribes?**

En el campo "Nombre del Proyecto":
```
EvaStrong
```

**¿Qué haces con el resto?**

Los otros campos se completan automáticamente. Solo haz clic en **"CREAR"**

```
┌─ RESULTADO ──────────────────────────────┐
│                                          │
│  Nombre: EvaStrong                       │
│  ID: evastrong-xxxxx                     │
│  Ubicación: No organization (predeterminado) │
│                                          │
│  [CREAR] ← HAZ CLIC                      │
│                                          │
└──────────────────────────────────────────┘
```

**⏳ Espera:** Google crea el proyecto (2-3 minutos)

```
⏳ Creando proyecto EvaStrong...
████████████░░░░░░░░░░░░░░░░░░░░░ 40%

Espera...
```

**✅ Resultado:** Proyecto creado

---

## PARTE 2️⃣: HABILITAR GOOGLE+ API

### PASO 5: Ve a la Biblioteca de APIs

Una vez que el proyecto está creado, en el panel lateral izquierdo:

```
┌─ MENÚ LATERAL ───────────────────────────┐
│                                          │
│  📌 Dashboard                            │
│  🔍 APIs & Services                     │
│     ├─ Library ← AQUÍ                    │
│     ├─ Credentials                       │
│     └─ OAuth consent screen              │
│  ☰ Más opciones...                      │
│                                          │
└──────────────────────────────────────────┘
```

Haz clic en **"APIs & Services"** → **"Library"**

O usa directamente: https://console.cloud.google.com/apis/library

**✅ Resultado:** Estás en la Biblioteca de APIs

---

### PASO 6: Busca Google+ API

**¿Qué ves?**

Un buscador con muchas APIs listadas:

```
┌─ BIBLIOTECA DE APIS ─────────────────────┐
│                                          │
│  Buscar APIs...                          │
│  [_____________________]                 │
│                                          │
│  APIs populares:                         │
│  • Google Drive API                      │
│  • Google Sheets API                     │
│  • ... muchas más ...                    │
│                                          │
└──────────────────────────────────────────┘
```

**¿Qué haces?**

1. Haz clic en el buscador
2. Escribe: `Google+`
3. Presiona Enter

```
┌─ BÚSQUEDA ───────────────────────────────┐
│                                          │
│  Buscar APIs...                          │
│  [Google+________________]               │
│                                          │
│  Resultados:                             │
│  • Google+ API ← PRIMERA OPCIÓN          │
│                                          │
└──────────────────────────────────────────┘
```

---

### PASO 7: Haz Clic en Google+ API

Haz clic en **"Google+ API"** (debería ser la primera en los resultados)

```
┌─ GOOGLE+ API ────────────────────────────┐
│                                          │
│  Google+ API                             │
│                                          │
│  Descripción...                          │
│                                          │
│  [ENABLE] ← IMPORTANTE                   │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Ves la página de Google+ API

---

### PASO 8: Haz Clic en ENABLE

Busca el botón azul que dice **"ENABLE"** o **"HABILITAR"**

Haz clic en él.

```
┌─ HABILITANDO ────────────────────────────┐
│                                          │
│  ⏳ Google+ API se está habilitando...  │
│                                          │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                          │
│  Espera unos momentos...                 │
│                                          │
└──────────────────────────────────────────┘
```

⏳ **Espera 1-2 minutos**

**✅ Resultado:** Google+ API está habilitada

Verás un mensaje como: "Google+ API is now enabled"

---

## PARTE 3️⃣: CREAR OAUTH CLIENT

### PASO 9: Ve a Credenciales

En el menú lateral, ve a:

```
🔍 APIs & Services
  ├─ Library
  ├─ Credentials ← AQUÍ
  └─ OAuth consent screen
```

Haz clic en **"Credentials"**

O usa: https://console.cloud.google.com/apis/credentials

**✅ Resultado:** Estás en la página de Credenciales

---

### PASO 10: Configura OAuth Consent Screen (Primero)

**IMPORTANTE:** Antes de crear credenciales, debes configurar la pantalla de consentimiento.

Verás un mensaje: **"To use OAuth 2.0, you need to configure your OAuth consent screen"**

O verás un botón que dice: **"CONFIGURE CONSENT SCREEN"** o **"OAuth consent screen"**

Haz clic en él.

```
┌─ OAUTH CONSENT SCREEN ───────────────────┐
│                                          │
│  Configurar pantalla de consentimiento   │
│                                          │
│  [CONFIGURE CONSENT SCREEN]              │
│                                          │
└──────────────────────────────────────────┘
```

---

### PASO 11: Elige Tipo de Usuario

Verás 2 opciones:

```
┌─ ELEGIR TIPO ────────────────────────────┐
│                                          │
│  ¿Qué tipo de usuario?                   │
│                                          │
│  (●) External  ← SELECCIONA ESTA        │
│  ( ) Internal                            │
│                                          │
│  [CREATE]                                │
│                                          │
└──────────────────────────────────────────┘
```

Selecciona: **"External"**

Haz clic en: **"CREATE"**

**✅ Resultado:** Se abre el formulario

---

### PASO 12: Llena el Formulario Básico

Verás un formulario largo. Completa estos campos:

```
┌─ FORMULARIO ─────────────────────────────┐
│                                          │
│ App name *                               │
│ [EvaStrong_________________]             │
│                                          │
│ User support email *                     │
│ [tu_email@gmail.com________]            │
│                                          │
│ Authorized domains                       │
│ [render.com_________________]           │
│                                          │
│ Developer contact information *          │
│ Email addresses:                         │
│ [tu_email@gmail.com________]            │
│                                          │
└──────────────────────────────────────────┘
```

**¿Qué pones?**

1. **App name:** `EvaStrong`
2. **User support email:** Tu email (ej: `charliepinilla29@gmail.com`)
3. **Authorized domains:** `render.com`
4. **Developer contact:** Tu email

**✅ Resultado:** Formulario básico completado

---

---

## PARTE 3️⃣ (CONTINUACIÓN): CONFIGURAR SCOPES

### PASO 13: Agrega Scopes

Después de completar el formulario básico, verás una sección de **"Scopes"**

```
┌─ SCOPES ─────────────────────────────────┐
│                                          │
│ Agregar o eliminar scopes                │
│                                          │
│ [+ ADD SCOPES]                           │
│                                          │
└──────────────────────────────────────────┘
```

Haz clic en **"+ ADD SCOPES"**

Verás una lista de scopes disponibles. Selecciona:

```
✅ email
✅ openid
✅ profile
```

**¿Cómo los seleccionas?**

1. Busca cada uno en la lista
2. Marca el checkbox
3. Haz clic en "UPDATE"

**✅ Resultado:** Scopes agregados

---

### PASO 14: Guarda y Continúa

Haz clic en **"SAVE AND CONTINUE"** varias veces hasta terminar

```
┌─ GUARDAR ────────────────────────────────┐
│                                          │
│  [SAVE AND CONTINUE]                     │
│                                          │
│  (Puede haber varias pantallas)          │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** OAuth Consent Screen configurado

---

## PARTE 4️⃣: CREAR OAUTH 2.0 CLIENT

### PASO 15: Ve de Vuelta a Credentials

En el menú lateral:

```
🔍 APIs & Services
  ├─ Library
  ├─ Credentials ← AQUÍ
  └─ OAuth consent screen
```

Haz clic en **"Credentials"** nuevamente

**✅ Resultado:** Estás de vuelta en Credentials

---

### PASO 16: Crea Credenciales

Verás un botón azul en la parte superior:

```
┌─ CREAR CREDENCIALES ─────────────────────┐
│                                          │
│  [+ CREATE CREDENTIALS]                  │
│                                          │
└──────────────────────────────────────────┘
```

O un dropdown con opciones:

```
┌─ DROPDOWN ───────────────────────────────┐
│                                          │
│  + Create Credentials ▼                  │
│                                          │
│  ├─ API Key                              │
│  ├─ OAuth client ID ← AQUÍ               │
│  └─ Service Account                      │
│                                          │
└──────────────────────────────────────────┘
```

Selecciona: **"OAuth client ID"**

---

### PASO 17: Elige Tipo de Aplicación

Verás una pantalla preguntando qué tipo de aplicación:

```
┌─ TIPO DE APLICACIÓN ─────────────────────┐
│                                          │
│ ¿Qué tipo de aplicación?                 │
│                                          │
│ ( ) Web application ← SELECCIONA ESTA   │
│ ( ) Desktop app                          │
│ ( ) Mobile app                           │
│ ( ) TV and limited input device          │
│                                          │
│ [CREATE]                                 │
│                                          │
└──────────────────────────────────────────┘
```

Selecciona: **"Web application"**

Haz clic en: **"CREATE"** (o "Next")

---

### PASO 18: Configura URIs

Ahora verás un formulario para configu URLs:

```
┌─ CONFIGURAR URLS ────────────────────────┐
│                                          │
│ Name *                                   │
│ [EvaStrong Backend____________]          │
│                                          │
│ Authorized JavaScript origins            │
│ [+ ADD URI]                              │
│                                          │
│ Authorized redirect URIs                 │
│ [+ ADD URI]                              │
│                                          │
│ [CREATE]  [CANCEL]                       │
│                                          │
└──────────────────────────────────────────┘
```

**¿Qué haces?**

1. En "Name", escribe: `EvaStrong Backend`

2. En "Authorized JavaScript origins", haz clic en [+ ADD URI] y agrega:
   ```
   http://localhost:5000
   https://evastrong-backend.onrender.com
   ```

3. En "Authorized redirect URIs", haz clic en [+ ADD URI] y agrega:
   ```
   http://localhost:5000/auth/google/callback
   https://evastrong-backend.onrender.com/auth/google/callback
   ```

**Así debería verse:**

```
┌─ RESULTADO ──────────────────────────────┐
│                                          │
│ Name:                                    │
│ EvaStrong Backend                        │
│                                          │
│ Authorized JavaScript origins:           │
│ • http://localhost:5000                  │
│ • https://evastrong-backend.onrender.com │
│                                          │
│ Authorized redirect URIs:                │
│ • http://localhost:5000/auth/google/...  │
│ • https://evastrong-backend.onrender.com/... │
│                                          │
└──────────────────────────────────────────┘
```

---

### PASO 19: Crea el Client

Haz clic en: **"CREATE"**

**⏳ Espera:** Google crea el OAuth Client (2-3 segundos)

```
┌─ CREANDO ────────────────────────────────┐
│                                          │
│  ⏳ Creando OAuth 2.0 Client...         │
│                                          │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Se abre un popup con tus credenciales

---

## PARTE 5️⃣: OBTENER TUS CREDENCIALES

### PASO 20: Copia tu Client ID

Verás un popup como este:

```
┌─ TUS CREDENCIALES ───────────────────────┐
│                                          │
│  OAuth client created                    │
│                                          │
│  Client ID *                             │
│  123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com │
│                                          │
│  Client Secret *                         │
│  GOCSPX-a1b2c3d4e5f6g7h8i9j0k1l2m3     │
│                                          │
│  [Copy]  [Download]                      │
│                                          │
└──────────────────────────────────────────┘
```

Haz clic en el **Client ID** para seleccionarlo

Presiona: `Ctrl + C` (o `Cmd + C` en Mac)

O haz clic en **[Copy]**

---

### PASO 21: Guarda el Client ID

1. Abre bloc de notas
2. Pega tu Client ID
3. Etiquétalo:

```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

**✅ Resultado:** Client ID guardado

---

### PASO 22: Copia tu Client Secret

De la misma ventana, haz clic en el **Client Secret**

Presiona: `Ctrl + C` (o `Cmd + C` en Mac)

O haz clic en **[Copy]**

---

### PASO 23: Guarda el Client Secret

En el mismo bloc de notas, agrega:

```
GOOGLE_CLIENT_SECRET=GOCSPX-a1b2c3d4e5f6g7h8i9j0k1l2m3
```

**Tu bloc de notas debería verse así:**

```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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o5p6
GOOGLE_CALLBACK_URL=https://evastrong-backend.onrender.com/auth/google/callback
```

**✅ Resultado:** Ambas credenciales guardadas

---

## PARTE 6️⃣: CONFIGURAR EN RENDER

### PASO 24: Ve a Render

1. Abre: https://render.com/dashboard
2. Selecciona: `evastrong-backend`
3. Ve a: **"Settings"** → **"Environment Variables"**

---

### PASO 25: Agrega GOOGLE_CLIENT_ID

1. Busca o crea: `GOOGLE_CLIENT_ID`
2. Pega tu Client ID completo
3. Haz clic en **"Save"**

```
Name:  GOOGLE_CLIENT_ID
Value: 123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

---

### PASO 26: Agrega GOOGLE_CLIENT_SECRET

1. Busca o crea: `GOOGLE_CLIENT_SECRET`
2. Pega tu Client Secret completo
3. Haz clic en **"Save"**

```
Name:  GOOGLE_CLIENT_SECRET
Value: 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o5p6
```

---

### PASO 27: Agrega GOOGLE_CALLBACK_URL

1. Busca o crea: `GOOGLE_CALLBACK_URL`
2. Pega:
   ```
   https://evastrong-backend.onrender.com/auth/google/callback
   ```
3. Haz clic en **"Save"**

---

### PASO 28: Redeploy

En Render:

1. Ve a: **"Deployments"**
2. Haz clic en: **"Trigger Deploy"** o **"Redeploy"**
3. Espera 3-5 minutos

```
⏳ Desplegando...
████████████░░░░░░░░░░░░░░░░░░░░░░░░░░ 40%
```

**✅ Resultado:** Backend redesplegado con Google OAuth

---

## ✅ VERIFICACIÓN

### PASO 29: Verifica en Logs

1. Ve a: **"Logs"**
2. Busca líneas como:

```
✅ Passport Google Strategy configurado
✅ Google OAuth ready
✅ Autenticación lista
```

Si ves estos mensajes: **¡ÉXITO!** ✅

---

## ✅ CHECKLIST

- [ ] Creaste proyecto "EvaStrong" en Google Cloud
- [ ] Habilitaste Google+ API
- [ ] Configuraste OAuth Consent Screen
- [ ] Seleccionaste "External" como tipo de usuario
- [ ] Llenaste formulario básico
- [ ] Agregaste scopes (email, openid, profile)
- [ ] Guardaste OAuth Consent Screen
- [ ] Creaste OAuth 2.0 Client (Web application)
- [ ] Agregaste URIs de JavaScript (localhost y Render)
- [ ] Agregaste URIs de redirección (callbacks)
- [ ] Obtuviste Client ID
- [ ] Obtuviste Client Secret
- [ ] Guardaste ambos en bloc de notas
- [ ] Agregaste en Render: GOOGLE_CLIENT_ID
- [ ] Agregaste en Render: GOOGLE_CLIENT_SECRET
- [ ] Agregaste en Render: GOOGLE_CALLBACK_URL
- [ ] Hiciste Redeploy
- [ ] Verificaste en logs

---

## 🆘 ERRORES COMUNES

### Error: "Redirect URI mismatch"

```
Causa: La URL callback no coincide
Solución:
1. Ve a Google Cloud → Credentials
2. Edita tu OAuth Client
3. Verifica que los callbacks sean exactos:
   http://localhost:5000/auth/google/callback
   https://evastrong-backend.onrender.com/auth/google/callback
```

### Error: "OAuth Consent Screen not configured"

```
Causa: No configuraste la pantalla de consentimiento
Solución:
1. Ve a APIs & Services → OAuth consent screen
2. Configura como "External"
3. Completa todos los campos requeridos
4. Guarda
```

### Error: "Client ID not found"

```
Causa: Client ID no está en Render
Solución:
1. Ve a Render → Environment Variables
2. Verifica que GOOGLE_CLIENT_ID esté presente
3. Redeploy
```

---

## 🎉 ¡LISTO!

Ya tienes Google OAuth configurado.

**Tu backend ahora puede autenticar usuarios con Google!**

Próximo paso: ¿Mercado Pago o verificar que todo funciona?
