# 🔐 Google OAuth 2.0 - Configuración Completa

## 📋 Tabla de Contenidos

1. [Crear Proyecto en Google Cloud](#crear-proyecto-en-google-cloud)
2. [Habilitar Google+ API](#habilitar-google-api)
3. [Crear Credenciales OAuth](#crear-credenciales-oauth)
4. [Obtener Client ID y Secret](#obtener-client-id-y-secret)
5. [Configurar URIs de Redirección](#configurar-uris-de-redirección)
6. [Verificar en Desarrollo](#verificar-en-desarrollo)

---

## 1️⃣ Crear Proyecto en Google Cloud

### Paso 1: Ir a Google Cloud Console

1. Abre: https://console.cloud.google.com
2. Si no tienes cuenta Google, crea una en: https://accounts.google.com
3. Inicia sesión

### Paso 2: Crear Proyecto

En la barra superior izquierda:

1. Haz clic en el **selector de proyecto** (dropdown)
2. Haz clic en **"NEW PROJECT"**

### Paso 3: Llenar Formulario

```
Project name: EvaStrong
Location: No organization (o tu organización)
```

### Paso 4: Crear Proyecto

Haz clic en **"CREATE"**

**Espera 1-2 minutos...**

```
⏳ Creando proyecto EvaStrong...
████████████░░░░░░░░░░░░░░░ 60%
```

**Resultado esperado:**

```
✅ Proyecto "EvaStrong" creado
   Project ID: evastrong-xxxxx
```

---

## 2️⃣ Habilitar Google+ API

### Paso 1: Ir a la Biblioteca de APIs

1. En el dashboard, ve a **"APIs & Services"** → **"Library"**
2. O usa este enlace: https://console.cloud.google.com/apis/library

### Paso 2: Buscar Google+ API

```
Buscador: "Google+"
```

### Paso 3: Seleccionar Google+ API

1. Haz clic en **"Google+ API"** (la primera opción)
2. Haz clic en **"ENABLE"**

**Espera mientras se habilita la API...**

```
⏳ Habilitando Google+ API...
```

**Resultado esperado:**

```
✅ Google+ API habilitada
   Status: Enabled
```

---

## 3️⃣ Crear Credenciales OAuth

### Paso 1: Ir a Credenciales

1. Ve a **"APIs & Services"** → **"Credentials"**
2. O usa: https://console.cloud.google.com/apis/credentials

### Paso 2: Crear Pantalla de Consentimiento

Verás un mensaje: **"CREATE CREDENTIALS"**

Antes de crear credenciales, necesitas **OAuth Consent Screen**:

1. Haz clic en **"CONFIGURE CONSENT SCREEN"** o **"OAuth consent screen"**

### Paso 3: Elegir Tipo de Usuario

```
Opciones:
• External (recomendado para desarrollo)
• Internal (solo si usas Google Workspace)
```

**SELECCIONA: External** ✅

Haz clic en **"CREATE"**

### Paso 4: Llenar Formulario de Consentimiento

**Información requerida:**

```
App name: EvaStrong
User support email: tu_email@gmail.com
Developer contact information:
  Email: tu_email@gmail.com
```

### Paso 5: Agregar Scopes

En **"Scopes"**, agrega estos permisos:

```
Predefined scopes:
✅ email
✅ openid
✅ profile
```

### Paso 6: Agregar Usuarios de Prueba (Opcional)

Para desarrollo:

```
Email de prueba: tu_email@gmail.com
```

### Paso 7: Guardar y Continuar

Haz clic en **"SAVE AND CONTINUE"** hasta terminar

**Resultado esperado:**

```
✅ OAuth Consent Screen configurado
```

---

## 4️⃣ Crear Credenciales OAuth

### Paso 1: Crear OAuth 2.0 Client

1. Ve a **"Credentials"** nuevamente
2. Haz clic en **"+ CREATE CREDENTIALS"**
3. Selecciona **"OAuth client ID"**

### Paso 2: Elegir Tipo de Aplicación

```
Opciones:
• Web application (RECOMENDADO)
• Desktop app
• Mobile app
• TV and limited input device
```

**SELECCIONA: Web application** ✅

### Paso 3: Configurar URI Autorizado

En **"Authorized JavaScript origins"**, agrega:

```
Para desarrollo local:
http://localhost:5000

Para producción (Render):
https://evastrong-backend.onrender.com
```

Haz clic en **"+ ADD URI"** para agregar ambos

### Paso 4: Configurar URI de Redirección

En **"Authorized redirect URIs"**, agrega:

```
Para desarrollo local:
http://localhost:5000/auth/google/callback

Para producción (Render):
https://evastrong-backend.onrender.com/auth/google/callback
```

### Paso 5: Crear

Haz clic en **"CREATE"**

**Resultado esperado:**

```
✅ OAuth 2.0 Client creado
```

---

## 5️⃣ Obtener Client ID y Secret

### Paso 1: Ver Credenciales

Después de crear, verás un popup con:

```
┌─────────────────────────────────┐
│ Client ID                       │
│ xxxxx.apps.googleusercontent.com│
│                                 │
│ Client Secret                   │
│ GOCSPX-xxxxxxxxxxxxxxxxxxxxx    │
└─────────────────────────────────┘
```

### Paso 2: Copiar Credenciales

**IMPORTANTE:** Copia y guarda en un lugar seguro:

```
CLIENT ID: xxxxx.apps.googleusercontent.com
CLIENT SECRET: GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

### Paso 3: Descargar JSON (Opcional)

También puedes descargar el archivo JSON:

1. En la página de credenciales, haz clic en tu client ID
2. Haz clic en **"DOWNLOAD JSON"**
3. Guarda el archivo en lugar seguro

---

## 6️⃣ Configurar en Backend

### Paso 1: Actualizar .env.local

```bash
# En evastrong-backend/.env.local

GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

### Paso 2: Instalar Dependencias (Si No Están)

```bash
npm install passport passport-google-oauth20
```

### Paso 3: Verificar Passport Config

Verifica que `config/passport.js` tiene:

```javascript
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  // ... resto de configuración
));
```

### Paso 4: Iniciar Backend

```bash
npm run dev
```

**Resultado esperado:**

```
✅ Passport Google Strategy configurado
   URL callback: http://localhost:5000/auth/google/callback
```

---

## 🧪 Verificar en Desarrollo

### Paso 1: Iniciar Backend

```bash
npm run dev
```

### Paso 2: Probar Login

```bash
# En otra terminal
curl http://localhost:5000/auth/google
```

### Paso 3: Abrir en Navegador

1. Abre: http://localhost:5000/auth/google
2. Deberías ser redirigido a Google Login
3. Selecciona tu cuenta
4. Autoriza la aplicación
5. Deberías ser redirigido a tu app

**Resultado esperado:**

```
✅ Login con Google funciona
   Token JWT generado
   Usuario creado/actualizado
```

---

## 🚀 Configurar para Producción (Render)

### Paso 1: Agregar URI a Google Cloud

En Google Cloud Console:

1. Ve a **Credentials**
2. Edita tu OAuth 2.0 Client
3. Agrega en **Authorized JavaScript origins**:
   ```
   https://evastrong-backend.onrender.com
   ```
4. Agrega en **Authorized redirect URIs**:
   ```
   https://evastrong-backend.onrender.com/auth/google/callback
   ```
5. Haz clic en **SAVE**

### Paso 2: Configurar en Render

En tu proyecto de Render:

1. Ve a **Settings** → **Environment Variables**
2. Agrega:
   ```
   GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
   GOOGLE_CALLBACK_URL=https://evastrong-backend.onrender.com/auth/google/callback
   ```

### Paso 3: Redeploy

En Render:

1. Ve a **Deployments**
2. Haz clic en **"Deploy"** o **"Redeploy"**
3. Espera a que se complete

**Resultado esperado:**

```
✅ Google OAuth funciona en producción
```

---

## 📱 Configurar en Frontend

### React/Next.js

```javascript
// Botón de login
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:5000/auth/google';
  // O en producción:
  // window.location.href = 'https://evastrong-backend.onrender.com/auth/google';
};

// En tu componente
<button onClick={handleGoogleLogin}>
  Inicia sesión con Google
</button>
```

### Flutter/Mobile

```dart
// Usar webview o deep linking
Uri url = Uri.parse('http://localhost:5000/auth/google');
if (await canLaunchUrl(url)) {
  await launchUrl(url);
} else {
  throw 'No se puede abrir $url';
}
```

---

## 🔒 Mejores Prácticas de Seguridad

### ✅ HACER:

1. ✅ Guardar CLIENT_SECRET de forma segura
2. ✅ Usar HTTPS en producción
3. ✅ Especificar URIs correctas
4. ✅ Renovar tokens regularmente
5. ✅ Validar tokens en backend
6. ✅ Usar variables de entorno

### ❌ NO HACER:

1. ❌ Exponer CLIENT_SECRET en frontend
2. ❌ Commitar credenciales en Git
3. ❌ Usar credenciales de producción en desarrollo
4. ❌ Hardcodear URIs
5. ❌ Confiar solo en token del cliente

---

## 🆘 Solución de Problemas

### Error: "Invalid client"

```
Causa: Client ID o Secret incorrecto
Solución:
1. Verifica que CLIENT_ID y CLIENT_SECRET sean correctos
2. Copia nuevamente desde Google Cloud Console
3. Reinicia el servidor
```

### Error: "Redirect URI mismatch"

```
Causa: URI en .env no coincide con Google Cloud
Solución:
1. Ve a Google Cloud → Credentials
2. Verifica que el callback URL es correcto:
   http://localhost:5000/auth/google/callback
3. En .env.local, asegúrate de tener:
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

### Error: "Access Denied"

```
Causa: Scopes faltantes o permisos denegados
Solución:
1. En Google Cloud → OAuth Consent Screen
2. Verifica que estos scopes estén habilitados:
   • email
   • openid
   • profile
3. Limpia caché del navegador
4. Intenta con otra cuenta
```

### Error: "API_NOT_ENABLED"

```
Causa: Google+ API no está habilitada
Solución:
1. Ve a Google Cloud → APIs & Services → Library
2. Busca "Google+ API"
3. Haz clic en "ENABLE"
4. Espera 1-2 minutos
```

---

## 📋 Checklist de Configuración

- [ ] Proyecto "EvaStrong" creado en Google Cloud
- [ ] Google+ API habilitada
- [ ] OAuth Consent Screen configurado
- [ ] OAuth 2.0 Client creado (Web application)
- [ ] URI local agregado (http://localhost:5000)
- [ ] URI de producción agregado (https://evastrong-backend.onrender.com)
- [ ] Callback URL local agregado
- [ ] Callback URL de producción agregado
- [ ] Client ID copiado
- [ ] Client Secret copiado
- [ ] .env.local configurado
- [ ] Backend prueba localmente
- [ ] Variables de entorno en Render configuradas
- [ ] Backend funciona en producción

---

## 📚 Recursos Adicionales

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com)
- [Passport Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)

---

## ✅ Pasos Siguientes

Una vez que Google OAuth esté configurado:

1. ✅ MongoDB: **COMPLETADO**
2. ✅ Google OAuth: **COMPLETADO** (estás aquí)
3. ⏭️ Mercado Pago (Opcional): Ir a `MERCADO_PAGO_SETUP.md`
4. ⏭️ Desplegar en Render: Ir a `RENDER_DEPLOYMENT.md`
5. ⏭️ Testing: Verificar endpoints

---

**¡Google OAuth configurado correctamente! 🎉**

Ahora puedes continuar con Mercado Pago (opcional) o desplegar en Render.

¿Necesitas ayuda con el siguiente paso?
