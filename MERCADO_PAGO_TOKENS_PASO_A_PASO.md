# 💳 Obtener Tokens de Mercado Pago - Paso a Paso (10 minutos)

## 🎯 Objetivo

Obtener estas 2 credenciales de Mercado Pago:

```
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-1234567890-abcdefghij-klmnopqrst
MERCADO_PAGO_PUBLIC_KEY=APP_USR-9876543210-zyxwvutsrq-ponmlkjihg
```

---

## ⏱️ Tiempo Estimado

**TOTAL: 10 minutos**

- Crear cuenta: 3 minutos
- Obtener tokens: 5 minutos
- Configurar en Render: 2 minutos

---

## PASO 1️⃣: Ve a Mercado Pago

### ¿Dónde?

Ve a: **https://www.mercadopago.com**

### ¿Qué ves?

La página principal de Mercado Pago

```
┌─ MERCADO PAGO ───────────────────────────┐
│                                          │
│  🔵 Mercado Pago                        │
│                                          │
│  [Inicia sesión] [Crear cuenta]         │
│                                          │
│  Paga con confianza, vende sin límites  │
│                                          │
└──────────────────────────────────────────┘
```

### ¿Qué haces?

Haz clic en **"Inicia sesión"** o **"Crear cuenta"**

---

## PASO 2️⃣: Inicia Sesión o Crea Cuenta

### Si YA tienes cuenta en Mercado Pago:

```
Email: [tu_email@gmail.com]
Contraseña: [tu_contraseña]

[Inicia sesión]
```

### Si NO tienes cuenta:

Haz clic en **"Crear cuenta"** y completa:

```
Email: [tu_email@gmail.com]
Contraseña: [Contraseña fuerte]
Nombre: [Tu nombre]
Apellido: [Tu apellido]
País: [Colombia o tu país]

[Crear cuenta]
```

**⏳ Espera:** Mercado Pago verifica tu email (1-2 minutos)

```
┌─ VERIFICACIÓN ───────────────────────────┐
│                                          │
│  Revisa tu email y confirma             │
│                                          │
│  ⏳ Enviando código de verificación...  │
│                                          │
└──────────────────────────────────────────┘
```

### PASO 3: Verifica tu Email

1. Abre tu bandeja de correo
2. Busca email de Mercado Pago
3. Haz clic en el enlace de verificación
4. Confirma tu cuenta

```
┌─ EMAIL MERCADO PAGO ─────────────────────┐
│                                          │
│  Asunto: Confirma tu email               │
│                                          │
│  [VERIFICAR CORREO ELECTRÓNICO]          │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Cuenta confirmada

---

## PASO 4️⃣: Inicia Sesión en Dashboard

Una vez verificado, inicia sesión:

```
https://www.mercadopago.com/home
```

```
┌─ MERCADO PAGO DASHBOARD ─────────────────┐
│                                          │
│  👤 Mi cuenta                            │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ Balance                          │   │
│  │ $0.00                            │   │
│  │                                  │   │
│  │ [Ver más información]            │   │
│  └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Estás logueado

---

## PASO 5️⃣: Ve a Developers

En el menú, busca **"Developers"** o **"Para Desarrolladores"**

```
┌─ MENÚ PRINCIPAL ─────────────────────────┐
│                                          │
│  Mi Mercado Pago                        │
│  Mi cuenta                              │
│  Mis compras                            │
│  Mis ventas                             │
│  Developers ← AQUÍ                      │
│  Más opciones                           │
│                                          │
└──────────────────────────────────────────┘
```

Haz clic en **"Developers"**

O ve directamente a: **https://www.mercadopago.com/developers**

**✅ Resultado:** Estás en la sección Developers

---

## PASO 6️⃣: Ve a Credenciales

En el panel lateral o en el menú principal:

```
┌─ DEVELOPERS ─────────────────────────────┐
│                                          │
│  Dashboard                               │
│  Credenciales ← AQUÍ                    │
│  Integraciones                           │
│  Webhooks                                │
│  Documentación                           │
│                                          │
└──────────────────────────────────────────┘
```

Haz clic en **"Credenciales"** o **"Credentials"**

O ve directamente a: **https://www.mercadopago.com.co/developers/panel/credentials**

(Nota: Puede variar según tu país - .com.co, .com.ar, etc.)

**✅ Resultado:** Ves tu panel de credenciales

---

## PASO 7️⃣: Elige Ambiente - SANDBOX (Recomendado para Testing)

En la parte superior o lateral, verás 2 opciones:

```
┌─ AMBIENTES ──────────────────────────────┐
│                                          │
│  (●) SANDBOX ← AQUÍ (Para testing)      │
│  ( ) PRODUCCIÓN (Dinero real)            │
│                                          │
│  Selecciona SANDBOX primero              │
│                                          │
└──────────────────────────────────────────┘
```

**¿Por qué SANDBOX primero?**

```
SANDBOX (Pruebas):
  ✓ Sin dinero real
  ✓ Puedes probar pagos
  ✓ Para desarrollo
  ✓ RECOMENDADO PRIMERO

PRODUCCIÓN (Dinero real):
  ✓ Dinero real
  ✓ Para usuarios reales
  ✓ Después de probar
```

Selecciona: **SANDBOX**

**✅ Resultado:** Ves credenciales de Sandbox

---

## PASO 8️⃣: Obtén ACCESS TOKEN

En la pantalla de credenciales, verás:

```
┌─ CREDENCIALES SANDBOX ───────────────────┐
│                                          │
│  Public Key (Clave Pública)             │
│  APP_USR-1234567890-abcdefghij-klmnop  │
│                                          │
│  [COPIAR]                                │
│                                          │
│  ───────────────────────────────────────  │
│                                          │
│  Access Token (Token de Acceso)         │
│  APP_USR-9876543210-zyxwvutsrq-ponmlk  │
│                                          │
│  [COPIAR] ← AQUÍ                         │
│                                          │
└──────────────────────────────────────────┘
```

**¿Qué haces?**

Busca: **"Access Token"** o **"Token de Acceso"**

Haz clic en **[COPIAR]** al lado del token

```
┌─ COPIANDO ───────────────────────────────┐
│                                          │
│  Presionaste [COPIAR]                    │
│                                          │
│  ✅ Token copiado al portapapeles       │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Access Token copiado

---

## PASO 9️⃣: Guarda el ACCESS TOKEN

1. Abre bloc de notas
2. Presiona `Ctrl + V` (o `Cmd + V` en Mac)
3. Pégalo

Debería verse así:

```
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-1234567890-abcdefghij-klmnopqrst-uvwxyz
```

**⚠️ IMPORTANTE:**

```
✅ Guarda este token en lugar seguro
✅ No lo compartas
❌ No lo pongas en redes sociales
❌ No lo commites en GitHub
```

**✅ Resultado:** Access Token guardado

---

## PASO 1️⃣0️⃣: Obtén PUBLIC KEY

De la misma pantalla de credenciales:

Busca: **"Public Key"** o **"Clave Pública"**

Haz clic en **[COPIAR]** al lado de la public key

```
┌─ COPIANDO PUBLIC KEY ────────────────────┐
│                                          │
│  Presionaste [COPIAR]                    │
│                                          │
│  ✅ Public Key copiada al portapapeles  │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Public Key copiada

---

## PASO 1️⃣1️⃣: Guarda la PUBLIC KEY

En el mismo bloc de notas, agrega:

```
MERCADO_PAGO_PUBLIC_KEY=APP_USR-9876543210-zyxwvutsrq-ponmlkjihg-fedcba
```

Tu bloc de notas debería verse así:

```
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-1234567890-abcdefghij-klmnopqrst-uvwxyz
MERCADO_PAGO_PUBLIC_KEY=APP_USR-9876543210-zyxwvutsrq-ponmlkjihg-fedcba
```

**✅ Resultado:** Ambos tokens guardados

---

## PASO 1️⃣2️⃣: Ve a Render

1. Abre: https://render.com/dashboard
2. Selecciona: `evastrong-backend`
3. Haz clic en: **"Settings"**

```
┌─ RENDER DASHBOARD ───────────────────────┐
│                                          │
│  evastrong-backend                      │
│                                          │
│  [Settings] ← AQUÍ                      │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Estás en Settings

---

## PASO 1️⃣3️⃣: Ve a Environment Variables

En Settings:

```
┌─ SETTINGS ───────────────────────────────┐
│                                          │
│  General                                 │
│  Deployments                             │
│  Logs                                    │
│  Environment Variables ← AQUÍ            │
│  Integrations                            │
│                                          │
└──────────────────────────────────────────┘
```

Haz clic en **"Environment Variables"**

**✅ Resultado:** Ves la lista de variables

---

## PASO 1️⃣4️⃣: Agrega MERCADO_PAGO_ACCESS_TOKEN

1. Busca o crea: `MERCADO_PAGO_ACCESS_TOKEN`
2. En el campo "Value", pega tu access token
3. Haz clic en **"Save"**

```
┌─ AGREGAR VARIABLE ───────────────────────┐
│                                          │
│  Name: MERCADO_PAGO_ACCESS_TOKEN        │
│                                          │
│  Value: APP_USR-1234567890-abcdefghij...│
│                                          │
│  [Save]                                  │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Access Token guardado en Render

---

## PASO 1️⃣5️⃣: Agrega MERCADO_PAGO_PUBLIC_KEY

1. Busca o crea: `MERCADO_PAGO_PUBLIC_KEY`
2. En el campo "Value", pega tu public key
3. Haz clic en **"Save"**

```
┌─ AGREGAR VARIABLE ───────────────────────┐
│                                          │
│  Name: MERCADO_PAGO_PUBLIC_KEY          │
│                                          │
│  Value: APP_USR-9876543210-zyxwvutsrq..│
│                                          │
│  [Save]                                  │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Public Key guardada en Render

---

## PASO 1️⃣6️⃣: Redeploy

Para aplicar los cambios:

1. Ve a: **"Deployments"**
2. Haz clic en: **"Trigger Deploy"** o **"Redeploy"**
3. Espera 3-5 minutos

```
⏳ Desplegando...
████████████░░░░░░░░░░░░░░░░░░░░░░░░░░ 40%
```

**✅ Resultado:** Backend redesplegado con credenciales de Mercado Pago

---

## PASO 1️⃣7️⃣: Verifica en Logs

1. Ve a: **"Logs"**
2. Busca líneas como:

```
✅ Mercado Pago configurado
✅ Access Token válido
✅ Pagos listos
```

Si ves estos mensajes: **¡ÉXITO!** ✅

---

## ✅ VERIFICACIÓN FINAL

### ¿Cómo probar que funciona?

**Opción 1: Health Check**

```bash
curl https://evastrong-backend.onrender.com/payments/health
```

Debería responder:

```json
{
  "status": "OK",
  "mercadoPago": "ready"
}
```

**Opción 2: Crear Preferencia de Pago**

```bash
curl -X POST https://evastrong-backend.onrender.com/payments/create-preference \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Payment",
    "price": 29.99,
    "quantity": 1,
    "email": "test@example.com"
  }'
```

Debería responder con un `preferenceId`

---

## 📱 PROBAR CON TARJETA DE PRUEBA

### En Sandbox, usa estas tarjetas:

**APROBADA:**
```
Número: 4111 1111 1111 1111
Vencimiento: 12/25
CVV: 123
Titulador: APRO (para aprobado)
```

**RECHAZADA:**
```
Número: 4000 0000 0000 0002
Vencimiento: 12/25
CVV: 123
Titulador: RECH (para rechazado)
```

---

## 🔄 PASAR A PRODUCCIÓN DESPUÉS

Una vez que pruebes todo en SANDBOX:

### PASO A: Ve a Mercado Pago Producción

1. Ve a: https://www.mercadopago.com/developers/panel/credentials
2. Selecciona: **PRODUCCIÓN** (en lugar de SANDBOX)

### PASO B: Obtén Credenciales de Producción

```
PRODUCCIÓN:
  - ACCESS_TOKEN: APP_USR-xxxxx... (diferente del Sandbox)
  - PUBLIC_KEY: APP_USR-yyyyy... (diferente del Sandbox)
```

### PASO C: Actualiza en Render

```
MERCADO_PAGO_ACCESS_TOKEN=[Tu token de PRODUCCIÓN]
MERCADO_PAGO_PUBLIC_KEY=[Tu public key de PRODUCCIÓN]
```

### PASO D: Redeploy

Haz Redeploy en Render para aplicar cambios

---

## ⚠️ IMPORTANTE

```
🔒 SEGURIDAD:

✅ Access Token: SOLO en backend (nunca en frontend)
✅ Public Key: Puede estar en frontend (es pública)

❌ NO HACER:
  ❌ Poner Access Token en frontend
  ❌ Compartir Access Token
  ❌ Commitar credenciales en GitHub
  ❌ Usar Sandbox en producción

✅ HACER:
  ✅ Usar variables de entorno
  ✅ Mantener Access Token seguro
  ✅ Probar primero en Sandbox
  ✅ Cambiar a Producción cuando esté listo
```

---

## ✅ CHECKLIST

- [ ] Creaste cuenta en Mercado Pago
- [ ] Verificaste tu email
- [ ] Fuiste a Developers → Credenciales
- [ ] Seleccionaste SANDBOX
- [ ] Obtuviste Access Token
- [ ] Guardaste Access Token en bloc de notas
- [ ] Obtuviste Public Key
- [ ] Guardaste Public Key en bloc de notas
- [ ] Fuiste a Render → Settings → Environment Variables
- [ ] Agregaste MERCADO_PAGO_ACCESS_TOKEN
- [ ] Agregaste MERCADO_PAGO_PUBLIC_KEY
- [ ] Hiciste Redeploy
- [ ] Verificaste en logs que se configuró

---

## 🆘 ERRORES COMUNES

### Error: "Credenciales no válidas"

```
Causa: Token copiado incorrectamente
Solución:
1. Ve a Mercado Pago
2. Copia nuevamente
3. Verifica que sea SANDBOX o PRODUCCIÓN según corresponda
4. Redeploy
```

### Error: "Sandbox mode enabled"

```
Causa: Estás usando credenciales de SANDBOX en PRODUCCIÓN
Solución:
1. Cambia a credenciales de PRODUCCIÓN
2. Actualiza en Render
3. Redeploy
```

### Error: "Token not found"

```
Causa: Token no está en Render
Solución:
1. Ve a Render → Environment Variables
2. Verifica que MERCADO_PAGO_ACCESS_TOKEN existe
3. Verifica que el valor no está vacío
4. Redeploy
```

---

## 🎉 ¡LISTO!

Ya tienes los tokens de Mercado Pago configurados.

**Tu backend ahora puede procesar pagos con Mercado Pago + PayPal!**

---

## 📊 RESUMEN FINAL

```
SANDBOX (Testing):
  ✅ Credenciales obtenidas
  ✅ Configuradas en Render
  ✅ Listas para pruebas

PRODUCCIÓN (Dinero Real):
  ⏳ Cuando estés listo
  ⏳ Obtén credenciales de PRODUCCIÓN
  ⏳ Actualiza en Render
  ⏳ Redeploy
```

---

## 🚀 Próximo Paso

¿Qué quieres hacer ahora?

1. **Probar los pagos** con tarjetas de prueba
2. **Configurar webhooks** para notificaciones
3. **Integrar en frontend** (React/Flutter)
4. **Pasar a producción** con dinero real

Escribe el número que prefiera 🎯
