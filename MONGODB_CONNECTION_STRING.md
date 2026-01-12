# 🔑 Tu Connection String MongoDB

## ✅ Información Confirmada

- **Usuario:** `evastrong_user`
- **Contraseña:** `[Tu contraseña segura - NO HAGAS COMMIT]`
- **Cluster:** `evastrong-cluster`
- **Base de datos:** `evastrong`

---

## 📋 FORMATO DE CONNECTION STRING

```
mongodb+srv://evastrong_user:[TU_CONTRASEÑA]@evastrong-cluster.[XXXXX].mongodb.net/evastrong?retryWrites=true&w=majority
```

⚠️ **IMPORTANTE:** 
- Reemplaza `[TU_CONTRASEÑA]` con tu contraseña REAL (solo en Render, NUNCA en el repositorio)
- Reemplaza `[XXXXX]` con tu connection string ID
- **NUNCA hagas commit de contraseñas reales en este archivo**

---

## 📍 ¿Cómo obtener tu connection string completa?

### Opción 1: Copiar Directamente de MongoDB Atlas (RECOMENDADO)

1. Ve a https://cloud.mongodb.com
2. Ve a **Deployment** → **Clusters**
3. Haz clic en el botón **Connect** (en tu cluster `evastrong-cluster`)
4. Selecciona **Drivers**
5. Elige **Node.js** como driver
6. Verás una connection string como:
   ```
   mongodb+srv://evastrong_user:<password>@evastrong-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Reemplaza `<password>` con tu contraseña actual**
8. **Agrega `/evastrong` antes del `?`** para quedar así:
   ```
   mongodb+srv://evastrong_user:[TU_CONTRASEÑA]@evastrong-cluster.xxxxx.mongodb.net/evastrong?retryWrites=true&w=majority
   ```

### Opción 2: Construirla Manualmente

Necesitas encontrar tu connection string ID (el `xxxxx`):

1. Ve a MongoDB Atlas → Deployment → Clusters
2. Haz clic en **Connect**
3. Busca donde dice: `evastrong-cluster.xxxxx.mongodb.net`
4. Copia ese `xxxxx`
5. Ahora tienes:
   ```
   mongodb+srv://evastrong_user:[TU_CONTRASEÑA]@evastrong-cluster.XXXXX.mongodb.net/evastrong?retryWrites=true&w=majority
   ```

---

## 🚀 Actualizar en Render

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio `evastrong-backend`
3. Ve a **Environment**
4. Busca la variable `MONGODB_URI`
5. **ELIMINA la anterior completamente**
6. **CREA una NUEVA variable** (o reemplaza):
   - **Nombre:** `MONGODB_URI`
   - **Valor:** Tu connection string completa (con el xxxxx reemplazado)
   
   Ejemplo completo:
   ```
   mongodb+srv://evastrong_user:Ducati2026@evastrong-cluster.a1b2c3d4.mongodb.net/evastrong?retryWrites=true&w=majority
   ```

7. Haz clic en **Save**

---

## 🔄 Redeploy en Render

1. Ve a **Settings** de tu servicio
2. Haz clic en **Clear Build Cache**
3. Haz clic en **Redeploy latest commit**
4. Espera a que termine (verás logs en tiempo real)

---

## ✅ Verificar que Funciona

En los logs de Render deberías ver:

```
✅ MongoDB Conectado
   Host: evastrong-cluster.xxxxx.mongodb.net
   Base de datos: evastrong
   Usuario: evastrong_user
```

Si ves esto, ¡está funcionando! 🎉

---

## ❌ Si sigue sin funcionar

### Verificar estos puntos:

1. **¿El `xxxxx` fue reemplazado?**
   - La URL debe mostrar algo como `evastrong-cluster.a1b2c3d4.mongodb.net`
   - NO debe tener literal "xxxxx"

2. **¿La contraseña es exacta?**
   - Debe ser: `Ducati2026` (con mayúscula D)
   - Sin espacios antes o después

3. **¿Network Access permite Render?**
   - Ve a Security → Network Access
   - Debe haber una entrada con `0.0.0.0/0` (acceso desde cualquier lugar)

4. **¿El cluster está activo?**
   - Ve a Deployment → Clusters
   - El cluster debe mostrar badge verde ✅

5. **¿Limpiaste el cache en Render?**
   - Settings → Clear Build Cache → Redeploy

---

## 💬 Ejemplo Completo

Aquí hay un ejemplo con formato correcto (con placeholder de contraseña):

```
mongodb+srv://evastrong_user:[TU_CONTRASEÑA_AQUI]@evastrong-cluster.a1b2c3d4e5f6g7h8.mongodb.net/evastrong?retryWrites=true&w=majority
```

Tu connection string será igual pero:
- Reemplaza `[TU_CONTRASEÑA_AQUI]` con tu contraseña real
- El `a1b2c3d4e5f6g7h8` será diferente (tu connection string ID)

