-- Create a view for document processing statistics
CREATE OR REPLACE VIEW document_processing_stats AS
SELECT
  COUNT(*) AS total_documents,
  COUNT(CASE WHEN status = 'pending_review' THEN 1 END) AS pending_review,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS rejected,
  COALESCE(AVG(CASE WHEN processing_time IS NOT NULL THEN processing_time END), 0) AS processing_time
FROM documents;

-- Grant access to the authenticated users
ALTER VIEW document_processing_stats OWNER TO authenticated;
GRANT SELECT ON document_processing_stats TO authenticated;