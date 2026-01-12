# 🔧 Solucionar Error de Conexión a MongoDB

## ❌ Error: "Error al conectar MongoDB"

Este error ocurre cuando:
- La `MONGODB_URI` está mal configurada
- La contraseña contiene caracteres especiales sin escapar
- El usuario no tiene permisos
- El cluster no está activo

---

## ✅ SOLUCIÓN PASO A PASO

### Paso 1: Verificar que el Cluster esté Activo

1. Ve a https://cloud.mongodb.com
2. Ve a **Deployment** → **Clusters**
3. Verifica que tu cluster tenga un badge verde ✅ (debe decir "Active")
4. Si no está activo, haz clic en él y espera a que se inicie

### Paso 2: Verificar Permisos del Usuario

1. Ve a **Database Access** (menú izquierdo)
2. Busca el usuario `evastrong_user`
3. Verifica que tenga estos roles:
   - ✅ `dbOwner` en `evastrong` (tu base de datos)
   - O ✅ `readWriteAnyDatabase`
4. Si no tiene permisos, edita el usuario y agrega los roles correctos

### Paso 3: Generar Nueva Connection String (CORRECTO)

**Opción A: Si tu contraseña NO tiene caracteres especiales:**

1. Ve a **Deployment** → **Clusters**
2. Haz clic en **Connect**
3. Selecciona **Drivers**
4. Elige **Node.js**
5. Copia la connection string que aparece
6. Reemplaza `<username>` por `evastrong_user`
7. Reemplaza `<password>` por tu contraseña (sin caracteres especiales)

Ejemplo:
```
mongodb+srv://evastrong_user:MiContraseña123@cluster0.abcd1234.mongodb.net/evastrong?retryWrites=true&w=majority
```

**Opción B: Si tu contraseña TIENE caracteres especiales (@, %, &, etc):**

MongoDB Atlas automáticamente escapa los caracteres especiales. Pero para estar seguro:

1. Ve a **Deployment** → **Clusters** → **Connect**
2. Selecciona **Drivers** → **Node.js**
3. Copia la connection string que aparece
4. Verifica que esté así:
```
mongodb+srv://evastrong_user:PASSWORD_ESCAPADA@cluster0.abcd1234.mongodb.net/evastrong?retryWrites=true&w=majority
```

Si ves caracteres especiales, asegúrate que estén escapados:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `#` → `%23`

### Paso 4: Actualizar en Render Dashboard

1. Ve a https://dashboard.render.com
2. Selecciona `evastrong-backend`
3. Ve a **Environment**
4. Busca `MONGODB_URI`
5. **Reemplázala COMPLETAMENTE** con la nueva connection string
6. **NO** dejes la antigua, **ELIMÍNALA PRIMERO**

### Paso 5: Verificar Red Access

1. Ve a **Security** → **Network Access**
2. Verifica que esté agregada una entrada que permita conexiones de Render
3. Deberías ver `0.0.0.0/0` (acceso desde cualquier lugar)
4. Si no está, haz clic en **Add IP Address**
   - Selecciona **Allow access from anywhere**
   - Haz clic en **Confirm**

### Paso 6: Redeploy en Render

1. Ve a tu servicio en Render
2. Ve a **Settings**
3. Haz clic en **Clear Build Cache**
4. Haz clic en **Redeploy**

### Paso 7: Verificar Logs

Después del redeploy, en Render deberías ver:

✅ **Éxito:**
```
✅ MongoDB Conectado
   Host: cluster0.xxxxx.mongodb.net
   Base de datos: evastrong
```

❌ **Si sigue fallando:**
```
❌ Error al conectar MongoDB:
   {MENSAJE_DE_ERROR_ESPECÍFICO}
```

---

## 🔍 Casos Comunes y Soluciones

### "MongoServerError: connect ECONNREFUSED"
- ❌ El cluster no está activo
- ✅ Ve a MongoDB Atlas y reinicia el cluster

### "MongoAuthenticationError: authentication failed"
- ❌ Usuario o contraseña incorrecta
- ✅ Verifica que `MONGODB_URI` tenga el usuario y contraseña correctos
- ✅ Verifica que la contraseña no tenga caracteres especiales sin escapar

### "MongoNetworkError: getaddrinfo ENOTFOUND"
- ❌ Network Access bloqueado
- ✅ Ve a Security → Network Access
- ✅ Agrega `0.0.0.0/0` para permitir acceso desde cualquier lugar

### "MongoServerSelectionError: connect ETIMEDOUT"
- ❌ Firewall o Network Access bloqueado
- ✅ Verifica Network Access en MongoDB Atlas
- ✅ Verifica que no haya un firewall bloqueando conexiones

### "Invalid MongoDB Connection String"
- ❌ La URI está malformada
- ✅ Copia directamente desde MongoDB Atlas → Connect → Drivers
- ✅ Verifica que tenga el formato correcto:
  ```
  mongodb+srv://usuario:contraseña@cluster.xxxxx.mongodb.net/basedatos?...
  ```

---

## 🧪 Test Rápido (Opcional)

Si quieres probar la conexión antes de redeploy:

**En tu máquina local:**
```bash
# 1. En terminal, abre MongoDB shell (si tienes mongosh instalado)
mongosh "mongodb+srv://evastrong_user:TU_CONTRASEÑA@cluster0.xxxxx.mongodb.net/evastrong"

# 2. Si se conecta, verás:
# Current Env: linux
# mongosh> 

# 3. Prueba el comando:
# db.serverStatus()

# 4. Si ves datos, ¡la conexión funciona!
```

---

## 📞 Checklist Final

- [ ] Cluster está activo (verde ✅)
- [ ] Usuario `evastrong_user` existe
- [ ] Usuario tiene permisos correctos
- [ ] Network Access permite `0.0.0.0/0`
- [ ] Connection string copiada de MongoDB Atlas
- [ ] Connection string actualizada en Render Environment
- [ ] Build Cache limpiado en Render
- [ ] Redeploy completado
- [ ] Logs muestran "✅ MongoDB Conectado"

---

## 💡 Consejo: Usa una Conexión de Prueba

Si sigue sin funcionar, crea un usuario de prueba temporal:

1. **Database Access** → **Add Database User**
2. Crea usuario: `test_user` con contraseña simple: `Test123456` (sin caracteres especiales)
3. Dale permisos a la base de datos `evastrong`
4. Copia la connection string
5. Usa esa en Render para verificar que funciona
6. Si funciona, significa que tu contraseña anterior tenía un problema
7. Luego vuelve a cambiar a una contraseña segura

