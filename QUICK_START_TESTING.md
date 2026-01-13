# ⚡ QUICK START - Testing de Pagos (5 minutos)

## 🚀 PASO 1: Verifica .env LOCAL (1 minuto)

Abre: `C:\Users\Carlos\Desktop\EvaStrong-Backend\.env`

Asegúrate que tenga:
```env
MONGODB_URI=mongodb+srv://evastrong_user:Ducati2027@evastrong-cluster.a1b2c3d4.mongodb.net/evastrong?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_seguro_aqui

PAYPAL_CLIENT_ID=tu_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_sandbox_secret
PAYPAL_MODE=sandbox

MERCADO_PAGO_ACCESS_TOKEN=tu_mercado_pago_sandbox_token
MERCADO_PAGO_PUBLIC_KEY=tu_mercado_pago_public_key
MERCADO_PAGO_MODE=sandbox

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

---

## 🚀 PASO 2: Inicia el Servidor (1 minuto)

En Terminal (PowerShell):
```powershell
cd C:\Users\Carlos\Desktop\EvaStrong-Backend
npm install
npm run dev
```

**Esperado:**
```
✅ MongoDB Conectado
   Servidor corriendo en http://localhost:5000
```

---

## 🚀 PASO 3: Registra un Usuario (1 minuto)

Abre Postman o PowerShell:

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"test@example.com","password":"Test123456!","name":"Test User"}'

$response.Content | ConvertFrom-Json
```

**Respuesta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Copia el token y guárdalo:**
```powershell
$JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🚀 PASO 4: Test 1 - Mercado Pago COP (1 minuto)

```powershell
$headers = @{
  "Content-Type" = "application/json"
  "Authorization" = "Bearer $JWT_TOKEN"
}

$body = @{
  plan = "premium"
  period = "monthly"
  currency = "COP"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/payments/mercado-pago/create-preference" `
  -Method POST `
  -Headers $headers `
  -Body $body

$data = $response.Content | ConvertFrom-Json
$data | ConvertTo-Json
```

**Espera ver:**
```json
{
  "success": true,
  "preferenceId": "1234567890",
  "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "payment": "507f1f77bcf86cd799439011"
}
```

**✅ SI LO VES = Mercado Pago COP funciona correctamente**

---

## 🚀 PASO 5: Test 2 - Mercado Pago USD (1 minuto)

```powershell
$body = @{
  plan = "basic"
  period = "annual"
  currency = "USD"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/payments/mercado-pago/create-preference" `
  -Method POST `
  -Headers $headers `
  -Body $body

$data = $response.Content | ConvertFrom-Json
$data | ConvertTo-Json
```

**✅ SI LO VES = Mercado Pago USD funciona correctamente**

---

## 🚀 PASO 6: Test 3 - PayPal USD (1 minuto)

```powershell
$body = @{
  plan = "premium"
  period = "monthly"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/payments/create-order" `
  -Method POST `
  -Headers $headers `
  -Body $body

$data = $response.Content | ConvertFrom-Json
$data | ConvertTo-Json
```

**Espera ver:**
```json
{
  "success": true,
  "orderId": "3FA30QWBLTJ5E",
  "approvalLink": "https://www.sandbox.paypal.com/checkoutnow?token=...",
  "payment": "507f1f77bcf86cd799439012"
}
```

**✅ SI LO VES = PayPal USD funciona correctamente**

---

## ✅ TESTS COMPLETADOS

Si todo funcionó, tienes:

| Test | Status | Validación |
|------|--------|-----------|
| Mercado Pago COP | ✅ | Preferencia creada con monto en COP |
| Mercado Pago USD | ✅ | Preferencia creada con monto en USD |
| PayPal USD | ✅ | Orden creada exitosamente |

---

## 🎯 PRÓXIMOS PASOS (Opcional)

### Completar un pago real en Mercado Pago
1. Copia el `initPoint` del Test 1
2. Abre en navegador: `{initPoint}`
3. Usa tarjeta: `4111 1111 1111 1111`
4. Expira: `11/25`
5. CVV: `123`
6. Haz clic en Pagar

**Resultado:** La suscripción se crea automáticamente en tu BD

---

## 🆘 ERRORES COMUNES

### "Invalid token"
```
Solución: Vuelve a copiar el JWT_TOKEN del Paso 3
```

### "Cannot POST /payments/mercado-pago/create-preference"
```
Solución: El servidor no está corriendo
  Abre otra terminal y ejecuta: npm run dev
```

### "MERCADO_PAGO_ACCESS_TOKEN is required"
```
Solución: Agrega a tu .env:
  MERCADO_PAGO_ACCESS_TOKEN=tu_token
  MERCADO_PAGO_PUBLIC_KEY=tu_key
```

---

## 📊 RESUMEN

✅ **Si pasaste todos los tests = Tu backend está 100% funcional**

Ahora puedes:
- Integrar los endpoints en tu frontend
- Hacer pagos reales (cambiando a modo producción)
- Conectar webhooks

¿Necesitas ayuda con el siguiente paso?

