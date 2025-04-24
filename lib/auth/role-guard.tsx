"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
};

export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/auth/login",
}: RoleGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkUserRole() {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push(redirectTo);
        return;
      }
      
      // Get user's role from profiles table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (error || !profileData) {
        console.error("Error fetching user role:", error);
        router.push(redirectTo);
        return;
      }
      
      // Check if user's role is in the allowed roles
      const hasAccess = allowedRoles.includes(profileData.role);
      
      if (!hasAccess) {
        router.push('/unauthorized');
        return;
      }
      
      setIsAuthorized(true);
    }
    
    checkUserRole();
  }, [supabase, router, redirectTo, allowedRoles]);
  
  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return <>{children}</>;
}