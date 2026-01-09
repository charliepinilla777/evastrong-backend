# 🚀 Eva Strong - Setup Completo (Frontend + Backend)

Guía paso a paso para configurar y desplegar Eva Strong con autenticación OAuth y pagos.

## 📁 Estructura de Proyectos

```
Desktop/
├── EvaStrong/                    # App Flutter (frontend)
│   ├── lib/
│   │   ├── main.dart
│   │   ├── services/
│   │   │   └── api_service.dart  # ← Nuevo
│   │   ├── providers/
│   │   │   ├── auth_provider.dart     # ← Nuevo
│   │   │   └── subscription_provider.dart # ← Nuevo
│   │   └── ...
│   └── pubspec.yaml
│
└── EvaStrong-Backend/            # Backend Node.js (este proyecto)
    ├── server.js
    ├── config/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── package.json
    └── .env
```

## 🛠️ Instalación Paso a Paso

### 1️⃣ BACKEND - Instalación Local

#### 1.1 Instalar MongoDB

**Windows:**
```bash
# Descargar MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Instalar y ejecutar
mongod
```

**Verificar conexión:**
```bash
mongo
> db.version()  # Debe mostrar versión
> exit()
```

#### 1.2 Instalar Node.js

```bash
# Descargar de https://nodejs.org (versión 18+)
# Verificar instalación
node --version
npm --version
```

#### 1.3 Clonar y configurar Backend

```bash
cd C:\Users\Carlos\Desktop\EvaStrong-Backend
npm install
```

#### 1.4 Configurar variables de ambiente

```bash
# Copiar template
copy .env.example .env

# Editar .env con tus valores
# Campos obligatorios:
# - JWT_SECRET (puede ser cualquier string largo)
# - GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET
# - APPLE_* (si usarás Apple)
# - MERCADO_PAGO_ACCESS_TOKEN
```

#### 1.5 Iniciar Backend

```bash
# Desarrollo (auto-reload)
npm run dev

# Producción
npm start
```

✅ Backend en: `http://localhost:5000`

---

### 2️⃣ FRONTEND - Actualizar Flutter

#### 2.1 Agregar dependencias

```bash
cd C:\Users\Carlos\Desktop\EvaStrong

# Agregar http para llamadas API
flutter pub add http

# Agregar provider para state management (si no está)
flutter pub add provider

# Obtener dependencias
flutter pub get
```

#### 2.2 Actualizar pubspec.yaml

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  provider: ^6.0.0
  # ... otras dependencias
```

#### 2.3 Usar los servicios en la app

En `lib/main.dart`, actualizar para usar providers:

```dart
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/subscription_provider.dart';

void main() {
  runApp(const EvaStrongApp());
}

class EvaStrongApp extends StatelessWidget {
  // ...
  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AuthProvider()),
          ChangeNotifierProvider(create: (_) => SubscriptionProvider()),
        ],
        child: const HomeScreen(title: 'Eva Strong'),
      ),
      // ... resto de config
    );
  }
}
```

---

## 🔐 Configurar OAuth

### Google OAuth

1. **Crear proyecto en Google Cloud Console:**
   ```
   https://console.cloud.google.com
   ```

2. **Crear credenciales OAuth 2.0:**
   - Tipo: Web application
   - URIs autorizados:
     - `http://localhost:5000`
     - `http://localhost:5000/auth/google/callback`
   
3. **Copiar a .env:**
   ```
   GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=xxxxx
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   ```

### Apple OAuth

1. **Ir a Apple Developer:**
   ```
   https://developer.apple.com
   ```

2. **Crear certificado y signing key**

3. **Descargar AuthKey.p8 y copiar a:**
   ```
   EvaStrong-Backend/keys/AuthKey.p8
   ```

4. **Actualizar .env:**
   ```
   APPLE_CLIENT_ID=com.evastrong.app
   APPLE_TEAM_ID=xxxxx
   APPLE_KEY_ID=xxxxx
   APPLE_PRIVATE_KEY_PATH=./keys/AuthKey.p8
   ```

---

## 💳 Configurar Mercado Pago

1. **Registrarse en Mercado Pago:**
   ```
   https://www.mercadopago.com.ar
   ```

2. **Obtener credenciales:**
   - Ir a: Cuenta → Configuración → Credenciales
   - Copiar Access Token (sandbox primero para pruebas)

3. **Actualizar .env:**
   ```
   MERCADO_PAGO_ACCESS_TOKEN=APP_xxxxx
   MERCADO_PAGO_PUBLIC_KEY=APP_xxxxx
   ```

4. **Configurar webhook en Mercado Pago:**
   - URL: `http://localhost:5000/payments/webhook`
   - Eventos: `payment.created`, `payment.updated`

---

## 🧪 Testing

### Test Backend con cURL

#### 1. Registro
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Respuesta:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "email": "test@example.com", ... }
}
```

#### 2. Obtener perfil
```bash
curl -X GET http://localhost:5000/users/profile \
  -H "Authorization: Bearer TU_TOKEN"
```

#### 3. Crear preferencia de pago
```bash
curl -X POST http://localhost:5000/payments/create-preference \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "premium",
    "period": "monthly"
  }'
```

### Test Frontend en Emulador

```bash
cd EvaStrong
flutter run
```

- Abrir app
- Ir a Settings
- Probar login/registro
- Probar cambio de plan (si está integrado)

---

## 📱 Integrar en Flutter

### Ejemplo: Pantalla de Login

```dart
class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          return SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.all(20),
              child: Column(
                children: [
                  TextField(
                    controller: _emailController,
                    decoration: InputDecoration(labelText: 'Email'),
                  ),
                  TextField(
                    controller: _passwordController,
                    obscureText: true,
                    decoration: InputDecoration(labelText: 'Contraseña'),
                  ),
                  SizedBox(height: 20),
                  authProvider.isLoading
                      ? CircularProgressIndicator()
                      : ElevatedButton(
                          onPressed: () async {
                            bool success = await authProvider.login(
                              email: _emailController.text,
                              password: _passwordController.text,
                            );
                            if (success) {
                              Navigator.pushReplacementNamed(context, '/home');
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(text: authProvider.error),
                              );
                            }
                          },
                          child: Text('Login'),
                        ),
                  if (authProvider.error != null)
                    Padding(
                      padding: EdgeInsets.only(top: 20),
                      child: Text(
                        authProvider.error!,
                        style: TextStyle(color: Colors.red),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
```

---

## 🌐 Deployment

### Backend en Heroku

```bash
# 1. Crear cuenta en Heroku
# https://www.heroku.com

# 2. Instalar Heroku CLI
npm install -g heroku

# 3. Login
heroku login

# 4. Crear app
heroku create evastrong-api

# 5. Agregar MongoDB Atlas
heroku addons:create mongolab:sandbox

# 6. Configurar variables
heroku config:set JWT_SECRET=tu_secreto_muy_seguro
heroku config:set GOOGLE_CLIENT_ID=xxx
heroku config:set MERCADO_PAGO_ACCESS_TOKEN=xxx

# 7. Desplegar
git push heroku main

# 8. Ver logs
heroku logs --tail
```

### Frontend en Firebase Hosting

```bash
# 1. Instalar Firebase
npm install -g firebase-tools

# 2. Build web
flutter build web

# 3. Deploy
firebase deploy --only hosting
```

### App Store & Google Play

```bash
# Android
flutter build appbundle

# iOS
flutter build ios
```

---

## 📊 Endpoints Disponibles

### Auth
- `POST /auth/register` - Registro
- `POST /auth/login` - Login
- `GET /auth/google` - OAuth Google
- `GET /auth/apple` - OAuth Apple
- `POST /auth/logout` - Logout
- `GET /auth/verify` - Verificar token
- `POST /auth/refresh` - Renovar token

### Users
- `GET /users/profile` - Obtener perfil
- `PUT /users/profile` - Actualizar perfil
- `POST /users/change-password` - Cambiar contraseña
- `GET /users/:userId` - Obtener usuario
- `DELETE /users/account/delete` - Eliminar cuenta

### Payments
- `POST /payments/create-preference` - Crear pago
- `POST /payments/webhook` - Webhook MP
- `GET /payments/history` - Historial
- `GET /payments/:paymentId` - Detalles
- `POST /payments/:paymentId/refund` - Reembolsar

### Subscriptions
- `GET /subscriptions/current` - Actual
- `GET /subscriptions/history` - Historial
- `POST /subscriptions/change-plan` - Cambiar plan
- `POST /subscriptions/cancel` - Cancelar
- `POST /subscriptions/renew` - Renovar

---

## 🐛 Troubleshooting

### "MongoError: connect ECONNREFUSED"
```
❌ MongoDB no está corriendo
✅ Ejecutar: mongod
```

### "Cannot find module 'express'"
```
❌ Dependencias no instaladas
✅ Ejecutar: npm install
```

### "Invalid token"
```
❌ Token expirado o inválido
✅ Renovar token con /auth/refresh
```

### "CORS error"
```
❌ Frontend y backend en puertos diferentes
✅ Verificar FRONTEND_URL en .env
```

---

## ✅ Checklist de Setup

- [ ] MongoDB instalado y corriendo
- [ ] Node.js instalado (v18+)
- [ ] Backend clonado e instalado
- [ ] .env configurado con secretos
- [ ] Google OAuth configurado
- [ ] Mercado Pago configurado
- [ ] Backend corriendo en localhost:5000
- [ ] Flutter con dependencias actualizadas
- [ ] ApiService configurado en Flutter
- [ ] Providers integrados en main.dart
- [ ] Tests básicos pasando
- [ ] App en emulador sin errores

---

## 📞 Contacto y Soporte

Si encuentras problemas:
1. Revisar logs: `npm run dev` (backend) o `flutter run -v` (frontend)
2. Verificar .env tiene todos los valores
3. Asegurar MongoDB está corriendo
4. Probar endpoints con cURL primero

---

**Última actualización:** 2026-01-08  
**Versión:** 1.0.0  
**Estado:** ✅ Producción
