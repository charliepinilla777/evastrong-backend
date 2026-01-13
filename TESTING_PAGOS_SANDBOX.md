# 🧪 Testing de Pagos en Sandbox - USD y COP

## ✅ CHECKLIST INICIAL

Antes de empezar, verifica que tienes:

- [ ] `.env` LOCAL con credenciales de sandbox
- [ ] Servidor corriendo: `npm run dev`
- [ ] MongoDB conectado
- [ ] Postman o curl instalado
- [ ] JWT Token válido (obtén uno registrándote)

---

## 🔐 OBTENER JWT TOKEN

Necesitas un token para hacer requests autenticados.

### Paso 1: Registrarse
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "name": "Test User"
  }'

# Respuesta:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Paso 2: Guardar el Token
```bash
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

O en PowerShell:
```powershell
$JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🧪 TEST 1: Mercado Pago - Pesos Colombianos

### Crear preferencia de pago en COP
```bash
curl -X POST http://localhost:5000/payments/mercado-pago/create-preference \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "plan": "basic",
    "period": "monthly",
    "currency": "COP"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "preferenceId": "1234567890123456",
  "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "payment": "507f1f77bcf86cd799439011"
}
```

**Qué verificar:**
- ✅ `success: true`
- ✅ `preferenceId` no está vacío
- ✅ `initPoint` comienza con `https://www.mercadopago`

### Ir al link de pago
1. Copia el `initPoint`
2. Abre en navegador
3. Verás el checkout de Mercado Pago

---

## 🧪 TEST 2: Mercado Pago - Dólares Estadounidenses

### Crear preferencia de pago en USD
```bash
curl -X POST http://localhost:5000/payments/mercado-pago/create-preference \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "plan": "premium",
    "period": "annual",
    "currency": "USD"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "preferenceId": "9876543210987654",
  "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "payment": "507f1f77bcf86cd799439012"
}
```

**Qué verificar:**
- ✅ Monto en USD ($199.99)
- ✅ Plan Premium
- ✅ Período Annual

---

## 🧪 TEST 3: PayPal - Dólares

### Crear orden de pago en PayPal
```bash
curl -X POST http://localhost:5000/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "plan": "basic",
    "period": "monthly"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "orderId": "3FA30QWBLTJ5E",
  "approvalLink": "https://www.sandbox.paypal.com/checkoutnow?token=...",
  "payment": "507f1f77bcf86cd799439013"
}
```

**Qué verificar:**
- ✅ `success: true`
- ✅ `orderId` no está vacío
- ✅ `approvalLink` comienza con `https://www.sandbox.paypal.com`

---

## 💳 TARJETAS DE PRUEBA SANDBOX

### Mercado Pago

**Pago Aprobado:**
```
Número: 4111 1111 1111 1111
Expiración: 11/25
CVV: 123
Nombre: APRO
Resultado: ✅ Aprobado
```

**Pago Rechazado:**
```
Número: 5555 5555 5555 4444
Expiración: 11/25
CVV: 123
Nombre: OOPS
Resultado: ❌ Rechazado
```

**Pago Pendiente:**
```
Número: 4000 0000 0000 0002
Expiración: 11/25
CVV: 123
Nombre: CONT
Resultado: ⏳ Pendiente
```

### PayPal

**Comprador Sandbox:**
```
Email: sb-xxxxxx@personal.example.com
Contraseña: 12345678
```

Obtén el email específico en:
https://developer.paypal.com → Sandbox → Accounts

---

## 🔄 FLUJO COMPLETO DE TESTING

### Paso 1: Crear Preferencia (COP)
```bash
RESPONSE=$(curl -s -X POST http://localhost:5000/payments/mercado-pago/create-preference \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"plan":"premium","period":"monthly","currency":"COP"}')

echo $RESPONSE
# Copia el initPoint
```

### Paso 2: Ir al Checkout
1. Copia el `initPoint`
2. Abre en navegador: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...`

### Paso 3: Completar Pago
1. Usa tarjeta: `4111 1111 1111 1111`
2. Expiración: `11/25`
3. CVV: `123`
4. Nombre: `APRO`
5. Haz clic en **Pagar**

### Paso 4: Verificar en Base de Datos
```bash
# Los logs del servidor deberían mostrar:
# ✅ Preferencia Mercado Pago creada: Plan premium, Período monthly, Monto: 79900 COP
# ✅ Suscripción creada para usuario: 507f1f77bcf86cd799439011
```

### Paso 5: Verificar Suscripción
```bash
curl -X GET http://localhost:5000/payments/subscription \
  -H "Authorization: Bearer $JWT_TOKEN"

# Respuesta:
{
  "success": true,
  "subscription": {
    "_id": "...",
    "plan": "premium",
    "status": "active",
    "startDate": "2024-01-15T...",
    "endDate": "2024-02-15T...",
    "autoRenew": true
  }
}
```

---

## 📊 MATRIZ DE TESTING

| Caso | Plataforma | Plan | Período | Moneda | Monto | Estado |
|------|-----------|------|---------|--------|-------|--------|
| 1 | Mercado Pago | Basic | Monthly | COP | $39.900 | ⏳ |
| 2 | Mercado Pago | Premium | Monthly | COP | $79.900 | ⏳ |
| 3 | Mercado Pago | Basic | Annual | COP | $399.900 | ⏳ |
| 4 | Mercado Pago | Premium | Annual | COP | $799.900 | ⏳ |
| 5 | Mercado Pago | Basic | Monthly | USD | $9.99 | ⏳ |
| 6 | Mercado Pago | Premium | Monthly | USD | $19.99 | ⏳ |
| 7 | Mercado Pago | Basic | Annual | USD | $99.99 | ⏳ |
| 8 | Mercado Pago | Premium | Annual | USD | $199.99 | ⏳ |
| 9 | PayPal | Basic | Monthly | USD | $9.99 | ⏳ |
| 10 | PayPal | Premium | Monthly | USD | $19.99 | ⏳ |

Marca los que ya probaste con ✅

---

## 🆘 TROUBLESHOOTING

### Error: "Invalid token"
```
Causa: JWT_TOKEN expirado o incorrecto
Solución: Vuelve a registrarte y obtén un token nuevo
```

### Error: "OAuth2Strategy requires a clientID"
```
Causa: Falta MERCADO_PAGO_ACCESS_TOKEN en .env
Solución: Verifica que tengas configurado en .env:
  MERCADO_PAGO_ACCESS_TOKEN=tu_token
  MERCADO_PAGO_PUBLIC_KEY=tu_key
```

### Error: "Invalid scheme"
```
Causa: Connection string de MongoDB corrupta
Solución: Verifica MongoDB está conectado: npm run dev
```

### Pago no se completa
```
Causa: Webhook no está configurado
Solución: Los pagos se registran pero sin webhook automático
  En desarrollo, verifica manualmente en la BD
```

### No se crea suscripción
```
Causa: El webhook no llegó o falló
Solución: En desarrollo, crea manual:
  POST /payments/webhook-mercado-pago
```

---

## 📝 COMANDOS RÁPIDOS

### Registrar usuario
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456!","name":"Test"}'
```

### Obtener suscripción
```bash
curl -X GET http://localhost:5000/payments/subscription \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Cancelar suscripción
```bash
curl -X POST http://localhost:5000/payments/cancel-subscription \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Ver logs del servidor
```bash
# En la terminal donde corre: npm run dev
# Verás logs como:
# ✅ Preferencia Mercado Pago creada: ...
# ✅ Suscripción creada para usuario: ...
```

---

## 🎯 RESUMEN DE TESTING

**Objetivo:** Verificar que los pagos funcionan correctamente en sandbox

**Casos a probar:**
1. ✅ Mercado Pago COP (básico)
2. ✅ Mercado Pago USD (básico)
3. ✅ PayPal USD (básico)
4. ✅ Crear suscripción después de pago
5. ✅ Cancelar suscripción
6. ✅ Obtener estado de suscripción

**Éxito:** Si todos los pagos se completan y las suscripciones se crean automáticamente

