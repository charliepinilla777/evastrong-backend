# ⚡ Quick Start - EvaStrong Backend

## 🚀 Deploy en 5 Minutos

### Opción 1: Render (RECOMENDADO - Gratuito)

```bash
# 1. Ve a https://render.com y crea cuenta

# 2. Conecta tu repositorio GitHub

# 3. Agrega estas variables de entorno:
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/evastrong
JWT_SECRET=tu_secreto_aleatorio_muy_largo
GOOGLE_CLIENT_ID=tu_google_id
GOOGLE_CLIENT_SECRET=tu_google_secret
MERCADO_PAGO_ACCESS_TOKEN=tu_token_mp
FRONTEND_URL=https://evastrong.com

# 4. Haz clic en Deploy
# ✅ Tu backend estará en: https://evastrong-backend.onrender.com
```

### Opción 2: Local Development

```bash
# 1. Clonar
git clone https://github.com/charliepinilla777/evastrong-backend.git
cd evastrong-backend

# 2. Instalar
npm install

# 3. Configurar
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Iniciar
npm run dev

# ✅ Backend corriendo en: http://localhost:5000
```

---

## 🔑 Credenciales Necesarias

| Servicio | Obtener En | Necesario |
|----------|-----------|----------|
| MongoDB | mongodb.com/atlas | ✅ Sí |
| Google OAuth | console.cloud.google.com | ✅ Sí |
| Mercado Pago | mercadopago.com/developers | ⚠️ Opcional |
| JWT Secret | Generar random | ✅ Sí |

---

## ✅ Verificación

```bash
# Health check
curl https://evastrong-backend.onrender.com/health

# Respuesta esperada:
# {"status":"OK","timestamp":"2024-01-10T12:34:56.789Z"}
```

---

## 📚 Documentación Completa

Ver: `RENDER_DEPLOYMENT.md` y `BACKEND_SETUP.md`

---

**¡Listo! Tu backend está deployado 🎉**
