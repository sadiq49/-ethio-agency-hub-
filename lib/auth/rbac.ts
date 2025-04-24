import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = 'admin' | 'manager' | 'agent' | 'user';

// Define permissions for each role
export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    'view:all',
    'create:all',
    'update:all',
    'delete:all',
    'manage:users',
    'manage:settings',
  ],
  manager: [
    'view:all',
    'create:workers',
    'update:workers',
    'create:documents',
    'update:documents',
    'view:reports',
  ],
  agent: [
    'view:workers',
    'create:workers',
    'update:workers',
    'view:documents',
    'create:documents',
  ],
  user: [
    'view:own_profile',
    'update:own_profile',
    'view:own_documents',
  ],
};

// Check if user has a specific permission
export function hasPermission(userRole: UserRole, permission: string): boolean {
  if (!userRole || !rolePermissions[userRole]) return false;
  return rolePermissions[userRole].includes(permission);
}

// Server component to check authentication and redirect if not authenticated
export async function requireAuth() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  return session;
}

// Server component to check role-based access
export async function requireRole(requiredRoles: UserRole[]) {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  // Get user profile with role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  const userRole = profile?.role as UserRole;
  
  if (!userRole || !requiredRoles.includes(userRole)) {
    redirect('/unauthorized');
  }
  
  return { session, userRole };
}

// Client hook for checking permissions
export function usePermissions(permission: string) {
  // This would be implemented with a context provider
  // For now, we'll return a placeholder implementation
  return {
    can: (action: string) => true,
    isLoading: false,
    error: null,
  };
}