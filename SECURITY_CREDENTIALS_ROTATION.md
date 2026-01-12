# 🔒 Guía de Rotación de Credenciales (URGENTE)

## ⚠️ SITUACIÓN

Tu MongoDB URI fue expuesta en GitHub. Cualquiera con acceso al historio de commits podría usarla para:
- Acceder a tu base de datos
- Leer/modificar/borrar datos
- Causar daño permanente

## ✅ SOLUCIÓN: Rotar Credenciales

### Paso 1: Cambiar Contraseña de Usuario MongoDB

1. Ve a https://cloud.mongodb.com
2. Inicia sesión con tu cuenta
3. Ve a **Database Access** (en el menú izquierdo)
4. Busca el usuario que usas (probablemente `admin` o similar)
5. Haz clic en el botón de **Edit** (lápiz)
6. Haz clic en **Edit Password**
7. Genera una contraseña nueva y fuerte:
   ```bash
   # Opción: Usar este comando para generar una contraseña segura
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```
8. Copia la nueva contraseña
9. Haz clic en **Update User**

### Paso 2: Obtener Nueva Connection String

1. Ve a **Deployment** → **Clusters** (menú izquierdo)
2. Busca tu cluster
3. Haz clic en **Connect**
4. Selecciona **Drivers** (no Compass)
5. Elige **Node.js** como driver
6. Copia la connection string que aparece
   - Verá algo como: `mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/...`
   - **IMPORTANTE**: Reemplaza `<password>` con tu nueva contraseña

### Paso 3: Actualizar Variable en Render

1. Ve a Render Dashboard
2. Selecciona `evastrong-backend`
3. Ve a **Environment**
4. Busca `MONGODB_URI`
5. Reemplázala con la nueva connection string
6. Haz clic en **Save**

### Paso 4: Redeploy en Render

1. Ve a **Settings**
2. Haz clic en **Clear Build Cache**
3. Haz clic en **Redeploy**

### Paso 5: Verifica que Funciona

Espera a que termine el deployment. En los logs deberías ver:
```
✅ MongoDB conectado correctamente
```

---

## 🔐 Mejores Prácticas (Para el Futuro)

### Nunca hagas commit de:
- ❌ Contraseñas
- ❌ Tokens de API
- ❌ Connection strings de bases de datos
- ❌ Claves privadas
- ❌ Secretos de OAuth

### Usa `.gitignore` para proteger archivos sensibles:
```
.env
.env.local
.env.*.local
*.pem
*.key
secrets/
```

### Usa `.env` en local (NUNCA en repositorio):
```
# .env (local only)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
GOOGLE_CLIENT_SECRET=...
```

### En producción, SIEMPRE usa variables de entorno:
- Render Dashboard
- GitHub Secrets
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault

---

## 🚨 Si alguien accedió a tus datos

Si crees que alguien pudo haber accedido a tu base de datos:

1. **Audita tu base de datos** en MongoDB Atlas → Logs
2. **Revisa los accesos recientes** en Security → Network Access
3. **Cambia contraseña de mongo nuevamente**
4. **Notifica a usuarios** si sus datos fueron expuestos

---

## ✅ Checklist de Seguridad

- [ ] Nueva contraseña generada en MongoDB Atlas
- [ ] Nueva connection string copiada
- [ ] Variable `MONGODB_URI` actualizada en Render
- [ ] Redeploy completado exitosamente
- [ ] Logs verifican conexión a MongoDB
- [ ] `.env` agregado a `.gitignore` (si no estaba)
- [ ] Documentación actualizada sin credenciales

---

## 📞 Resumen de lo hecho

| Acción | Responsable | Estado |
|--------|-------------|--------|
| Remover credenciales de documentación | Rovo Dev | ✅ Hecho (commit `2a869f9`) |
| Rotar credenciales MongoDB | **TÚ** | ⏳ **DEBES HACERLO** |
| Actualizar Render | **TÚ** | ⏳ Después de rotar |
| Verificar logs | **TÚ** | ⏳ Después de redeploy |

