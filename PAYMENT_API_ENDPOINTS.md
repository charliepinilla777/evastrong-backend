# 💳 API Endpoints de Pagos - PayPal y Mercado Pago

## 📋 ENDPOINTS DISPONIBLES

### BASE URL (Local)
```
http://localhost:5000/payments
```

### BASE URL (Render)
```
https://tu-servicio.onrender.com/payments
```

---

## 🏦 PAYPAL ENDPOINTS

### 1. Crear Orden de Pago
```
POST /create-order
Autenticación: Requerida (JWT)

Body:
{
  "plan": "basic" | "premium",
  "period": "monthly" | "annual"
}

Response (Éxito):
{
  "success": true,
  "orderId": "3FA30...",
  "approvalLink": "https://www.sandbox.paypal.com/checkoutnow?token=...",
  "payment": "64a1b2c3d4e5f6g7h8i9"
}
```

### 2. Capturar Pago
```
POST /capture-order/:orderId
Autenticación: Requerida (JWT)

Response (Éxito):
{
  "success": true,
  "message": "Pago capturado exitosamente",
  "payment": { ...payment details... },
  "subscription": { ...subscription details... }
}
```

### 3. Webhook PayPal
```
POST /webhook
Autenticación: NO requerida

Eventos soportados:
- CHECKOUT.ORDER.COMPLETED
- PAYMENT.CAPTURE.COMPLETED
- PAYMENT.CAPTURE.DECLINED
- PAYMENT.CAPTURE.REFUNDED
```

---

## 💰 MERCADO PAGO ENDPOINTS

### 1. Crear Preferencia de Pago
```
POST /mercado-pago/create-preference
Autenticación: Requerida (JWT)

Body:
{
  "plan": "basic" | "premium",
  "period": "monthly" | "annual"
}

Response (Éxito):
{
  "success": true,
  "preferenceId": "1234567890",
  "initPoint": "https://www.mercadopago.com.ar/checkout/v1/...",
  "payment": "64a1b2c3d4e5f6g7h8i9"
}
```

### 2. Webhook Mercado Pago
```
POST /webhook-mercado-pago
Autenticación: NO requerida

Body:
{
  "type": "payment",
  "data": {
    "id": 1234567890
  }
}

Eventos soportados:
- payment (cuando se completa un pago)
- plan (cuando se completa un plan)
```

### 3. Obtener Estado del Pago
```
GET /mercado-pago/payment/:paymentId
Autenticación: Requerida (JWT)

Response (Éxito):
{
  "success": true,
  "payment": { ...payment details from Mercado Pago... }
}
```

---

## 💾 Cancelar Suscripción
```
POST /cancel-subscription
Autenticación: Requerida (JWT)

Response (Éxito):
{
  "success": true,
  "message": "Suscripción cancelada exitosamente"
}
```

---

## 📊 Obtener Suscripción Actual
```
GET /subscription
Autenticación: Requerida (JWT)

Response (Con suscripción):
{
  "success": true,
  "subscription": {
    "_id": "...",
    "userId": "...",
    "plan": "premium",
    "period": "monthly",
    "status": "active",
    "startDate": "2024-01-12T...",
    "endDate": "2024-02-12T...",
    "autoRenew": true
  }
}

Response (Sin suscripción):
{
  "success": true,
  "subscription": null
}
```

---

## 🧪 TESTING LOCAL

### Setup para Testing

#### 1. Agregar variables al .env LOCAL
```env
# C:\Users\Carlos\Desktop\EvaStrong-Backend\.env

PAYPAL_CLIENT_ID=tu_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_sandbox_secret
PAYPAL_MODE=sandbox

MERCADO_PAGO_ACCESS_TOKEN=tu_mercado_pago_sandbox_token
MERCADO_PAGO_PUBLIC_KEY=tu_mercado_pago_public_key
MERCADO_PAGO_MODE=sandbox

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

#### 2. Ejecutar servidor local
```bash
npm install
npm run dev
```

El servidor debería estar en: `http://localhost:5000`

### Testing con Postman o curl

#### Test 1: Crear Orden PayPal
```bash
curl -X POST http://localhost:5000/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -d '{
    "plan": "premium",
    "period": "monthly"
  }'
```

#### Test 2: Crear Preferencia Mercado Pago
```bash
curl -X POST http://localhost:5000/payments/mercado-pago/create-preference \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -d '{
    "plan": "basic",
    "period": "annual"
  }'
```

#### Test 3: Obtener Suscripción
```bash
curl -X GET http://localhost:5000/payments/subscription \
  -H "Authorization: Bearer TU_JWT_TOKEN"
```

---

## 💳 TARJETAS DE PRUEBA

### PayPal Sandbox
**Comprador:**
```
Email: sb-xxxxx@personal.example.com
Contraseña: 12345678
```

### Mercado Pago Sandbox

**Tarjetas válidas:**
```
Número: 4111 1111 1111 1111
Expiración: 11/25
CVV: 123
Resultado: APRO (Aprobado)

Número: 5555 5555 5555 4444
Expiración: 11/25
CVV: 123
Resultado: OOPS (Rechazado)
```

---

## 🔐 AUTENTICACIÓN

Todos los endpoints que requieren autenticación esperan un JWT en el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Para obtener un JWT:
1. Registrarse: `POST /auth/register`
2. O iniciar sesión: `POST /auth/login`

---

## 📱 INTEGRACIÓN CON FRONTEND

### Ejemplo React - PayPal
```javascript
import { useEffect } from 'react';

export default function PayPalCheckout() {
  useEffect(() => {
    // 1. Crear orden
    const createOrder = async () => {
      const res = await fetch('http://localhost:5000/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: 'premium',
          period: 'monthly'
        })
      });
      const data = await res.json();
      window.location.href = data.approvalLink;
    };

    createOrder();
  }, []);

  return <div>Redirigiendo a PayPal...</div>;
}
```

### Ejemplo React - Mercado Pago
```javascript
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react';

initMercadoPago('TU_PUBLIC_KEY');

export default function MercadoPagoCheckout() {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    const createPreference = async () => {
      const res = await fetch('http://localhost:5000/payments/mercado-pago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: 'basic',
          period: 'annual'
        })
      });
      const data = await res.json();
      setPreferenceId(data.preferenceId);
    };

    createPreference();
  }, []);

  return preferenceId ? <Wallet initialization={{ preferenceId }} /> : <div>Cargando...</div>;
}
```

---

## 🚨 CÓDIGOS DE ERROR

### PayPal
```
400: Plan o período inválido
500: Error en conexión con PayPal
```

### Mercado Pago
```
400: Plan o período inválido
401: Token de acceso inválido o expirado
500: Error en conexión con Mercado Pago
```

---

## 📞 RESUMEN RÁPIDO

| Acción | Endpoint | Método | Autenticación |
|--------|----------|--------|-----------------|
| Crear orden PayPal | /create-order | POST | ✅ Requerida |
| Capturar pago | /capture-order/:orderId | POST | ✅ Requerida |
| Webhook PayPal | /webhook | POST | ❌ No |
| Crear pref. Mercado Pago | /mercado-pago/create-preference | POST | ✅ Requerida |
| Webhook Mercado Pago | /webhook-mercado-pago | POST | ❌ No |
| Obtener pago | /mercado-pago/payment/:paymentId | GET | ✅ Requerida |
| Cancelar suscripción | /cancel-subscription | POST | ✅ Requerida |
| Obtener suscripción | /subscription | GET | ✅ Requerida |

