# 🔐 Obtener JWT_SECRET - Paso a Paso (2 minutos)

## 🎯 Objetivo
Generar un secreto seguro para firmar tus JWT tokens.

**Resultado final será algo como:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

## ✅ Lo Bueno de JWT_SECRET

✅ **SÚPER FÁCIL** - Solo 2 comandos
✅ **RÁPIDO** - 2 minutos máximo
✅ **GRATUITO** - No necesitas cuenta en nada
✅ **SEGURO** - Generado aleatoriamente

---

## PASO 1️⃣: Abre Terminal / Command Prompt

### ¿Cómo lo haces?

**En Windows:**
1. Presiona: `Windows + R`
2. Escribe: `cmd`
3. Presiona: `Enter`

```
┌─ WINDOWS ────────────────────────────────┐
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ Windows + R                     │    │
│  │                                 │    │
│  │ Escribe: cmd                    │    │
│  │                                 │    │
│  │ [Aceptar] ← Haz clic           │    │
│  └─────────────────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

**En Mac:**
1. Presiona: `Cmd + Espacio`
2. Escribe: `Terminal`
3. Presiona: `Enter`

```
┌─ MAC ────────────────────────────────────┐
│                                          │
│  Spotlight Search                        │
│                                          │
│  Escribe: Terminal                       │
│                                          │
│  [Terminal] ← Haz clic                  │
│                                          │
└──────────────────────────────────────────┘
```

**En Linux:**
- Presiona: `Ctrl + Alt + T`

```
┌─ LINUX ──────────────────────────────────┐
│                                          │
│  $ _                                     │
│                                          │
│  Terminal abierto                       │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Terminal/Command Prompt abierto

---

## PASO 2️⃣: Verifica que Node.js esté instalado

### ¿Qué haces?

En la terminal, escribe:

```bash
node --version
```

Luego presiona: `Enter`

```
┌─ TERMINAL ───────────────────────────────┐
│                                          │
│  $ node --version                        │
│  v18.17.0                                │
│                                          │
│  $ _                                     │
│                                          │
│  ✅ Node.js está instalado              │
│                                          │
└──────────────────────────────────────────┘
```

### ¿Qué significa?

- Si ves `v18.x.x` o similar: ✅ **Está instalado**
- Si ves `command not found`: ❌ **Necesitas instalar Node.js**

### Si NO está instalado:

1. Ve a: https://nodejs.org
2. Descarga la versión recomendada (LTS)
3. Instala siguiendo el wizard
4. Reinicia tu terminal
5. Intenta `node --version` nuevamente

**✅ Resultado:** Node.js está listo

---

## PASO 3️⃣: Ejecuta el Comando Mágico

### ¿Qué haces?

Copia este comando exactamente:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ¿Cómo lo copias?

Tienes 2 opciones:

**Opción A: Copiar de aquí**
1. Selecciona el comando completo
2. Presiona: `Ctrl + C` (Windows/Linux) o `Cmd + C` (Mac)

**Opción B: Escribirlo manualmente**
1. En la terminal, escribe letra por letra
2. (Es largo pero funciona)

---

## PASO 4️⃣: Pega en Terminal

### ¿Qué haces?

1. En la terminal, haz clic
2. Presiona: `Ctrl + V` (Windows/Linux) o `Cmd + V` (Mac)
3. Debería verse así:

```bash
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```
┌─ TERMINAL ───────────────────────────────────────────┐
│                                                       │
│  $ node -e "console.log(require('crypto')            │
│  .randomBytes(32).toString('hex'))"                  │
│                                                       │
│  _                                                   │
│                                                       │
└───────────────────────────────────────────────────────┘
```

**✅ Resultado:** Comando pegado en terminal

---

## PASO 5️⃣: Presiona Enter

### ¿Qué haces?

Presiona la tecla: `Enter` o `Return`

```bash
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
[ENTER]
```

### ¿Qué sucede?

La terminal ejecuta el comando y **genera un secreto aleatorio**:

```
┌─ TERMINAL ───────────────────────────────┐
│                                          │
│  $ node -e "console.log(require(...)"   │
│                                          │
│  a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6      │
│  q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2      │
│                                          │
│  $ _                                     │
│                                          │
│  ✅ ¡Secreto generado!                 │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Tienes tu JWT_SECRET

---

## PASO 6️⃣: Copia el Secreto Generado

### ¿Qué ves?

Una larga cadena de caracteres (64 caracteres):

```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### ¿Qué haces?

1. Selecciona TODO el secreto (la cadena larga)
2. Presiona: `Ctrl + C` (Windows/Linux) o `Cmd + C` (Mac)
3. Lo copias

```
┌─ SELECCIONAR Y COPIAR ───────────────────┐
│                                          │
│  Haz triple clic para seleccionar:       │
│                                          │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│  a1b2c3d4e5...e1f2                      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│                                          │
│  Luego: Ctrl + C (o Cmd + C en Mac)     │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Tu secreto está copiado

---

## PASO 7️⃣: Abre un Bloc de Notas

### ¿Para qué?

Para guardar temporalmente tu secreto antes de ponerlo en Render.

### ¿Cómo?

**En Windows:**
1. Presiona: `Windows + R`
2. Escribe: `notepad`
3. Presiona: `Enter`

**En Mac:**
1. Abre: Aplicaciones → Utilidades → TextEdit

**En Linux:**
1. Abre: gedit o tu editor de texto

```
┌─ BLOC DE NOTAS ──────────────────────────┐
│                                          │
│  ┌──────────────────────────────────┐   │
│  │                                  │   │
│  │ _                                │   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Bloc de notas abierto

---

## PASO 8️⃣: Pega el Secreto

### ¿Qué haces?

1. En el bloc de notas, haz clic
2. Presiona: `Ctrl + V` (Windows/Linux) o `Cmd + V` (Mac)
3. Debería verse así:

```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

```
┌─ BLOC DE NOTAS ──────────────────────────┐
│                                          │
│  a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6      │
│  q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2      │
│                                          │
│  _                                       │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Secreto guardado temporalmente

---

## PASO 9️⃣: Verifica que sea Correcto

### ¿Qué validar?

```
✅ Comienza con letras/números
✅ Tiene aproximadamente 64 caracteres
✅ Solo contiene: a-z, 0-9 (sin símbolos especiales)
✅ No tiene espacios
```

**Ejemplo CORRECTO:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Ejemplo INCORRECTO (¡No copies esto!):**
```
a1b2c3d4 e5f6g7h8  ← Tiene espacios ❌
```

---

## PASO 🔟: Copia para Usar en Render

### ¿Qué haces?

1. En el bloc de notas, selecciona TODO el secreto
2. Presiona: `Ctrl + C` (o `Cmd + C` en Mac)
3. Tienes el secreto en el portapapeles

```
┌─ BLOC DE NOTAS ──────────────────────────┐
│                                          │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│  a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6      │
│  q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│                                          │
│  Ctrl + C (o Cmd + C)                   │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Secreto copiado

---

## PASO 1️⃣1️⃣: Ve a Render

### ¿Qué haces?

1. Abre tu navegador
2. Ve a: https://render.com/dashboard
3. Selecciona tu proyecto: `evastrong-backend`
4. Haz clic en: **"Settings"**

```
┌─ RENDER DASHBOARD ───────────────────────┐
│                                          │
│  Mis Servicios                           │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ evastrong-backend                │   │
│  │                                  │   │
│  │ [Settings] ← AQUÍ                │   │
│  └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Estás en Settings

---

## PASO 1️⃣2️⃣: Ve a Environment Variables

### ¿Qué haces?

En Settings:
1. Busca: **"Environment Variables"**
2. Haz clic en esa sección

```
┌─ SETTINGS ───────────────────────────────┐
│                                          │
│  General                                 │
│  Deployments                             │
│  Logs                                    │
│  Environment Variables ← AQUÍ            │
│  Integrations                            │
│                                          │
│  [Haz clic aquí]                        │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Ves la lista de variables

---

## PASO 1️⃣3️⃣: Busca o Crea JWT_SECRET

### ¿Qué haces?

1. Busca en la lista: `JWT_SECRET`
2. Si ya existe: haz clic en el icono de edición (lápiz)
3. Si NO existe: haz clic en **"Add Environment Variable"**

```
┌─ ENVIRONMENT VARIABLES ──────────────────┐
│                                          │
│  Name                    Value            │
│  ─────────────────────────────────────   │
│  NODE_ENV                production       │
│  PORT                    5000             │
│  MONGODB_URI             mongodb+srv://   │
│  JWT_SECRET              [vacío o valor]  │
│                          ↑ AQUÍ           │
│                                          │
│  [+ Add Environment Variable]            │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Estás editando o creando JWT_SECRET

---

## PASO 1️⃣4️⃣: Ingresa el Valor

### ¿Qué haces?

En el campo "Value":

1. Haz clic en el campo
2. Borra lo que haya (si es que hay algo)
3. Presiona: `Ctrl + V` (o `Cmd + V` en Mac)
4. Se pegará tu secreto

```
┌─ EDITAR VARIABLE ────────────────────────┐
│                                          │
│  Name:  JWT_SECRET                       │
│                                          │
│  Value: [                              ] │
│         a1b2c3d4e5f6g7h8i9j0k1l2m3n4  │
│         o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2 │
│                                          │
│  [Save]                                  │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** El valor está pegado

---

## PASO 1️⃣5️⃣: Guarda

### ¿Qué haces?

Haz clic en: **"Save"** o **"Update"**

```
┌─ GUARDAR ────────────────────────────────┐
│                                          │
│  Value: [a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...]
│                                          │
│  [Cancel]  [Save] ← AQUÍ                │
│                                          │
└──────────────────────────────────────────┘
```

**✅ Resultado:** Variable guardada

---

## PASO 1️⃣6️⃣: Redeploy

### ¿Qué haces?

Para que los cambios se apliquen:

1. Ve a: **"Deployments"**
2. Haz clic en: **"Trigger Deploy"** o **"Redeploy"**
3. Espera a que se complete (2-3 minutos)

```
┌─ DEPLOYMENTS ────────────────────────────┐
│                                          │
│  Historial de Deployments                │
│                                          │
│  Latest Deployment: 5 min ago ✅         │
│                                          │
│  [Trigger Deploy] ← AQUÍ                │
│                                          │
│  Status: Building... (En progreso)      │
│                                          │
└──────────────────────────────────────────┘
```

**⏳ Espera:** El deploy tarda 2-3 minutos

**✅ Resultado:** Deployment completado

---

## PASO 1️⃣7️⃣: Verifica en Logs

### ¿Qué haces?

Para verificar que JWT_SECRET se aplicó correctamente:

1. Ve a: **"Logs"**
2. Debería ver algo como:

```
✅ Servidor escuchando en puerto 5000
✅ JWT Secret configurado
✅ Autenticación lista
```

Si ves esto: **¡ÉXITO!** ✅

---

## ✅ RESULTADO FINAL

Tu **JWT_SECRET** está configurado en Render.

**Lo que sucedió:**

```
1. Generaste un secreto aleatorio en terminal
2. Lo guardaste temporalmente en bloc de notas
3. Lo pegaste en Render Environment Variables
4. Hiciste Redeploy
5. Se aplicó correctamente
```

---

## 🆘 PROBLEMAS COMUNES

### Error: "node: command not found"

```
Causa: Node.js no está instalado
Solución:
1. Ve a: https://nodejs.org
2. Instala la versión LTS
3. Reinicia terminal
4. Intenta el comando nuevamente
```

### Error: "Syntax error"

```
Causa: Copiaste mal el comando
Solución:
1. Copia de nuevo muy cuidadosamente
2. Asegúrate de incluir las comillas (")
3. Prueba nuevamente
```

### El secreto no se aplicó en Render

```
Causa: No hiciste Redeploy
Solución:
1. Ve a Deployments
2. Haz clic en "Trigger Deploy"
3. Espera a que se complete
```

---

## ✅ CHECKLIST

- [ ] Abriste Terminal/Command Prompt
- [ ] Verificaste que Node.js está instalado
- [ ] Copiaste el comando de crypto
- [ ] Lo pegaste en terminal
- [ ] Presionaste Enter
- [ ] Obtuviste un secreto (64 caracteres)
- [ ] Copiaste el secreto
- [ ] Lo guardaste en bloc de notas
- [ ] Verificaste que sea correcto
- [ ] Lo pegaste en Render
- [ ] Hiciste Redeploy
- [ ] Verificaste en logs que se aplicó

---

## 🎉 ¡LISTO!

Ya tienes tu **JWT_SECRET** configurado.

**Siguiente paso:** ¿Quieres configurar Google OAuth o Mercado Pago?

Escribe: `2` (Google OAuth) o `3` (Mercado Pago)
