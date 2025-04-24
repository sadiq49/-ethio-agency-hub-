import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function setupTestDatabase() {
  // Create test data and reset database to known state
  await cleanupTestDatabase(); // Start fresh
  
  // Create test users
  await supabase.auth.admin.createUser({
    email: 'admin@example.com',
    password: 'password123',
    user_metadata: { role: 'admin' }
  });
  
  await supabase.auth.admin.createUser({
    email: 'user@example.com',
    password: 'password123',
    user_metadata: { role: 'user' }
  });
  
  // Create test data as needed
  // ...
}

export async function cleanupTestDatabase() {
  // Clean up test data
  const tables = [
    'documents',
    'travel_records',
    'visa_applications',
    'workers',
    // Add other tables as needed
  ];
  
  // Only delete test data, not production data
  for (const table of tables) {
    await supabase
      .from(table)
      .delete()
      .match({ environment: 'test' });
  }
  
  // Delete test users
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'admin@example.com');
    
  if (users && users.length > 0) {
    await supabase.auth.admin.deleteUser(users[0].id);
  }
  
  const { data: regularUsers } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'user@example.com');
    
  if (regularUsers && regularUsers.length > 0) {
    await supabase.auth.admin.deleteUser(regularUsers[0].id);
  }
}