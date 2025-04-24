import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  scenarios: {
    // Simulate constant load
    constant_load: {
      executor: 'constant-arrival-rate',
      rate: 50,               // 50 iterations per minute
      timeUnit: '1m',         // 1 minute
      duration: '2m',         // 2 minutes
      preAllocatedVUs: 10,    // Pre-allocate 10 VUs
      maxVUs: 20,             // Maximum 20 VUs
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
};

export default function () {
  // Login
  const loginRes = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
    email: `loadtest${__VU}@example.com`,
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const accessToken = loginRes.json('access_token');
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  
  // Fetch notifications
  const getNotifRes = http.get('http://localhost:3000/api/notifications', { headers });
  
  check(getNotifRes, {
    'notifications retrieved': (r) => r.status === 200,
  });
  
  // If notifications exist, mark one as read
  if (getNotifRes.json().length > 0) {
    const notifId = getNotifRes.json()[0].id;
    const markReadRes = http.patch(`http://localhost:3000/api/notifications/${notifId}`, JSON.stringify({
      read: true
    }), { headers });
    
    check(markReadRes, {
      'notification marked as read': (r) => r.status === 200,
    });
  }
  
  sleep(1);
}