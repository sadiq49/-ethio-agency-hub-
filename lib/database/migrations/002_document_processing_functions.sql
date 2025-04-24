-- Function to calculate average processing time by document type
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
    d.verified_at IS NOT NULL
  GROUP BY
    d.document_type
  ORDER BY
    avg_days DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get daily document processing counts
CREATE OR REPLACE FUNCTION get_daily_document_processing()
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
    verified_at >= NOW() - INTERVAL '30 days'
    AND verified_at IS NOT NULL
  GROUP BY
    DATE_TRUNC('day', verified_at)
  ORDER BY
    DATE_TRUNC('day', verified_at) ASC;
END;
$$ LANGUAGE plpgsql;