# ⚡ URGENTE: Pasos para Resolver Error de MongoDB en Render

## 🔒 IMPORTANTE: Seguridad

**La contraseña `Ducati2026` fue expuesta en GitHub.**

### DEBES ROTAR LA CONTRASEÑA NUEVAMENTE:

1. Ve a https://cloud.mongodb.com
2. **Database Access**
3. Edita usuario `evastrong_user`
4. **Edit Password** → Genera UNA CONTRASEÑA NUEVA (diferente a Ducati2026)
   ```bash
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```
5. **Guarda la nueva contraseña en un lugar seguro (no en GitHub)**
6. Haz clic en **Update User**

---

## 🔧 Pasos para Actualizar en Render

### Paso 1: Obtener Connection String de MongoDB Atlas

1. Ve a https://cloud.mongodb.com
2. **Deployment** → **Clusters**
3. Haz clic en **Connect** (en `evastrong-cluster`)
4. Selecciona **Drivers**
5. Elige **Node.js**
6. Verás algo como:
   ```
   mongodb+srv://evastrong_user:<password>@evastrong-cluster.XXXXX.mongodb.net/?retryWrites=true&w=majority
   ```

### Paso 2: Modificar la Connection String

- Reemplaza `<password>` con tu NUEVA contraseña (la que acabas de generar)
- Agrega `/evastrong` antes del `?`

**Resultado final:**
```
mongodb+srv://evastrong_user:TU_NUEVA_CONTRASEÑA@evastrong-cluster.XXXXX.mongodb.net/evastrong?retryWrites=true&w=majority
```

### Paso 3: Actualizar en Render

1. Ve a https://dashboard.render.com
2. Selecciona `evastrong-backend`
3. **Environment**
4. Busca `MONGODB_URI`
5. **Elimina la anterior**
6. **Agrega nueva:** Tu connection string con la nueva contraseña
7. Haz clic en **Save**

### Paso 4: Verificar Network Access

1. Ve a https://cloud.mongodb.com
2. **Security** → **Network Access**
3. Verifica que exista `0.0.0.0/0` (acceso desde cualquier lugar)
4. Si no está, agrega:
   - Haz clic en **Add IP Address**
   - Selecciona **Allow access from anywhere**
   - Haz clic en **Confirm**

### Paso 5: Redeploy en Render

1. En Render, ve a **Settings**
2. Haz clic en **Clear Build Cache**
3. Haz clic en **Redeploy latest commit**
4. Espera a que termine

---

## ✅ Verificar que Funciona

En los logs de Render deberías ver:

```
✅ MongoDB Conectado
   Host: evastrong-cluster.xxxxx.mongodb.net
   Base de datos: evastrong
```

---

## ❌ Si sigue sin funcionar

**Verifica estos puntos:**

1. ¿La nueva contraseña está en la connection string?
   - Debe ser tu NUEVA contraseña (no Ducati2026)

2. ¿El cluster está activo?
   - MongoDB Atlas → Clusters → Debe tener badge verde ✅

3. ¿Network Access está configurado?
   - Debe tener entrada `0.0.0.0/0`

4. ¿La connection string tiene formato correcto?
   - Debe ser: `mongodb+srv://usuario:contraseña@cluster.xxxxx.mongodb.net/basedatos?...`
   - NO debe tener `<` o `>` o `xxxxx` sin reemplazar

5. ¿Limpiaste el cache en Render?
   - Settings → Clear Build Cache → Redeploy

---

## 📞 Resumen Rápido

| Acción | Dónde |
|--------|-------|
| Generar nueva contraseña | MongoDB Atlas → Database Access |
| Copiar connection string | MongoDB Atlas → Connect → Drivers → Node.js |
| Actualizar MONGODB_URI | Render Dashboard → Environment |
| Limpiar cache | Render → Settings → Clear Build Cache |
| Redeploy | Render → Settings → Redeploy latest commit |

