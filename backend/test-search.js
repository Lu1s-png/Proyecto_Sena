const http = require('http');
const querystring = require('querystring');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testSearchEndpoint() {
  try {
    console.log('Probando endpoint de búsqueda de inspecciones...');
    
    // Primero hacer login para obtener el token
    const loginData = JSON.stringify({
      email: 'test@admin.com',
      password: 'test123'
    });

    const loginOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    const loginResponse = await makeRequest(loginOptions, loginData);
    
    if (loginResponse.status !== 200) {
      console.error('Error en login:', loginResponse.data);
      return;
    }

    const token = loginResponse.data.token;
    console.log('Login exitoso, token obtenido');
    
    // Probar el endpoint de búsqueda con diferentes parámetros
    const searchParams = [
      { numeroInterno: '08' },
      { numeroInterno: '0' },
      { numeroInterno: '8' },
      { numeroInterno: '80' },
      { numeroInterno: '803' },
      { numeroInterno: '8030' }
    ];
    
    for (const params of searchParams) {
      try {
        console.log(`\nProbando búsqueda con parámetros:`, params);
        
        const queryParams = querystring.stringify({
          page: 1,
          limit: 10,
          ...params
        });

        const searchOptions = {
          hostname: 'localhost',
          port: 5000,
          path: `/api/inspections/search?${queryParams}`,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const response = await makeRequest(searchOptions);
        
        if (response.status === 200) {
          console.log(`✅ Éxito: ${response.data.total} resultados encontrados`);
        } else {
          console.log(`❌ Error ${response.status}:`, response.data);
          if (response.status === 500) {
            console.log('Error 500 detectado - revisando detalles...');
          }
        }
      } catch (error) {
        console.log(`❌ Error:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('Error en el test:', error.message);
  }
}

testSearchEndpoint();