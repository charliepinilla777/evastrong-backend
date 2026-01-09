# 🔧 Configuración de PayPal para EvaStrong

Este documento explica cómo obtener tus credenciales de PayPal y configurarlas en el proyecto.

## 📋 Pasos para Configurar PayPal

### 1. Crear una Cuenta de Negocio en PayPal

1. Ve a https://www.paypal.com
2. Haz clic en **"Registro"** (arriba a la derecha)
3. Selecciona **"Crear una cuenta de negocio"**
4. Completa el formulario con tu información personal
5. Verifica tu email
6. ¡Listo! Tienes una cuenta de PayPal

### 2. Acceder al Dashboard de Desarrolladores

1. Una vez logeado en PayPal, ve a https://developer.paypal.com
2. Haz clic en **"Dashboard"**
3. En la esquina superior derecha, cambia a **"Sandbox"** (para pruebas)

### 3. Obtener tus Credenciales

#### Opción A: En el Dashboard de Desarrolladores

1. En el menú izquierdo, selecciona **"Apps & Credentials"**
2. Asegúrate de estar en la pestaña **"Sandbox"**
3. Ve a la sección **"REST API apps"**
4. Haz clic en **"Create App"** (si no tienes una)
5. Verás dos secciones:
   - **Client ID**
   - **Secret**

#### Opción B: Desde tu Cuenta de PayPal

1. Ve a https://www.paypal.com/businessmanage/settings/integration
2. Desplázate hasta **"API signature"**
3. Haz clic en **"View API Signature"** (si no ves REST API)

### 4. Configurar el Archivo `.env`

Una vez tengas tus credenciales, actualiza el archivo `.env` en la carpeta del backend:

```env
# ========== PAYPAL ==========
PAYPAL_MODE=sandbox                    # Usa 'sandbox' para pruebas, 'production' en vivo
PAYPAL_CLIENT_ID=tu-client-id-aqui     # Reemplaza con tu Client ID
PAYPAL_CLIENT_SECRET=tu-secret-aqui    # Reemplaza con tu Secret
PAYPAL_RETURN_URL=http://localhost:3000/payment/success
PAYPAL_CANCEL_URL=http://localhost:3000/payment/cancel
```

### 5. URLs de Retorno (Return URLs)

Estas URLs son a dónde PayPal redirige al usuario después del pago.

**Para Desarrollo:**
- Success: `http://localhost:3000/payment/success`
- Cancel: `http://localhost:3000/payment/cancel`

**Para Producción:**
- Success: `https://tudominio.com/payment/success`
- Cancel: `https://tudominio.com/payment/cancel`

### 6. Configurar URLs en PayPal

1. En el Dashboard de PayPal Developer
2. Ve a **"Apps & Credentials"**
3. Selecciona tu app
4. Desplázate hasta **"App Settings"**
5. Actualiza la **"Return URL"** con tus URLs

## 🧪 Pruebas en Sandbox

### Cuentas de Prueba

En el Dashboard de Desarrolladores, ve a **"Sandbox"** → **"Accounts"** para crear cuentas de prueba:

1. **Cuenta de Comprador (Buyer Account)**
   - Email: `buyer-xxxxx@personal.example.com`
   - Contraseña: Tu contraseña de sandbox

2. **Cuenta de Vendedor (Merchant Account)**
   - Email: `seller-xxxxx@business.example.com`
   - Contraseña: Tu contraseña de sandbox

### Simular un Pago

1. En tu app, haz clic en "Suscribirse"
2. Elige un plan
3. Serás redirigido a PayPal
4. Usa la cuenta de comprador (buyer) para login
5. Confirma el pago
6. Serás redirigido a tu URL de éxito

## 🚀 Pasar a Producción

Cuando estés listo para pasar a producción:

1. En el Dashboard de PayPal Developer
2. Ve a **"Apps & Credentials"**
3. Cambia a la pestaña **"Live"** (en lugar de "Sandbox")
4. Obtén tus credenciales de producción
5. Actualiza tu `.env`:
   ```env
   PAYPAL_MODE=production
   PAYPAL_CLIENT_ID=tu-client-id-produccion
   PAYPAL_CLIENT_SECRET=tu-secret-produccion
   ```

## 📚 Documentación Oficial

- [PayPal Developer Docs](https://developer.paypal.com/docs)
- [Checkout v2 Integration Guide](https://developer.paypal.com/docs/checkout/integrate/)
- [API Reference](https://developer.paypal.com/docs/api/overview/)

## ⚠️ Importante

- **NUNCA** compartas tus credenciales de PayPal
- Usa `.env` para guardar tus credenciales (está en `.gitignore`)
- En desarrollo, siempre usa **Sandbox**
- Prueba los flujos de pago antes de ir a producción

## 🆘 Soporte

Si tienes problemas:
1. Verifica que tus credenciales sean correctas
2. Asegúrate de estar usando Sandbox en desarrollo
3. Revisa los logs del servidor para mensajes de error
4. Consulta la documentación oficial de PayPal
