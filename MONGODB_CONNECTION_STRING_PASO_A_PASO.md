# 🗄️ Obtener MONGODB_URI - Paso a Paso Visual

## 🎯 Objetivo
Obtener tu connection string que se verá así:
```
mongodb+srv://evastrong_user:MyPassword123@evastrong-cluster.a1b2c3.mongodb.net/evastrong?retryWrites=true&w=majority
```

---

## PASO 1️⃣: Abre MongoDB Atlas

### ¿Dónde?
Ve a: **https://www.mongodb.com/cloud/atlas**

### ¿Qué ves?
Una página con un botón grande que dice "Sign In" o "Create an account"

### ¿Qué haces?
- Si YA tienes cuenta: Haz clic en **"Sign In"** e inicia sesión
- Si NO tienes cuenta: Ya deberías haberla creado en el paso anterior

```
┌─ PANTALLA MONGODB ATLAS ─────────────────────────────┐
│                                                        │
│  🌍 mongodb.com/cloud/atlas                         │
│                                                        │
│  ┌──────────────────────────────────┐               │
│  │ Sign In       Create an account   │               │
│  └──────────────────────────────────┘               │
│                                                        │
│  Email: [tu_email@gmail.com]                         │
│  Password: [tu_contraseña]                           │
│                                                        │
│  [Inicia sesión]                                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**✅ Resultado:** Estás en el dashboard de MongoDB Atlas

---

## PASO 2️⃣: Selecciona tu Proyecto

### ¿Qué ves después de iniciar sesión?

La pantalla mostrará tus proyectos. Deberías ver:
- Proyecto: **"EvaStrong Production"** (o el que creaste)

### ¿Qué haces?

Haz clic en el proyecto **"EvaStrong Production"**

```
┌─ DASHBOARD MONGODB ──────────────────────────────────┐
│                                                        │
│  📁 Mis Proyectos                                    │
│                                                        │
│  ┌────────────────────────────────────────┐          │
│  │ 📦 EvaStrong Production                │          │
│  │                                        │          │
│  │ Cluster: Ready ✅                     │ ← AQUÍ   │
│  │                                        │          │
│  │ [Haz clic aquí]                       │          │
│  └────────────────────────────────────────┘          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**✅ Resultado:** Entras al proyecto

---

## PASO 3️⃣: Ve a tu Cluster

### ¿Qué ves?

Dentro del proyecto verás tu cluster:
- **Nombre:** evastrong-cluster
- **Estado:** Ready (en verde ✅)

### ¿Qué haces?

Busca un botón que diga **"Connect"** cerca del cluster

```
┌─ PROYECTO EVASTRONG ─────────────────────────────────┐
│                                                        │
│  Clusters                                            │
│                                                        │
│  ┌────────────────────────────────────────────┐      │
│  │ 📦 evastrong-cluster                       │      │
│  │                                            │      │
│  │ Estado: Ready ✅                          │      │
│  │                                            │      │
│  │ ┌──────────┐  ┌──────────┐  ┌────────┐   │      │
│  │ │ Browse   │  │ Metrics  │  │Connect │   │      │
│  │ └──────────┘  └──────────┘  └────────┘   │      │
│  │                              ↑ AQUÍ       │      │
│  └────────────────────────────────────────────┘      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

Haz clic en el botón **"Connect"**

**✅ Resultado:** Se abre un popup con opciones de conexión

---

## PASO 4️⃣: Elige "Drivers"

### ¿Qué ves después de hacer clic en Connect?

Un popup con varias opciones:
- Connect with MongoDB Compass
- Connect your application
- Connect with the mongo shell
- Connect with Drivers ← **ESTE**

### ¿Qué haces?

Haz clic en **"Drivers"** (drivers, no Compass)

```
┌─ POPUP CONNECT ───────────────────────────────────────┐
│                                                        │
│  Conectar a evastrong-cluster                        │
│                                                        │
│  Selecciona cómo quieres conectarte:                 │
│                                                        │
│  [ ] MongoDB Compass                                 │
│  [ ] mongosh                                         │
│  [ ] Drivers ← SELECCIONA ESTE                       │
│  [ ] Kubernetes                                      │
│                                                        │
│  [Si haces clic en Drivers...]                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**✅ Resultado:** Se abre la pantalla de Drivers

---

## PASO 5️⃣: Selecciona Node.js

### ¿Qué ves?

Una pantalla que te pide elegir tu lenguaje:

```
Selecciona tu lenguaje:

[ ] Python
[ ] Node.js ← AQUÍ
[ ] Go
[ ] Java
[ ] C#
[ ] Ruby
```

### ¿Qué haces?

1. Busca **"Node.js"**
2. Haz clic en él

**✅ Resultado:** Te muestra la versión

---

## PASO 6️⃣: Selecciona Versión 4.0 o Later

### ¿Qué ves?

```
Selecciona la versión del Driver:

[ ] 3.x (legacy)
[✓] 4.0 or later ← YA ESTÁ SELECCIONADO
```

### ¿Qué haces?

No hagas nada, ya debería estar seleccionado. Continúa.

**✅ Resultado:** Te muestra el código de conexión

---

## PASO 7️⃣: Copia la Connection String

### ¿Qué ves?

```
┌──────────────────────────────────────────────────────┐
│ const { MongoClient } = require("mongodb");           │
│                                                      │
│ const uri =                                          │
│ "mongodb+srv://<username>:<password>@evastrong-     │
│  cluster.a1b2c3.mongodb.net/?retryWrites=true&w=    │
│  majority";                                          │
│                                                      │
│ const client = new MongoClient(uri);               │
│                                                      │
│ [COPY] ← BOTÓN PARA COPIAR                          │
└──────────────────────────────────────────────────────┘
```

### ¿Qué haces?

Haz clic en el botón **"COPY"** (o copia manualmente el string)

**Lo que copias será algo como:**
```
mongodb+srv://<username>:<password>@evastrong-cluster.a1b2c3.mongodb.net/?retryWrites=true&w=majority
```

**✅ Resultado:** Tienes el connection string en tu portapapeles

---

## PASO 8️⃣: Abre un Bloc de Notas

### ¿Qué haces?

1. Abre **Notepad** (bloc de notas) o un editor de texto
2. Pega lo que copiaste:

```
mongodb+srv://<username>:<password>@evastrong-cluster.a1b2c3.mongodb.net/?retryWrites=true&w=majority
```

**✅ Resultado:** Tienes el string en tu editor

---

## PASO 9️⃣: Reemplaza `<username>`

### ¿Qué necesitas hacer?

Reemplazar la parte `<username>` con tu usuario real de BD.

### ¿Cuál es tu usuario?

Recordar que cuando creaste la BD en MongoDB, pusiste:
- **Username:** `evastrong_user`
- **Password:** La contraseña que pusiste

### ¿Cómo lo reemplazas?

Busca en el string: `<username>`
Reemplaza por: `evastrong_user`

**ANTES:**
```
mongodb+srv://<username>:<password>@evastrong-cluster.a1b2c3.mongodb.net/?retryWrites=true&w=majority
```

**DESPUÉS:**
```
mongodb+srv://evastrong_user:<password>@evastrong-cluster.a1b2c3.mongodb.net/?retryWrites=true&w=majority
```

**✅ Resultado:** El username está reemplazado

---

## PASO 🔟: Reemplaza `<password>`

### ¿Qué necesitas hacer?

Reemplazar la parte `<password>` con tu contraseña real.

### ¿Cuál es tu contraseña?

La contraseña que pusiste cuando creaste el usuario en MongoDB.

**Ejemplo:** `MyPassword123!`

### ¿Cómo lo reemplazas?

Busca en el string: `<password>`
Reemplaza por: Tu contraseña real

**ANTES:**
```
mongodb+srv://evastrong_user:<password>@evastrong-cluster.a1b2c3.mongodb.net/?retryWrites=true&w=majority
```

**DESPUÉS:**
```
mongodb+srv://evastrong_user:MyPassword123!@evastrong-cluster.a1b2c3.mongodb.net/?retryWrites=true&w=majority
```

### ⚠️ IMPORTANTE - Caracteres Especiales

Si tu contraseña tiene caracteres especiales como `!@#$%`, necesitas codificarlos:

```
! = %21
@ = %40
# = %23
$ = %24
% = %25
```

**Ejemplo:**
- Contraseña real: `Pass@123!`
- En el string: `Pass%40123%21`

**✅ Resultado:** La contraseña está reemplazada

---

## PASO 1️⃣1️⃣: Verifica que sea correcto

### Tu string final debería verse así:

```
mongodb+srv://evastrong_user:MyPassword123@evastrong-cluster.a1b2c3.mongodb.net/?retryWrites=true&w=majority
```

### ¿Qué validar?

✅ Comienza con: `mongodb+srv://`
✅ Tiene tu usuario: `evastrong_user`
✅ Tiene tu contraseña: `MyPassword123`
✅ Tiene tu cluster: `evastrong-cluster.a1b2c3`
✅ Tiene el nombre de BD: `/` (si no ve `/evastrong`, agrégalo)
✅ Termina con: `?retryWrites=true&w=majority`

---

## PASO 1️⃣2️⃣: Agregar Nombre de Base de Datos (Importante)

### ¿Qué es?

MongoDB necesita saber a qué base de datos conectarse.

### ¿Cómo verificar?

En el string, busca la parte: `mongodb.net/`

**Si ves:**
```
mongodb.net/?retryWrites=true
```

**Debe ser:**
```
mongodb.net/evastrong?retryWrites=true
```

### ¿Cómo lo haces?

En tu editor de texto:
1. Busca: `mongodb.net/`
2. Reemplaza por: `mongodb.net/evastrong?`

**ANTES:**
```
mongodb+srv://evastrong_user:MyPassword123@evastrong-cluster.a1b2c3.mongodb.net/?retryWrites=true&w=majority
```

**DESPUÉS:**
```
mongodb+srv://evastrong_user:MyPassword123@evastrong-cluster.a1b2c3.mongodb.net/evastrong?retryWrites=true&w=majority
```

**✅ Resultado:** Ahora tiene el nombre de BD correctamente

---

## ✅ RESULTADO FINAL

Tu MONGODB_URI completa y lista para usar:

```
mongodb+srv://evastrong_user:MyPassword123@evastrong-cluster.a1b2c3.mongodb.net/evastrong?retryWrites=true&w=majority
```

Copia este string completo.

---

## PASO 1️⃣3️⃣: Copia para Usar en Render

### ¿Qué haces?

1. Copia toda la string (Ctrl+C o Cmd+C)
2. Ve a: https://render.com/dashboard
3. Selecciona tu proyecto: `evastrong-backend`
4. Ve a: Settings → Environment Variables
5. Busca o crea: `MONGODB_URI`
6. Pega el valor completo en el campo "Value"
7. Haz clic en "Save"

```
┌─ RENDER ENVIRONMENT VARIABLES ──────────────────────┐
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Name: MONGODB_URI                            │   │
│  │ Value: mongodb+srv://evastrong_user:...@..  │   │
│  │                                              │   │
│  │ [Save]                                       │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🧪 VERIFICACIÓN FINAL

### ¿Cómo saber si es correcto?

1. Ve a Render
2. Haz clic en "Redeploy"
3. Espera a que se complete
4. Ve a "Logs"
5. Busca líneas como:

```
✅ MongoDB Conectado
   Host: evastrong-cluster.a1b2c3.mongodb.net
   Base de datos: evastrong
```

Si ves estas líneas, ¡**ÉXITO**! ✅

---

## 🆘 ERRORES COMUNES

### Error: "Authentication failed"

```
Causa: Usuario o contraseña incorrectos
Solución:
1. Verifica que copiaste el usuario correcto
2. Verifica que copiaste la contraseña correcta
3. Asegúrate de reemplazar los caracteres especiales
```

### Error: "Connection timeout"

```
Causa: Cluster no está listo o IP no está en whitelist
Solución:
1. Verifica que el cluster está "Ready" en MongoDB
2. Ve a Security → Network Access
3. Agrega 0.0.0.0/0 para permitir cualquier IP
```

### Error: "ENOTFOUND"

```
Causa: DNS no puede resolver el servidor
Solución:
1. Verifica que copiaste correctamente el nombre del cluster
2. Reinicia el deploy en Render
3. Espera 5 minutos
```

---

## ✅ CHECKLIST

- [ ] Abriste MongoDB Atlas
- [ ] Iniciaste sesión
- [ ] Seleccionaste tu proyecto
- [ ] Hiciste clic en "Connect"
- [ ] Seleccionaste "Drivers"
- [ ] Seleccionaste "Node.js"
- [ ] Copiaste el connection string
- [ ] Reemplazaste `<username>` con tu usuario
- [ ] Reemplazaste `<password>` con tu contraseña
- [ ] Agregaste el nombre de la BD (`/evastrong`)
- [ ] Copiaste el string final
- [ ] Lo pegaste en Render
- [ ] Hiciste "Redeploy"
- [ ] Verificaste en los logs que conectó

---

## 🎉 ¡LISTO!

Ya tienes tu **MONGODB_URI** configurada en Render.

**Siguiente paso:** ¿Quieres configurar JWT_SECRET, Google OAuth, o Mercado Pago?
