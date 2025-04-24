export type UserRole = 'admin' | 'manager' | 'agent' | 'user';

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete';
  subject: string;
}

// Define permissions for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    // Admin has full access to everything
    { action: 'create', subject: 'all' },
    { action: 'read', subject: 'all' },
    { action: 'update', subject: 'all' },
    { action: 'delete', subject: 'all' },
  ],
  manager: [
    // Managers can manage workers, documents, and view reports
    { action: 'create', subject: 'worker' },
    { action: 'read', subject: 'worker' },
    { action: 'update', subject: 'worker' },
    { action: 'delete', subject: 'worker' },
    
    { action: 'create', subject: 'document' },
    { action: 'read', subject: 'document' },
    { action: 'update', subject: 'document' },
    { action: 'delete', subject: 'document' },
    
    { action: 'read', subject: 'report' },
    
    { action: 'create', subject: 'travel' },
    { action: 'read', subject: 'travel' },
    { action: 'update', subject: 'travel' },
  ],
  agent: [
    // Agents can create and manage workers and documents
    { action: 'create', subject: 'worker' },
    { action: 'read', subject: 'worker' },
    { action: 'update', subject: 'worker' },
    
    { action: 'create', subject: 'document' },
    { action: 'read', subject: 'document' },
    { action: 'update', subject: 'document' },
    
    { action: 'read', subject: 'travel' },
  ],
  user: [
    // Regular users can only view their own data
    { action: 'read', subject: 'worker' },
    { action: 'read', subject: 'document' },
    { action: 'read', subject: 'travel' },
  ],
};

// Check if a user has permission to perform an action on a subject
export function hasPermission(
  userRole: UserRole,
  action: Permission['action'],
  subject: string
): boolean {
  const permissions = rolePermissions[userRole];
  
  return permissions.some(
    (permission) =>
      (permission.action === action || permission.action === 'all') &&
      (permission.subject === subject || permission.subject === 'all')
  );
}

// RBAC middleware for API routes
export async function checkPermission(
  userRole: UserRole,
  action: Permission['action'],
  subject: string
): Promise<boolean> {
  // You can add additional logic here, like checking database for custom permissions
  return hasPermission(userRole, action, subject);
}