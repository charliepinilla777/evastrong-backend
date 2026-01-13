# 💳 Configurar PayPal y Mercado Pago

## 📋 TABLA DE CONTENIDOS
1. [Configurar PayPal](#paypal)
2. [Configurar Mercado Pago](#mercado-pago)
3. [Agregar variables a .env](#env)
4. [Actualizar Render](#render)
5. [Probar Pagos](#testing)

---

## <a name="paypal"></a>1️⃣ CONFIGURAR PAYPAL

### Paso 1: Crear cuenta de desarrollador en PayPal

1. Ve a https://developer.paypal.com
2. Si no tienes cuenta, haz clic en **Sign Up**
3. Completa el registro (necesitas email y contraseña)
4. Verifica tu email

### Paso 2: Obtener Credenciales

1. Una vez logueado, ve a **Dashboard** → **Apps & Credentials**
2. Asegúrate de estar en **Sandbox** (para testing)
3. Haz clic en **Create App** (bajo "REST API apps")
4. Dale un nombre: `EvaStrong`
5. Se crearán automáticamente:
   - **Client ID**
   - **Secret**

### Paso 3: Copiar las Credenciales

1. En **Sandbox** > **REST API apps** > **EvaStrong**
2. Verás:
   ```
   Client ID: [COPIA ESTO]
   Secret: [COPIA ESTO]
   ```
3. Guarda estos valores

### Paso 4: Configurar URLs de Retorno

En tu aplicación frontend, cuando configure el botón de PayPal, asegúrate de tener:

```javascript
// Frontend - React/Vue/Angular
const onApprove = async (data) => {
  // Llamar a tu backend para capturar el pago
  await fetch('/payments/capture-order/' + data.orderID, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
};
```

---

## <a name="mercado-pago"></a>2️⃣ CONFIGURAR MERCADO PAGO

### Paso 1: Crear cuenta en Mercado Pago

1. Ve a https://www.mercadopago.com.ar (o tu país)
2. Haz clic en **Crear Cuenta**
3. Completa el registro
4. Verifica tu email

### Paso 2: Obtener Credenciales

1. Inicia sesión en https://www.mercadopago.com.ar/admin
2. Ve a **Configuración** → **Credenciales**
3. Verás dos opciones:
   - **Modo Sandbox** (para testing)
   - **Modo Producción** (para pagos reales)

4. Para testing, usa **Modo Sandbox**:
   ```
   Access Token (Sandbox): [COPIA ESTO]
   Public Key (Sandbox): [COPIA ESTO]
   ```

5. Guarda estos valores

### Paso 3: Generar Webhook Secret

1. Ve a **Configuración** → **Webhooks**
2. Agrega un webhook:
   - **URL:** `https://tu-servicio.onrender.com/payments/webhook-mercado-pago`
   - **Eventos:** `payment.created`, `payment.updated`
3. Se generará un **Token de Verificación**
4. Guarda este valor como `MERCADO_PAGO_WEBHOOK_SECRET`

### Paso 4: Verificar Datos de Cuenta (Importante)

En **Información de la Cuenta** → **Mi Negocio**:
- Nombre de la tienda: Eva Strong
- CUIT/Documento: Completa esto
- Categoría: Fitness/Salud

---

## <a name="env"></a>3️⃣ AGREGAR VARIABLES AL .env LOCAL

En tu archivo `C:\Users\Carlos\Desktop\EvaStrong-Backend\.env`, agrega:

```env
# ========== PAYPAL ==========
PAYPAL_CLIENT_ID=tu_paypal_client_id_aqui
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret_aqui
PAYPAL_MODE=sandbox
PAYPAL_RETURN_URL=http://localhost:5000/payments/success
PAYPAL_CANCEL_URL=http://localhost:5000/payments/cancel

# ========== MERCADO PAGO ==========
MERCADO_PAGO_ACCESS_TOKEN=tu_mercado_pago_access_token_aqui
MERCADO_PAGO_PUBLIC_KEY=tu_mercado_pago_public_key_aqui
MERCADO_PAGO_WEBHOOK_SECRET=tu_webhook_secret_aqui
MERCADO_PAGO_MODE=sandbox
```

**IMPORTANTE:** 
- ✅ Reemplaza los valores con los reales
- ✅ Guarda solo en tu `.env` LOCAL
- ✅ NUNCA hagas commit de esto a GitHub

---

## <a name="render"></a>4️⃣ ACTUALIZAR VARIABLES EN RENDER

### Paso 1: Ir a Render Dashboard

1. Ve a https://dashboard.render.com
2. Selecciona `evastrong-backend`
3. Ve a **Environment**

### Paso 2: Agregar Variables de PayPal

Haz clic en **Add Environment Variable** para cada una:

```
Name: PAYPAL_CLIENT_ID
Value: [Tu client ID de PayPal sandbox]

Name: PAYPAL_CLIENT_SECRET
Value: [Tu client secret de PayPal sandbox]

Name: PAYPAL_MODE
Value: sandbox

Name: PAYPAL_RETURN_URL
Value: https://tu-dominio.com/payments/success

Name: PAYPAL_CANCEL_URL
Value: https://tu-dominio.com/payments/cancel
```

### Paso 3: Agregar Variables de Mercado Pago

```
Name: MERCADO_PAGO_ACCESS_TOKEN
Value: [Tu access token de Mercado Pago sandbox]

Name: MERCADO_PAGO_PUBLIC_KEY
Value: [Tu public key de Mercado Pago sandbox]

Name: MERCADO_PAGO_WEBHOOK_SECRET
Value: [Tu webhook secret]

Name: MERCADO_PAGO_MODE
Value: sandbox
```

### Paso 4: Guardar y Redeploy

1. Haz clic en **Save**
2. Ve a **Settings** → **Clear Build Cache**
3. Haz clic en **Redeploy latest commit**

---

## <a name="testing"></a>5️⃣ PROBAR PAGOS

### Prueba de PayPal Sandbox

**Cuentas de prueba:**

Comprador:
```
Email: sb-tu-email@personal.example.com
Contraseña: 12345678
```

Vendedor (tu cuenta de desarrollador)

### Prueba de Mercado Pago

**Tarjetas de prueba:**

```
Tarjeta: 4111 1111 1111 1111
Expiración: 11/25
CVV: 123
Nombre: APRO
```

Otros resultados:
- `OOPS` - Falla
- `CONT` - Pago pendiente
- `OTHE` - Rechazado

---

## 🔗 ENDPOINTS DISPONIBLES

### PayPal

```
POST /payments/create-order
Crear una orden de pago con PayPal

POST /payments/capture-order/:orderId
Capturar el pago (después que el usuario aprueba)

POST /payments/webhook
Recibir eventos de PayPal
```

### Mercado Pago

```
POST /payments/create-preference
Crear una preferencia de pago con Mercado Pago

POST /payments/webhook-mercado-pago
Recibir webhooks de Mercado Pago
```

---

## 📞 RESUMEN RÁPIDO

| Paso | Acción | Dónde |
|------|--------|-------|
| 1 | Crear cuenta de desarrollador | https://developer.paypal.com |
| 2 | Crear app y copiar credenciales | PayPal Dashboard |
| 3 | Crear cuenta en Mercado Pago | https://www.mercadopago.com.ar |
| 4 | Copiar credenciales de Mercado Pago | Mercado Pago Admin |
| 5 | Agregar variables al .env LOCAL | Tu computadora |
| 6 | Actualizar variables en Render | Render Dashboard |
| 7 | Redeploy | Render |
| 8 | Probar con tarjetas sandbox | Tu app |

---

## 🆘 TROUBLESHOOTING

### PayPal dice "Invalid Client"
- ❌ Client ID o Secret incorrecto
- ✅ Verifica en PayPal Dashboard → Apps & Credentials

### Mercado Pago dice "Invalid token"
- ❌ Access Token incorrecto o expirado
- ✅ Regenera en Mercado Pago Admin → Credenciales

### No llegan los webhooks
- ❌ URL no está correcta
- ❌ El servidor no está escuchando el endpoint
- ✅ Verifica que /payments/webhook esté registrado
- ✅ Verifica que la URL pública sea accesible

### Transacciones en modo sandbox no funcionan
- ❌ Estás usando credenciales de Producción
- ✅ Verifica que PAYPAL_MODE=sandbox
- ✅ Verifica que MERCADO_PAGO_MODE=sandbox

