const http = require('http');

// Configuración
const BASE_URL = 'localhost';
const PORT = 5000;

// Credenciales de prueba
const ADMIN_CREDENTIALS = {
  email: 'admin@evastrong.com',
  password: 'admin123456'
};

// Función helper para hacer requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData,
            error: 'Invalid JSON'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test 1: Login seguro
async function testSecureLogin() {
  console.log('\n🔐 Test 1: Login Seguro');
  
  try {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options, ADMIN_CREDENTIALS);
    
    console.log(`Status: ${result.statusCode}`);
    if (result.statusCode === 200) {
      console.log('✅ Login exitoso');
      console.log('Tokens generados:', {
        accessToken: result.data.tokens.accessToken.substring(0, 20) + '...',
        refreshToken: result.data.tokens.refreshToken.substring(0, 20) + '...',
        expiresIn: result.data.tokens.accessTokenExpiresIn + 's'
      });
      return result.data.tokens;
    } else {
      console.log('❌ Login fallido:', result.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Error en login:', error.message);
    return null;
  }
}

// Test 2: Verificar token
async function testTokenVerification(tokens) {
  console.log('\n🔍 Test 2: Verificación de Token');
  
  if (!tokens) {
    console.log('❌ No hay tokens para verificar');
    return;
  }

  try {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: '/api/auth/verify',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options);
    
    console.log(`Status: ${result.statusCode}`);
    if (result.statusCode === 200) {
      console.log('✅ Token válido');
      console.log('Usuario:', result.data.user.email);
      console.log('Suscripción:', result.data.subscription ? 'Activa' : 'Inactiva');
    } else {
      console.log('❌ Token inválido:', result.data);
    }
  } catch (error) {
    console.log('❌ Error en verificación:', error.message);
  }
}

// Test 3: Refresh token
async function testTokenRefresh(tokens) {
  console.log('\n🔄 Test 3: Refresh Token');
  
  if (!tokens) {
    console.log('❌ No hay tokens para refrescar');
    return;
  }

  try {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: '/api/auth/refresh',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options, { 
      refreshToken: tokens.refreshToken 
    });
    
    console.log(`Status: ${result.statusCode}`);
    if (result.statusCode === 200) {
      console.log('✅ Tokens refrescados exitosamente');
      console.log('Nuevo accessToken:', result.data.tokens.accessToken.substring(0, 20) + '...');
      return result.data.tokens;
    } else {
      console.log('❌ Refresh fallido:', result.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Error en refresh:', error.message);
    return null;
  }
}

// Test 4: Acceso a ruta protegida
async function testProtectedRoute(tokens) {
  console.log('\n🛡️ Test 4: Acceso a Ruta Protegida (Premium)');
  
  if (!tokens) {
    console.log('❌ No hay tokens para probar ruta protegida');
    return;
  }

  try {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: '/routines/premium',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options);
    
    console.log(`Status: ${result.statusCode}`);
    if (result.statusCode === 200) {
      console.log('✅ Acceso permitido a ruta premium');
      console.log('Rutinas encontradas:', result.data.data.routines.length);
    } else if (result.statusCode === 403) {
      console.log('⚠️ Acceso denegado (suscripción requerida):', result.data.error);
    } else {
      console.log('❌ Error en acceso:', result.data);
    }
  } catch (error) {
    console.log('❌ Error en ruta protegida:', error.message);
  }
}

// Test 5: Acceso a ruta sin token
async function testUnauthorizedAccess() {
  console.log('\n🚫 Test 5: Acceso No Autorizado');
  
  try {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: '/routines/premium',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options);
    
    console.log(`Status: ${result.statusCode}`);
    if (result.statusCode === 401) {
      console.log('✅ Acceso denegado correctamente (sin token)');
    } else {
      console.log('❌ Debería denegar acceso:', result.data);
    }
  } catch (error) {
    console.log('❌ Error en prueba no autorizada:', error.message);
  }
}

// Test 6: Logout seguro
async function testSecureLogout(tokens) {
  console.log('\n🚪 Test 6: Logout Seguro');
  
  if (!tokens) {
    console.log('❌ No hay tokens para hacer logout');
    return;
  }

  try {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: '/api/auth/logout',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options, { 
      refreshToken: tokens.refreshToken 
    });
    
    console.log(`Status: ${result.statusCode}`);
    if (result.statusCode === 200) {
      console.log('✅ Logout exitoso');
    } else {
      console.log('❌ Logout fallido:', result.data);
    }
  } catch (error) {
    console.log('❌ Error en logout:', error.message);
  }
}

// Test 7: Dashboard de seguridad (admin)
async function testSecurityDashboard(tokens) {
  console.log('\n📊 Test 7: Dashboard de Seguridad (Admin)');
  
  if (!tokens) {
    console.log('❌ No hay tokens para admin');
    return;
  }

  try {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: '/api/security/security/stats',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options);
    
    console.log(`Status: ${result.statusCode}`);
    if (result.statusCode === 200) {
      console.log('✅ Dashboard de seguridad accesible');
      console.log('Eventos totales:', result.data.data.events.total);
      console.log('Tokens activos:', result.data.data.tokens.active);
      console.log('Accesos denegados:', result.data.data.access.denied);
    } else {
      console.log('❌ Acceso denegado al dashboard:', result.data);
    }
  } catch (error) {
    console.log('❌ Error en dashboard de seguridad:', error.message);
  }
}

// Función principal de pruebas
async function runSecurityTests() {
  console.log('🧪 Iniciando Tests del Sistema de Seguridad');
  console.log('==========================================');
  
  // Ejecutar todos los tests
  const tokens = await testSecureLogin();
  await testTokenVerification(tokens);
  const newTokens = await testTokenRefresh(tokens);
  await testProtectedRoute(newTokens || tokens);
  await testUnauthorizedAccess();
  await testSecurityDashboard(tokens);
  await testSecureLogout(tokens);
  
  console.log('\n🎯 Tests completados');
  console.log('==========================================');
}

// Ejecutar tests
runSecurityTests().catch(console.error);
