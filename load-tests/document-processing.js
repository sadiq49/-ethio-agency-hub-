import http from 'k6/http';
import { sleep, check } from 'k6';

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users over 30 seconds
    { duration: '1m', target: 20 },  // Stay at 20 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 users over 30 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
};

// Simulate user session
export default function () {
  // Login
  const loginRes = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
    email: `test${__VU}@example.com`, // Virtual User number as part of email
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'has access token': (r) => r.json('access_token') !== undefined,
  });
  
  const accessToken = loginRes.json('access_token');
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  
  // Fetch documents list
  const docsRes = http.get('http://localhost:3000/api/documents', { headers });
  
  check(docsRes, {
    'documents retrieved': (r) => r.status === 200,
    'has documents': (r) => r.json().length > 0,
  });
  
  // View document details (if documents exist)
  if (docsRes.json().length > 0) {
    const docId = docsRes.json()[0].id;
    const docDetailsRes = http.get(`http://localhost:3000/api/documents/${docId}`, { headers });
    
    check(docDetailsRes, {
      'document details retrieved': (r) => r.status === 200,
      'has correct document': (r) => r.json().id === docId,
    });
  }
  
  // Simulate user thinking time
  sleep(3);
}