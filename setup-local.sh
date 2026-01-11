#!/bin/bash

# Script de Configuración Local para EvaStrong Backend
# Uso: bash setup-local.sh

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  🚀 Setup Local - EvaStrong Backend       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado. Instálalo desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"
echo ""

# Generar JWT_SECRET
echo "🔑 Generando JWT_SECRET..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo "✅ JWT_SECRET generado"
echo ""

# Crear .env.local si no existe
if [ -f .env.local ]; then
    echo "⚠️  .env.local ya existe. No sobrescribiendo..."
else
    echo "📝 Creando .env.local..."
    cat > .env.local << EOF
# ========== SERVER ==========
PORT=5000
NODE_ENV=development

# ========== DATABASE ==========
# Para usar MongoDB local: mongodb://localhost:27017/evastrong
# Para usar MongoDB Atlas: mongodb+srv://usuario:password@cluster.mongodb.net/evastrong
MONGODB_URI=mongodb://localhost:27017/evastrong

# ========== JWT ==========
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=7d

# ========== GOOGLE OAUTH (opcional) ==========
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# ========== FRONTEND URLs ==========
FRONTEND_URL=http://localhost:3000

# ========== LOGS ==========
LOG_LEVEL=debug
EOF
    echo "✅ .env.local creado"
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✨ Setup completado!                     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

echo "📝 Archivo .env.local creado con:"
echo "   ✅ PORT: 5000"
echo "   ✅ NODE_ENV: development"
echo "   ✅ MONGODB_URI: mongodb://localhost:27017/evastrong"
echo "   ✅ JWT_SECRET: Generado aleatoriamente"
echo ""

echo "🔍 Validando configuración..."
npm run validate

echo ""
echo "🚀 Próximos pasos:"
echo "   1. Asegúrate que MongoDB esté corriendo:"
echo "      - En Windows: mongod"
echo "      - En Mac/Linux: mongod"
echo "   2. Inicia el servidor:"
echo "      npm start"
echo "   3. Prueba el health check:"
echo "      curl http://localhost:5000/health"
echo ""
