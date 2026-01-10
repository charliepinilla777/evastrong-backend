# 💳 Mercado Pago + PayPal - Configuración Completa

## 📋 Tabla de Contenidos

1. [¿Por qué Mercado Pago?](#por-qué-mercado-pago)
2. [Crear Cuenta en Mercado Pago](#crear-cuenta-en-mercado-pago)
3. [Conectar PayPal a Mercado Pago](#conectar-paypal-a-mercado-pago)
4. [Obtener Credenciales](#obtener-credenciales)
5. [Configurar en Backend](#configurar-en-backend)
6. [Testing](#testing)
7. [Webhooks](#webhooks)

---

## 🎯 ¿Por qué Mercado Pago?

**Mercado Pago** es la mejor opción en Latinoamérica porque:

✅ Soporta **PayPal** como método de pago
✅ Integración simple con Node.js
✅ Comisiones competitivas
✅ Soporte en español
✅ Disponible en múltiples países
✅ Seguridad PCI DSS Level 1
✅ Webhooks para notificaciones en tiempo real

---

## 1️⃣ Crear Cuenta en Mercado Pago

### Paso 1: Ir a Mercado Pago

1. Abre: https://www.mercadopago.com
2. Haz clic en **"Crear cuenta"** o **"Inicia sesión"**

### Paso 2: Opción A - Registrarse Directamente

```
Email: tu_email@gmail.com
Password: Contraseña fuerte
```

O

### Paso 2: Opción B - Usar Cuenta Existente

Si ya tienes cuenta en Mercado Libre, usa esas credenciales.

### Paso 3: Verificar Email

1. Revisa tu bandeja de entrada
2. Haz clic en el enlace de verificación
3. Confirma tu email

### Paso 4: Completar Perfil

Mercado Pago te pedirá:

```
Nombre completo: Tu nombre
Apellido: Tu apellido
Fecha de nacimiento: DD/MM/YYYY
País: Colombia (o tu país)
Tipo de documento: Cédula/Pasaporte
Número de documento: Tu número
```

Haz clic en **"Continuar"**

**Resultado esperado:**

```
✅ Cuenta Mercado Pago creada
   Estado: Verificación pendiente
```

---

## 2️⃣ Conectar PayPal a Mercado Pago

### Paso 1: Ir a Configuración de Pagos

1. En tu dashboard de Mercado Pago
2. Ve a **"Configuración"** → **"Métodos de pago"**
3. O usa: https://www.mercadopago.com.co/developers/

### Paso 2: Agregar Cuenta PayPal

En la sección **"Mis cuentas"**:

1. Haz clic en **"+ Conectar cuenta"**
2. Selecciona **"PayPal"**

### Paso 3: Autorizar PayPal

Se abrirá una ventana de PayPal:

1. Inicia sesión con tu cuenta PayPal
2. Haz clic en **"Autorizar"**
3. Permite que Mercado Pago acceda a tu cuenta

**Resultado esperado:**

```
✅ Cuenta PayPal conectada a Mercado Pago
   Estado: Activo
```

### Paso 4: Verificar Conexión

De vuelta en Mercado Pago:

```
✅ Tu cuenta PayPal está conectada
   Email: tu_email@paypal.com
   Estado: Verificado
```

---

## 3️⃣ Obtener Credenciales

### Paso 1: Ir a Credenciales

1. En Mercado Pago, ve a **"Developers"** → **"Credenciales"**
2. O usa: https://www.mercadopago.com.co/developers/panel/credentials

### Paso 2: Seleccionar Ambiente

```
Opciones:
• Modo Sandbox (DESARROLLO) - Sin dinero real
• Modo Producción (PRODUCCIÓN) - Con dinero real
```

**Para comenzar: Sandbox** ✅

### Paso 3: Copiar Credenciales Sandbox

Verás dos credenciales:

```
PUBLIC_KEY (Clave Pública):
  APP_USR-xxxxxxxxxxxxxxxxxxxxx

ACCESS_TOKEN (Token de Acceso):
  APP_USR-xxxxxxxxxxxxxxxxxxxxx
```

Copia ambas y guárdalas en un lugar seguro.

### Paso 4: Obtener Credenciales Producción

Cuando estés listo para aceptar dinero real:

1. Ve a **Modo Producción**
2. Sigue el mismo proceso
3. Obtén las credenciales de producción

```
PUBLIC_KEY (Producción):
  APP_USR-yyyyyyyyyyyyyyyyyyyyy

ACCESS_TOKEN (Producción):
  APP_USR-yyyyyyyyyyyyyyyyyyyyy
```

---

## 4️⃣ Configurar en Backend

### Paso 1: Actualizar .env.local

```bash
# En evastrong-backend/.env.local

# MERCADO PAGO - SANDBOX (DESARROLLO)
MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxxxxxxx
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxx

# O si necesitas producción
# MERCADO_PAGO_PUBLIC_KEY=APP_USR-yyyyyyyyyyyyyyyyyyyyy
# MERCADO_PAGO_ACCESS_TOKEN=APP_USR-yyyyyyyyyyyyyyyyyyyyy

# Webhook
MERCADO_PAGO_WEBHOOK_SECRET=tu_webhook_secret_aqui
```

### Paso 2: Instalar SDK de Mercado Pago

```bash
npm install mercadopago
```

### Paso 3: Configurar en Backend

Verifica que `routes/payments.js` tenga:

```javascript
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  integrator_id: 'dev_xxxxxxxxxxxxxxxxxxxxxxxx'
});
```

### Paso 4: Crear Endpoint de Pago

Ejemplo básico en `routes/payments.js`:

```javascript
const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const { protect } = require('../middleware/authJWT');

// Crear preferencia de pago
router.post('/create-preference', protect, async (req, res) => {
  try {
    const { title, price, quantity, email } = req.body;

    const preference = {
      items: [
        {
          title: title,
          unit_price: parseFloat(price),
          quantity: parseInt(quantity),
          currency_id: 'COP', // Cambiar según país
        }
      ],
      payer: {
        email: email,
        name: req.user.name,
      },
      back_urls: {
        success: process.env.FRONTEND_URL + '/success',
        failure: process.env.FRONTEND_URL + '/failure',
        pending: process.env.FRONTEND_URL + '/pending',
      },
      auto_return: 'approved',
      external_reference: req.user._id.toString(),
      notification_url: `${process.env.BACKEND_URL}/payments/webhook`,
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      success: true,
      preferenceId: response.body.id,
      initPoint: response.body.init_point, // URL para Checkout Clásico
      sandboxInitPoint: response.body.sandbox_init_point, // URL Sandbox
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Webhook para notificaciones
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.query;

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Obtener detalles del pago
      const payment = await mercadopago.payment.findById(paymentId);
      
      // Procesar según estado
      if (payment.body.status === 'approved') {
        // Pago aprobado - Actualizar DB
        console.log('✅ Pago aprobado:', paymentId);
      } else if (payment.body.status === 'pending') {
        // Pago pendiente
        console.log('⏳ Pago pendiente:', paymentId);
      } else if (payment.body.status === 'rejected') {
        // Pago rechazado
        console.log('❌ Pago rechazado:', paymentId);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error en webhook:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
```

---

## 5️⃣ Configurar en Render (Producción)

### Paso 1: Agregar Variables en Render

En tu proyecto de Render:

1. Ve a **Settings** → **Environment Variables**
2. Agrega:

```
MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxxxxxxx
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxx
MERCADO_PAGO_WEBHOOK_SECRET=tu_webhook_secret
```

### Paso 2: Redeploy

Haz clic en **"Redeploy"** para que los cambios tomen efecto.

---

## 6️⃣ Testing

### Paso 1: Prueba en Sandbox

Para probar sin dinero real:

```bash
curl -X POST http://localhost:5000/payments/create-preference \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Premium Plan",
    "price": 29.99,
    "quantity": 1,
    "email": "test@example.com"
  }'
```

**Respuesta esperada:**

```json
{
  "success": true,
  "preferenceId": "123456789",
  "sandboxInitPoint": "https://sandbox.mercadopago.com/checkout/v1/...",
  "initPoint": "https://www.mercadopago.com/checkout/v1/..."
}
```

### Paso 2: Tarjetas de Prueba

En Sandbox, usa estas tarjetas:

**Tarjeta Aprobada:**
```
Número: 4111 1111 1111 1111
Vencimiento: 12/25
CVV: 123
```

**Tarjeta Rechazada:**
```
Número: 4000 0000 0000 0002
Vencimiento: 12/25
CVV: 123
```

### Paso 3: Flujo Completo

1. Llama a `/create-preference`
2. Abre el `sandboxInitPoint` en navegador
3. Selecciona "PayPal" como método
4. Usa las credenciales de prueba de PayPal
5. Completa el pago
6. Deberías recibir el webhook

---

## 7️⃣ Webhooks

### Paso 1: Configurar URL de Webhook

En tu dashboard de Mercado Pago:

1. Ve a **Configuración** → **Notificaciones**
2. Haz clic en **"Crear notificación"**
3. Selecciona **"URL"**

### Paso 2: Agregar URL

```
URL: https://evastrong-backend.onrender.com/payments/webhook
Eventos: 
  ✅ payment.created
  ✅ payment.updated
  ✅ payment.notification
```

### Paso 3: Probar Webhook

Mercado Pago te permite enviar un webhook de prueba:

1. Haz clic en tu webhook
2. Selecciona **"Enviar prueba"**
3. Verifica que tu backend reciba la solicitud

**Resultado esperado:**

```
✅ Webhook recibido en: /payments/webhook
   Tipo: payment
   Status: approved
```

---

## 📱 Integrar en Frontend (React/Next.js)

### Paso 1: Instalar MercadoPago SDK

```bash
npm install @mercadopago/sdk-js
```

### Paso 2: Crear Componente de Pago

```javascript
import { useState } from 'react';

export default function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Llamar a tu backend
      const response = await fetch('http://localhost:5000/payments/create-preference', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Premium Plan',
          price: 29.99,
          quantity: 1,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir a Mercado Pago
        window.location.href = data.sandboxInitPoint;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Procesando...' : 'Pagar con PayPal'}
    </button>
  );
}
```

---

## 🔒 Mejores Prácticas de Seguridad

### ✅ HACER:

1. ✅ Guardar ACCESS_TOKEN de forma segura
2. ✅ Usar HTTPS en producción
3. ✅ Validar montos en backend
4. ✅ Verificar webhooks con firma
5. ✅ No exponer PUBLIC_KEY en backend
6. ✅ Usar variables de entorno
7. ✅ Verificar status de pago antes de otorgar acceso

### ❌ NO HACER:

1. ❌ Hardcodear credenciales
2. ❌ Confiar solo en respuesta del cliente
3. ❌ Exponer ACCESS_TOKEN en frontend
4. ❌ Ignorar webhook de confirmación
5. ❌ Usar credenciales de producción en desarrollo

---

## 🆘 Solución de Problemas

### Error: "Invalid credentials"

```
Causa: Credenciales incorrectas
Solución:
1. Verifica que copió correctamente PUBLIC_KEY y ACCESS_TOKEN
2. Asegúrate de que estás en el ambiente correcto (Sandbox/Producción)
3. Regenera las credenciales si es necesario
```

### Error: "Preference not found"

```
Causa: Preference ID inválido
Solución:
1. Verifica que create-preference devolvió un ID válido
2. Asegúrate de que estás usando el mismo ambiente
3. Prueba nuevamente
```

### Error: "Webhook not received"

```
Causa: Webhook no se envía
Solución:
1. Verifica que la URL es accesible desde internet
2. En Render, asegúrate de que el servicio está activo
3. Revisa los logs en Mercado Pago
4. Prueba manualmente desde Mercado Pago
```

### Error: "PayPal not connected"

```
Causa: Cuenta PayPal no está conectada a Mercado Pago
Solución:
1. Ve a "Mis cuentas" en Mercado Pago
2. Haz clic en "Conectar cuenta PayPal"
3. Autoriza el acceso
4. Verifica que aparezca como "Conectado"
```

---

## 📋 Checklist de Configuración

- [ ] Cuenta Mercado Pago creada
- [ ] Cuenta PayPal conectada a Mercado Pago
- [ ] Credenciales Sandbox obtenidas
- [ ] .env.local configurado
- [ ] SDK Mercado Pago instalado
- [ ] Endpoints de pago implementados
- [ ] Webhooks configurados
- [ ] Prueba en Sandbox completada
- [ ] Tarjetas de prueba probadas
- [ ] Webhook de prueba enviado
- [ ] Variables en Render configuradas
- [ ] Frontend integrado con pagos
- [ ] Credenciales Producción obtenidas (cuando esté listo)

---

## 💰 Costos y Comisiones

### Mercado Pago + PayPal

```
Comisión: 2.9% + tarifa fija
Ejemplo:
  Transacción: $100
  Comisión: $2.90 + tarifa fija
  Total recibido: ~$97
```

### Comparación con Otras Opciones

| Servicio | Comisión | Disponibilidad |
|----------|----------|----------------|
| Mercado Pago | 2.9% + fija | Latinoamérica |
| Stripe | 2.2% + $0.30 | Global |
| PayPal Direct | 2.2% + $0.30 | Global |
| Transferencia | 0% | Cuenta propia |

---

## 📚 Recursos Adicionales

- [Documentación Mercado Pago](https://www.mercadopago.com.co/developers/es/reference)
- [SDK Node.js](https://github.com/mercadopago/sdk-nodejs)
- [Guía de Webhooks](https://www.mercadopago.com.co/developers/es/guides/additional-info/webhooks/how-to-configure)
- [Prueba Sandbox](https://www.mercadopago.com.co/developers/es/guides/additional-info/your-integrations/test)

---

## ✅ Pasos Siguientes

Una vez que Mercado Pago esté configurado:

1. ✅ MongoDB: **COMPLETADO**
2. ✅ Google OAuth: **COMPLETADO**
3. ✅ Mercado Pago: **COMPLETADO** (estás aquí)
4. ⏭️ Desplegar en Render: Ir a `RENDER_DEPLOYMENT.md`
5. ⏭️ Conectar Frontend: Ir a `BACKEND_SETUP.md`
6. ⏭️ Testing: Verificar endpoints completos

---

**¡Mercado Pago + PayPal configurado correctamente! 💳**

Tu backend ahora puede aceptar pagos a través de PayPal.

¿Necesitas ayuda con el siguiente paso?
