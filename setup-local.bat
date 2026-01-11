@echo off
REM Script de Configuración Local para EvaStrong Backend (Windows)
REM Uso: setup-local.bat

echo.
echo ╔════════════════════════════════════════════╗
echo ║  🚀 Setup Local - EvaStrong Backend       ║
echo ╚════════════════════════════════════════════╝
echo.

REM Verificar que Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js no encontrado. Instálalo desde https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js encontrado: %NODE_VERSION%
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

if %ERRORLEVEL% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas
echo.

REM Generar JWT_SECRET
echo 🔑 Generando JWT_SECRET...
for /f "tokens=*" %%i in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_SECRET=%%i

echo ✅ JWT_SECRET generado
echo.

REM Crear .env.local si no existe
if exist .env.local (
    echo ⚠️  .env.local ya existe. No sobrescribiendo...
) else (
    echo 📝 Creando .env.local...
    (
        echo # ========== SERVER ==========
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # ========== DATABASE ==========
        echo # Para usar MongoDB local: mongodb://localhost:27017/evastrong
        echo # Para usar MongoDB Atlas: mongodb+srv://usuario:password@cluster.mongodb.net/evastrong
        echo MONGODB_URI=mongodb://localhost:27017/evastrong
        echo.
        echo # ========== JWT ==========
        echo JWT_SECRET=%JWT_SECRET%
        echo JWT_EXPIRE=7d
        echo.
        echo # ========== GOOGLE OAUTH (opcional) ==========
        echo GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
        echo GOOGLE_CLIENT_SECRET=tu_google_client_secret
        echo GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
        echo.
        echo # ========== FRONTEND URLs ==========
        echo FRONTEND_URL=http://localhost:3000
        echo.
        echo # ========== LOGS ==========
        echo LOG_LEVEL=debug
    ) > .env.local
    echo ✅ .env.local creado
)

echo.
echo ╔════════════════════════════════════════════╗
echo ║  ✨ Setup completado!                     ║
echo ╚════════════════════════════════════════════╝
echo.

echo 📝 Archivo .env.local creado con:
echo    ✅ PORT: 5000
echo    ✅ NODE_ENV: development
echo    ✅ MONGODB_URI: mongodb://localhost:27017/evastrong
echo    ✅ JWT_SECRET: Generado aleatoriamente
echo.

echo 🔍 Validando configuración...
call npm run validate

echo.
echo 🚀 Próximos pasos:
echo    1. Asegúrate que MongoDB esté corriendo (si usas local):
echo       - Abre cmd y ejecuta: mongod
echo    2. Inicia el servidor en otra terminal:
echo       npm start
echo    3. Prueba el health check en otra terminal:
echo       curl http://localhost:5000/health
echo.
pause
