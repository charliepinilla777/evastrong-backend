const http = require('http');

const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzZiOWY1NjY0NzE1YTQ0ZDQ1ZTczOSIsImVtYWlsIjoiYWRtaW5AZXZhc3Ryb25nLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2OTM4ODUzMywiZXhwIjoxNzY5OTkzMzMzfQ.BzU5tkZiqXGABcBIW5MDjw9tU6CWDdGtt0RwOVhwQf4';

const endpoints = [
  '/api/admin/users/stats',
  '/api/admin/revenue/stats',
  '/api/admin/achievements/stats',
  '/api/admin/subscriptions/stats',
  '/api/admin/traffic/stats',
  '/api/admin/feedback/stats'
];

async function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            endpoint,
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            endpoint,
            status: res.statusCode,
            data: data,
            error: 'Invalid JSON'
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        endpoint,
        error: error.message
      });
    });

    req.end();
  });
}

async function testAllEndpoints() {
  console.log('🧪 Probando endpoints del Dashboard Administrativo\n');
  
  for (const endpoint of endpoints) {
    console.log(`📡 Probando: ${endpoint}`);
    try {
      const result = await testEndpoint(endpoint);
      
      if (result.error) {
        console.log(`❌ Error: ${result.error}`);
      } else {
        console.log(`✅ Status: ${result.status}`);
        if (result.status === 200) {
          console.log('📊 Datos recibidos:');
          console.log(JSON.stringify(result.data, null, 2));
        } else {
          console.log('❌ Respuesta:', result.data);
        }
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('─'.repeat(50));
  }
  
  console.log('\n🎯 Prueba de acciones POST');
  
  // Probar envío de recordatorio
  try {
    const reminderResult = await testPostEndpoint('/api/admin/subscriptions/send-reminder', {
      userId: 'test123',
      userName: 'Usuario Test'
    });
    
    console.log('📧 Recordatorio:', reminderResult);
  } catch (error) {
    console.log('❌ Error recordatorio:', error.message);
  }
  
  // Probar respuesta a feedback
  try {
    const feedbackResult = await testPostEndpoint('/api/admin/feedback/respond', {
      userId: 'test123',
      response: 'Gracias por tu feedback'
    });
    
    console.log('💬 Feedback:', feedbackResult);
  } catch (error) {
    console.log('❌ Error feedback:', error.message);
  }
}

async function testPostEndpoint(endpoint, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            endpoint,
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            endpoint,
            status: res.statusCode,
            data: data,
            error: 'Invalid JSON'
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        endpoint,
        error: error.message
      });
    });

    req.write(postData);
    req.end();
  });
}

testAllEndpoints().catch(console.error);
