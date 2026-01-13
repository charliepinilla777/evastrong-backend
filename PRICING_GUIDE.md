# 💰 Guía de Precios - USD y Pesos Colombianos

## 📊 TABLA DE PRECIOS

### Plan Basic
| Período | USD | COP | Equivalencia |
|---------|-----|-----|--------------|
| Mensual | $9.99 | $39.900 | ~4,000 COP/USD |
| Anual | $99.99 | $399.900 | ~4,000 COP/USD |

### Plan Premium
| Período | USD | COP | Equivalencia |
|---------|-----|-----|--------------|
| Mensual | $19.99 | $79.900 | ~4,000 COP/USD |
| Anual | $199.99 | $799.900 | ~4,000 COP/USD |

---

## 🌐 CÓMO USAR LOS PRECIOS EN PAGOS

### PayPal (Solo USD)
```bash
POST /payments/create-order
{
  "plan": "basic",           # basic | premium
  "period": "monthly"        # monthly | annual
}

# Siempre en USD
# Basic: $9.99/mes o $99.99/año
# Premium: $19.99/mes o $199.99/año
```

### Mercado Pago (USD o COP)
```bash
POST /payments/mercado-pago/create-preference
{
  "plan": "premium",         # basic | premium
  "period": "annual",        # monthly | annual
  "currency": "COP"          # COP (default) | USD
}

# Si no especificas currency, usa COP por defecto
```

---

## 💡 EJEMPLOS DE REQUESTS

### Ejemplo 1: Comprar Premium Mensual en COP
```bash
curl -X POST http://localhost:5000/payments/mercado-pago/create-preference \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -d '{
    "plan": "premium",
    "period": "monthly",
    "currency": "COP"
  }'

# Resultado: Preferencia de pago por $79.900 COP
```

### Ejemplo 2: Comprar Basic Anual en USD
```bash
curl -X POST http://localhost:5000/payments/mercado-pago/create-preference \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -d '{
    "plan": "basic",
    "period": "annual",
    "currency": "USD"
  }'

# Resultado: Preferencia de pago por $99.99 USD
```

### Ejemplo 3: PayPal Premium Mensual (Siempre USD)
```bash
curl -X POST http://localhost:5000/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -d '{
    "plan": "premium",
    "period": "monthly"
  }'

# Resultado: Orden de pago por $19.99 USD
```

---

## 🌍 CONVERSIÓN DE PRECIOS

**Tipo de cambio usado: 1 USD = ~4.000 COP**

| Concepto | USD | COP | Diferencia |
|----------|-----|-----|-----------|
| Basic Mensual | $9.99 | $39.900 | 0 |
| Basic Anual | $99.99 | $399.900 | 0 |
| Premium Mensual | $19.99 | $79.900 | 0 |
| Premium Anual | $199.99 | $799.900 | 0 |

---

## 🔧 ACTUALIZAR PRECIOS

Para cambiar los precios, edita `routes/payments.js`:

### PayPal (Línea ~50)
```javascript
const prices = {
  basic: { monthly: 9.99, annual: 99.99 },
  premium: { monthly: 19.99, annual: 199.99 },
};
```

### Mercado Pago (Línea ~367)
```javascript
const prices = {
  COP: {
    basic: { monthly: 39900, annual: 399900 },
    premium: { monthly: 79900, annual: 799900 },
  },
  USD: {
    basic: { monthly: 9.99, annual: 99.99 },
    premium: { monthly: 19.99, annual: 199.99 },
  },
};
```

---

## 💳 MÉTODOS DE PAGO POR MONEDA

### Pesos Colombianos (COP) - Mercado Pago
✅ **Disponible en Colombia:**
- Tarjeta de crédito
- Tarjeta de débito
- Transferencia bancaria
- Wallet de Mercado Pago
- Efectivo en puntos autorizados

### Dólares (USD) - PayPal o Mercado Pago
✅ **PayPal:**
- Tarjeta de crédito (Visa, Mastercard, American Express)
- Cuenta PayPal
- Transferencia bancaria
- Saldo PayPal

✅ **Mercado Pago (si está disponible en tu país):**
- Métodos locales que soporten USD

---

## 📱 INTEGRACIÓN CON FRONTEND

### React - Selector de Moneda
```javascript
import { useState } from 'react';

export default function PricingSelector() {
  const [currency, setCurrency] = useState('COP');
  const [plan, setPlan] = useState('basic');
  const [period, setPeriod] = useState('monthly');

  const prices = {
    COP: {
      basic: { monthly: 39900, annual: 399900 },
      premium: { monthly: 79900, annual: 799900 },
    },
    USD: {
      basic: { monthly: 9.99, annual: 99.99 },
      premium: { monthly: 19.99, annual: 199.99 },
    },
  };

  const amount = prices[currency][plan][period];

  const handlePayment = async () => {
    // Para Mercado Pago (soporta COP y USD)
    if (currency === 'COP' || currency === 'USD') {
      const res = await fetch('/payments/mercado-pago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan, period, currency })
      });
      const data = await res.json();
      window.location.href = data.initPoint;
    }
  };

  return (
    <div>
      <h2>Selecciona tu Plan</h2>
      
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="COP">💰 Pesos Colombianos (COP)</option>
        <option value="USD">💵 Dólares Estadounidenses (USD)</option>
      </select>

      <select value={plan} onChange={(e) => setPlan(e.target.value)}>
        <option value="basic">Basic</option>
        <option value="premium">Premium</option>
      </select>

      <select value={period} onChange={(e) => setPeriod(e.target.value)}>
        <option value="monthly">Mensual</option>
        <option value="annual">Anual</option>
      </select>

      <h3>Precio: {currency === 'COP' ? '$' : '$'}{amount.toLocaleString()}</h3>
      <button onClick={handlePayment}>Pagar Ahora</button>
    </div>
  );
}
```

---

## 🧪 TESTING CON DIFERENTES PRECIOS

### Sandbox - Mercado Pago COP
```bash
# Crear preferencia en COP
curl -X POST http://localhost:5000/payments/mercado-pago/create-preference \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "basic",
    "period": "monthly",
    "currency": "COP"
  }'

# Respuesta: initPoint con link a Mercado Pago
# Usa tarjeta: 4111 1111 1111 1111 para testing
```

### Sandbox - Mercado Pago USD
```bash
curl -X POST http://localhost:5000/payments/mercado-pago/create-preference \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "premium",
    "period": "annual",
    "currency": "USD"
  }'

# Respuesta: initPoint para pagar $199.99 USD
```

### Sandbox - PayPal USD
```bash
curl -X POST http://localhost:5000/payments/create-order \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "basic",
    "period": "annual"
  }'

# Respuesta: approvalLink para ir a PayPal a pagar $99.99 USD
```

---

## 📞 RESUMEN

| Plataforma | Monedas Soportadas | Método | Default |
|------------|-------------------|--------|---------|
| PayPal | USD | Direct | USD |
| Mercado Pago | COP, USD | Query param | COP |

**Nota:** Los precios están optimizados con una equivalencia de 1 USD = 4.000 COP para mantener consistencia entre ambas monedas.

