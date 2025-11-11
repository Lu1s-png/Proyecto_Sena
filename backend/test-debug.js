const http = require('http');
const querystring = require('querystring');

function makeRequest(options) {
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

    req.end();
  });
}

async function testDebugEndpoint() {
  try {
    console.log('Probando endpoint de debug...');
    
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
        console.log(`\n=== Probando búsqueda con parámetros: ${JSON.stringify(params)} ===`);
        
        const queryParams = querystring.stringify({
          page: 1,
          limit: 10,
          ...params
        });

        const searchOptions = {
          hostname: 'localhost',
          port: 5000,
          path: `/api/inspections/search-debug?${queryParams}`,
          method: 'GET'
        };

        const response = await makeRequest(searchOptions);
        
        if (response.status === 200) {
          console.log(`✅ Éxito: ${response.data.total} resultados encontrados`);
          if (response.data.debug) {
            console.log('Debug info:', JSON.stringify(response.data.debug, null, 2));
          }
        } else {
          console.log(`❌ Error ${response.status}:`, response.data);
        }
      } catch (error) {
        console.log(`❌ Error:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('Error en el test:', error.message);
  }
}

testDebugEndpoint();