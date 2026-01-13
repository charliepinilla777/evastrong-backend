# 🔧 SOLUCIÓN FINAL: Configurar MongoDB en Render

## ⚠️ PROBLEMA

Render rechaza la connection string diciendo que no comienza con `mongodb://` o `mongodb+srv://`.

Esto sucede cuando:
1. La variable está vacía o corrupta
2. Tiene saltos de línea o espacios extras
3. Se cortó durante el copy-paste

---

## ✅ SOLUCIÓN PASO A PASO

### Paso 1: ELIMINAR la variable corrupta

1. Ve a https://dashboard.render.com
2. Selecciona `evastrong-backend`
3. Ve a **Environment**
4. Busca `MONGODB_URI`
5. **Haz clic en el icono de papelera (🗑️) para ELIMINARLA**
6. Haz clic en **Save**

---

### Paso 2: CREAR la variable desde cero

1. En **Environment**, haz clic en **Add Environment Variable**
2. **Name:** `MONGODB_URI`
3. **Value:** Copia EXACTAMENTE esto (TODO EN UNA LÍNEA):

```
mongodb+srv://evastrong_user:Ducati2027@evastrong-cluster.a1b2c3d4.mongodb.net/evastrong?retryWrites=true&w=majority
```

**IMPORTANTE:**
- ✅ TODO debe estar en UNA SOLA LÍNEA (sin enter, sin saltos)
- ✅ Comienza con `mongodb+srv://`
- ✅ Reemplaza `Ducati2027` con tu contraseña actual
- ✅ Reemplaza `a1b2c3d4` con tu connection string ID real

4. Haz clic en **Add**
5. Haz clic en **Save**

---

### Paso 3: Agregar otra variable importante

Si no tienes `JWT_SECRET`, agrégala también:

1. Haz clic en **Add Environment Variable**
2. **Name:** `JWT_SECRET`
3. **Value:** Genera una:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Luego pega el resultado
4. Haz clic en **Add**
5. Haz clic en **Save**

---

### Paso 4: Redeploy

1. Ve a **Settings**
2. Haz clic en **Clear Build Cache**
3. Haz clic en **Redeploy latest commit**
4. Espera a que termine (3-5 minutos)

---

## ✅ Verificar que Funciona

En los logs deberías ver:

```
✅ MongoDB Conectado
   Host: evastrong-cluster.a1b2c3d4.mongodb.net
   Base de datos: evastrong
   Usuario: evastrong_user
```

Si ves esto, ¡funcionó! 🎉

---

## 🆘 Si SIGUE sin funcionar

### Opción 1: Usar MongoDB Local (Solo para desarrollo)

Si quieres probar primero en local:

En tu `.env` LOCAL:
```
MONGODB_URI=mongodb://localhost:27017/evastrong
```

Necesitas tener MongoDB corriendo localmente.

### Opción 2: Verificar la contraseña

1. Ve a MongoDB Atlas → Database Access
2. Edita `evastrong_user`
3. Haz clic en **Edit Password**
4. Copia la nueva connection string desde aquí directamente
5. Actualiza en Render

### Opción 3: Crear usuario nuevo de prueba

1. MongoDB Atlas → Database Access
2. Add Database User
3. Username: `testuser`
4. Password: `Test123456` (simple, sin caracteres especiales)
5. Permisos: `readWriteAnyDatabase`
6. Copia la connection string
7. Usa esa en Render para verificar que funciona

---

## 📞 Resumen Rápido

| Paso | Acción |
|------|--------|
| 1 | ELIMINAR `MONGODB_URI` antigua en Render |
| 2 | CREAR variable nueva `MONGODB_URI` |
| 3 | Agregar `JWT_SECRET` si no existe |
| 4 | Clear Build Cache en Render |
| 5 | Redeploy |
| 6 | Verificar logs |

---

## 💡 Dato Importante

La connection string que estás usando:

```
mongodb+srv://evastrong_user:Ducati2027@evastrong-cluster.a1b2c3d4.mongodb.net/evastrong?retryWrites=true&w=majority
```

Es correcta, pero asegúrate que:
- ✅ `Ducati2027` sea tu contraseña ACTUAL en MongoDB Atlas
- ✅ `a1b2c3d4` sea tu connection string ID REAL (no placeholder)
- ✅ TODO esté en una línea (sin saltos)

