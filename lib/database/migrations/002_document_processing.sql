-- Create function to calculate average document processing time
CREATE OR REPLACE FUNCTION get_document_processing_times()
RETURNS TABLE (
  document_type TEXT,
  avg_days NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.document_type,
    AVG(EXTRACT(EPOCH FROM (d.verified_at - d.created_at)) / 86400)::NUMERIC(10,2) AS avg_days
  FROM
    documents d
  WHERE
    d.status = 'verified'
    AND d.verified_at IS NOT NULL
  GROUP BY
    d.document_type
  ORDER BY
    avg_days DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get daily document processing counts
CREATE OR REPLACE FUNCTION get_daily_document_processing(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  date TEXT,
  processed BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('day', verified_at), 'YYYY-MM-DD') AS date,
    COUNT(*) AS processed
  FROM
    documents
  WHERE
    verified_at >= NOW() - (days_back || ' days')::INTERVAL
    AND status = 'verified'
  GROUP BY
    DATE_TRUNC('day', verified_at)
  ORDER BY
    DATE_TRUNC('day', verified_at) ASC;
END;
$$ LANGUAGE plpgsql;