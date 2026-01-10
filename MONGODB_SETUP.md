# 🗄️ MongoDB Atlas - Configuración Completa

## 📋 Tabla de Contenidos

1. [Crear Cuenta](#crear-cuenta)
2. [Crear Organización](#crear-organización)
3. [Crear Proyecto](#crear-proyecto)
4. [Crear Cluster](#crear-cluster)
5. [Obtener Connection String](#obtener-connection-string)
6. [Verificar Conexión](#verificar-conexión)

---

## 1️⃣ Crear Cuenta

### Paso 1: Ir a MongoDB Atlas

1. Abre: https://www.mongodb.com/cloud/atlas
2. Haz clic en **"Sign Up"** o **"Create an account"**

### Paso 2: Rellenar Formulario

**Información:**
- **Email**: Tu email personal
- **Password**: Contraseña fuerte (mín. 8 caracteres)
- **First Name**: Tu nombre
- **Last Name**: Tu apellido
- **Preferred Language**: Spanish o English

### Paso 3: Verificar Email

1. Revisa tu bandeja de entrada
2. Haz clic en el enlace de verificación
3. Confirma tu email

### Paso 4: Elegir Propósito

Marca las opciones:
- ✅ **"I want to create an application"**
- ✅ **"Data analytics"**

---

## 2️⃣ Crear Organización

### Paso 1: Completar Formulario

En la pantalla "Create your organization":

- **Organization Name**: `EvaStrong`
- **Company Size**: Your company (o la que aplique)

### Paso 2: Crear Organización

Haz clic en **"Create Organization"**

**Resultado esperado:**

```
✅ Organization "EvaStrong" creada correctamente
```

---

## 3️⃣ Crear Proyecto

### Paso 1: Crear Nuevo Proyecto

1. En el dashboard, haz clic en **"+ New Project"**
2. Nombre del Proyecto: `EvaStrong Production`
3. Haz clic en **"Create Project"**

### Paso 2: Agregar Miembro (Opcional)

Puedes añadir colaboradores después.

**Resultado esperado:**

```
✅ Proyecto "EvaStrong Production" creado
```

---

## 4️⃣ Crear Cluster

### Paso 1: Crear Deployment

1. En el proyecto, haz clic en **"Create"**
2. Selecciona **"Create a Deployment"**

### Paso 2: Elegir Tipo de Deployment

**Opciones:**

```
┌─ M0 (FREE) ─────────────────────────┐
│ • 0.5 GB de almacenamiento          │
│ • Perfecto para desarrollo          │
│ • RECOMENDADO para empezar          │
│ • Siempre gratuito                  │
└─────────────────────────────────────┘

┌─ M2 (SHARED) ───────────────────────┐
│ • 2 GB de almacenamiento            │
│ • $9 USD/mes                        │
│ • Para producción ligera            │
└─────────────────────────────────────┘

┌─ M10+ (DEDICATED) ──────────────────┐
│ • Escalable según necesidad         │
│ • $57+ USD/mes                      │
│ • Para aplicaciones grandes         │
└─────────────────────────────────────┘
```

**SELECCIONA: M0 FREE** ✅

### Paso 3: Elegir Proveedor de Cloud

```
Opciones:
• AWS (N. Virginia) - RECOMENDADO
• Google Cloud
• Azure
```

**SELECCIONA: AWS N. Virginia** ✅

### Paso 4: Elegir Nombre del Cluster

```
Nombre: evastrong-cluster
```

### Paso 5: Configuración Adicional

- **Backup**: Deshabilitado (para M0)
- **Disk Auto-Scaling**: Habilitado ✅

### Paso 6: Crear Cluster

Haz clic en **"Create Deployment"**

**Espera 3-5 minutos mientras se crea el cluster...**

```
⏳ Creando cluster...
████████░░░░░░░░░░░░ 50%
```

**Resultado esperado:**

```
✅ Cluster "evastrong-cluster" creado
   Estado: Ready
```

---

## 5️⃣ Obtener Connection String

### Paso 1: Ir a la Sección de Conexión

1. En tu cluster, haz clic en **"Connect"**

### Paso 2: Crear Usuario de Base de Datos

En **"Create a database user"**:

```
Username: evastrong_user
Password: Tu_Contraseña_Fuerte_123!
```

**IMPORTANTE:** Guarda el usuario y contraseña en un lugar seguro

### Paso 3: Agregar tu IP

En **"Add entries to your IP Access List"**:

```
IP Address: [Tu IP o 0.0.0.0/0 para cualquier IP]
Descripción: Development (opcional)
```

**NOTA:** Para desarrollo rápido, puedes usar `0.0.0.0/0` (permite cualquier IP)
**PRODUCCIÓN:** Especifica solo tus IPs

### Paso 4: Obtener Connection String

1. Haz clic en **"Drivers"**
2. Selecciona **"Node.js"** y versión **"4.0 or later"**
3. Copia el connection string:

```
mongodb+srv://<username>:<password>@evastrong-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Paso 5: Reemplazar Credenciales

Reemplaza en el string:

```
ANTES:
mongodb+srv://<username>:<password>@evastrong-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

DESPUÉS:
mongodb+srv://evastrong_user:Tu_Contraseña_Fuerte_123!@evastrong-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 6️⃣ Verificar Conexión

### Opción 1: Desde Node.js Local

```bash
# En tu terminal
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://evastrong_user:Tu_Contraseña_Fuerte_123!@evastrong-cluster.xxxxx.mongodb.net/evastrong?retryWrites=true&w=majority')
  .then(() => console.log('✅ Conexión exitosa!'))
  .catch(err => console.log('❌ Error:', err.message));
"
```

### Opción 2: Usando MongoDB Compass

1. Descarga: https://www.mongodb.com/products/compass
2. Instala y abre
3. Pega el connection string
4. Haz clic en "Connect"

**Resultado esperado:**

```
✅ Conectado a MongoDB Atlas
   Base de datos: evastrong
   Colecciones: (vacío al inicio)
```

### Opción 3: En el Dashboard de MongoDB Atlas

1. Ve a **"Browse Collections"**
2. Debería mostrar tu cluster
3. Si ves datos, ¡conexión exitosa! ✅

---

## 🔑 Configurar en tu Backend

### Paso 1: Actualizar .env.local

```bash
# En evastrong-backend/.env.local

MONGODB_URI=mongodb+srv://evastrong_user:Tu_Contraseña_Fuerte_123!@evastrong-cluster.xxxxx.mongodb.net/evastrong?retryWrites=true&w=majority
```

### Paso 2: Actualizar para Render

Más adelante, cuando despliegues en Render:

1. Ve a tu proyecto en Render
2. Settings → Environment Variables
3. Agrega:

```
MONGODB_URI=mongodb+srv://evastrong_user:Tu_Contraseña_Fuerte_123!@evastrong-cluster.xxxxx.mongodb.net/evastrong?retryWrites=true&w=majority
```

### Paso 3: Iniciar Backend

```bash
npm run dev
```

**Resultado esperado:**

```
✅ MongoDB Conectado
   Host: evastrong-cluster.xxxxx.mongodb.net
   Base de datos: evastrong
```

---

## 📊 MongoDB Atlas Dashboard

Una vez conectado, puedes:

### 📈 Ver Métricas

- **Database**: Espacio usado
- **Network**: Tráfico
- **Performance**: Queries lentos
- **Backups**: Historial (si aplica)

### 🔐 Seguridad

- **Network Access**: Administrar IPs autorizadas
- **Database Users**: Crear/eliminar usuarios
- **Encryption**: Habilitar encriptación

### 📁 Administrar Datos

- **Browse Collections**: Ver colecciones
- **Create Database**: Nueva base de datos
- **Backup**: Configurar backups (pago)

---

## 🆘 Solución de Problemas

### Error: "Connection Timeout"

```
Solución:
1. Verifica tu IP en "IP Access List"
2. Usa 0.0.0.0/0 temporalmente para probar
3. Revisa que el cluster está "Ready"
4. Espera 5 minutos después de crear el cluster
```

### Error: "Authentication Failed"

```
Solución:
1. Verifica el username y password
2. Asegúrate de reemplazar <username> y <password>
3. Si contraseña tiene caracteres especiales, encódifícala:
   ! = %21
   @ = %40
   # = %23
```

### Error: "Database User not found"

```
Solución:
1. Ve a "Database Users"
2. Crea un nuevo usuario
3. Genera una contraseña fuerte
4. Usa la nueva contraseña en el connection string
```

### El cluster tarda mucho

```
Esto es normal:
⏳ Primeros clusters pueden tomar 5-10 minutos
✅ Espera pacientemente
✅ No recargues la página
```

---

## 📋 Checklist de Configuración

- [ ] Cuenta de MongoDB Atlas creada
- [ ] Organización "EvaStrong" creada
- [ ] Proyecto "EvaStrong Production" creado
- [ ] Cluster "evastrong-cluster" creado
- [ ] Usuario "evastrong_user" creado
- [ ] IP agregada a whitelist
- [ ] Connection string copiado
- [ ] Credenciales reemplazadas
- [ ] Conexión verificada
- [ ] .env.local configurado
- [ ] Backend conecta correctamente

---

## 🔒 Mejores Prácticas de Seguridad

### ✅ HACER:

1. ✅ Usar contraseñas fuertes (mín. 12 caracteres)
2. ✅ Especificar IPs en producción
3. ✅ Crear usuarios con permisos limitados
4. ✅ Habilitar autenticación de 2 factores (2FA)
5. ✅ Hacer backups regularmente
6. ✅ Monitorear acceso a la base de datos

### ❌ NO HACER:

1. ❌ Usar 0.0.0.0/0 en producción
2. ❌ Hardcodear credenciales en código
3. ❌ Commitar .env con credenciales
4. ❌ Compartir connection string
5. ❌ Usar contraseñas débiles
6. ❌ Ignorar alertas de seguridad

---

## 📚 Recursos Adicionales

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [Security Best Practices](https://docs.mongodb.com/manual/security/)
- [Troubleshooting](https://docs.atlas.mongodb.com/troubleshoot-connection/)

---

## ✅ Pasos Siguientes

Una vez que MongoDB esté configurado:

1. ✅ MongoDB: **COMPLETADO** (estás aquí)
2. ⏭️ Google OAuth: Ir a `GOOGLE_OAUTH_SETUP.md`
3. ⏭️ Desplegar en Render: Ir a `RENDER_DEPLOYMENT.md`
4. ⏭️ Testing: Verificar endpoints

---

**¡MongoDB Atlas configurado correctamente! 🎉**

Ahora puedes continuar con Google OAuth o desplegar en Render.

¿Necesitas ayuda con el siguiente paso?
