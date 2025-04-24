"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function Navigation() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  
  // Prefetch document processing data when hovering over the reports link
  const prefetchDocumentProcessingData = async () => {
    // Prefetch document processing stats
    queryClient.prefetchQuery({
      queryKey: ["document_processing_stats"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("document_processing_stats")
          .select("*")
          .single();
          
        if (error) throw error;
        return data;
      },
    });
    
    // Prefetch recent documents (first page)
    queryClient.prefetchQuery({
      queryKey: ["documents", "recent"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("documents")
          .select(`
            id,
            worker_id,
            worker_name:workers(name),
            document_type,
            status,
            submitted_at,
            processed_at,
            processing_time,
            processor_id,
            processor_name:processors(name),
            notes
          `)
          .order("submitted_at", { ascending: false })
          .range(0, 19);
          
        if (error) throw error;
        return data;
      },
    });
  };
  
  return (
    <nav>
      {/* ... existing navigation ... */}
      <Link 
        href="/reports/document-processing"
        className={pathname === "/reports/document-processing" ? "active" : ""}
        onMouseEnter={prefetchDocumentProcessingData}
      >
        Document Processing
      </Link>
      {/* ... other navigation items ... */}
    </nav>
  );
}