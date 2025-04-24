// Add to document upload function
const handleUploadSubmit = async (e: React.FormEvent) => {
  // ... existing code ...
  
  try {
    // ... existing document upload code ...
    
    // After successful upload, trigger verification
    if (documentData && filesData && filesData.length > 0) {
      // Get the first file URL for verification
      const fileUrl = filesData[0].url;
      
      // Trigger verification
      const verificationResult = await verifyDocument(
        documentData.id,
        uploadForm.documentType,
        fileUrl
      );
      
      // Update document with verification results
      if (verificationResult) {
        await supabase
          .from('documents')
          .update({
            verification_status: verificationResult.isValid ? "verified" : "verification_failed",
            verification_issues: verificationResult.issues.length > 0 ? verificationResult.issues : null,
            metadata: {
              ...documentData.metadata,
              verification: verificationResult.metadata
            }
          })
          .eq('id', documentData.id);
          
        // If verification found issues, create a notification
        if (verificationResult.issues.length > 0) {
          await supabase
            .from('notifications')
            .insert({
              user_id: uploadForm.workerId,
              title: "Document Verification Issues",
              message: `Your ${uploadForm.documentType} has verification issues: ${verificationResult.issues.join(", ")}`,
              type: "warning",
              related_to: "document",
              related_id: documentData.id,
              read: false
            });
        }
      }
    }
    
    // ... rest of existing code ...
  } catch (error) {
    // ... existing error handling ...
  }
};// Add to document details dialog
<TabsContent value="verification" className="space-y-4">
  {selectedDocument?.document.verification_status ? (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Verification Status:</h3>
        {selectedDocument.document.verification_status === "verified" ? (
          <Badge className="bg-green-100 text-green-800">Verified</Badge>
        ) : (
          <Badge className="bg-red-100 text-red-800">Verification Failed</Badge>
        )}
      </div>
      
      {selectedDocument.document.verification_issues && (
        <div className="space-y-2">
          <h4 className="font-medium">Issues:</h4>
          <ul className="list-disc pl-5">
            {selectedDocument.document.verification_issues.map((issue, i) => (
              <li key={i} className="text-red-600">{issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      {selectedDocument.document.metadata?.verification && (
        <div className="space-y-2">
          <h4 className="font-medium">Extracted Information:</h4>
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(selectedDocument.document.metadata.verification, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No Verification Data</h3>import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export interface VerificationResult {
  isValid: boolean;
  issues: string[];
  confidence: number;
  metadata: Record<string, any>;
}

// Interface for storing verification history (optional but good practice)
export interface DocumentVerificationRecord {
  id?: string;
  document_id: string;
  result: VerificationResult;
  verified_at: string;
}

export async function verifyDocument(
  documentId: string,
  documentType: string,
  fileUrl: string // Assuming the file URL is needed to fetch the document for verification
): Promise<VerificationResult | null> {
  // In a real implementation, this would call an external OCR/verification API
  // using the fileUrl or document content.
  // For now, we'll simulate verification with basic checks.

  console.log(`Simulating verification for document ${documentId} (${documentType})`);

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Default result
    const result: VerificationResult = {
      isValid: true,
      issues: [],
      confidence: 0.95, // Default high confidence
      metadata: {}
    };

    // Simulate different checks based on document type
    switch (documentType) {
      case 'passport':
        result.metadata = {
          detected_name: "Abebe Bikila",
          passport_number: `P${Math.random().toString().substring(2, 10)}`,
          issue_date: "2021-05-20",
          expiry_date: "2031-05-19",
          issuing_country: "Ethiopia"
        };
        // Simulate a potential issue
        if (Math.random() < 0.1) {
          result.isValid = false;
          result.issues.push("MRZ checksum failed");
          result.confidence = 0.6;
        }
        break;

      case 'visa':
        result.metadata = {
          visa_type: "Work Visa",
          visa_number: `V${Math.random().toString().substring(2, 10)}`,
          issue_date: "2024-01-15",
          expiry_date: "2026-01-14",
          issuing_country: "Saudi Arabia",
          entries: "Multiple"
        };
         // Simulate a potential issue
        if (Math.random() < 0.15) {
          result.isValid = false;
          result.issues.push("Expiry date seems invalid");
          result.confidence = 0.7;
        }
        break;

      case 'medical_certificate':
         result.metadata = {
          doctor_name: "Dr. Alem Kebede",
          hospital: "Addis Hiwot Hospital",
          issue_date: "2024-03-01",
          test_results: "Fit for travel",
          reference_number: `MC${Math.random().toString().substring(2, 8)}`
        };
        // Simulate a potential issue
        if (Math.random() < 0.05) {
          result.isValid = false;
          result.issues.push("Doctor's signature not detected");
          result.confidence = 0.5;
        }
        break;

      default:
        // Generic verification for other types
        result.confidence = 0.7;
        result.metadata = {
          detected_text_length: Math.floor(Math.random() * 2000) + 500,
          has_signature: Math.random() > 0.2,
          has_stamp: Math.random() > 0.3
        };
        if (!result.metadata.has_signature) {
            result.isValid = false;
            result.issues.push("Signature might be missing");
            result.confidence = 0.4;
        }
    }

    // Optional: Store verification result history in a separate table
    const supabase = createClientComponentClient();
    const { error: verificationLogError } = await supabase
      .from('document_verifications') // Ensure this table exists
      .insert({
        document_id: documentId,
        result: result, // Store the full result object
        verified_at: new Date().toISOString()
      } as DocumentVerificationRecord); // Type assertion might be needed

    if (verificationLogError) {
        console.error("Error logging verification result:", verificationLogError);
        // Decide if this should prevent returning the result - probably not
    }

    console.log(`Verification result for ${documentId}:`, result);
    return result;

  } catch (error) {
    console.error("Document verification service error:", error);
    // Return a result indicating failure
    return {
      isValid: false,
      issues: ["Verification service encountered an error"],
      confidence: 0,
      metadata: { error: String(error) }
    };
  }
}