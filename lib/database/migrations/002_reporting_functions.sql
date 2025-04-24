-- Function to get document processing times
CREATE OR REPLACE FUNCTION get_document_processing_times()
RETURNS TABLE (
  document_type TEXT,
  avg_days NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.document_type,
    ROUND(AVG(EXTRACT(EPOCH FROM (documents.verified_at - documents.created_at)) / 86400), 1) AS avg_days
  FROM
    documents
  WHERE
    documents.status = 'verified'
    AND documents.verified_at IS NOT NULL
  GROUP BY
    documents.document_type
  ORDER BY
    avg_days DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get daily document processing
CREATE OR REPLACE FUNCTION get_daily_document_processing()
RETURNS TABLE (
  date TEXT,
  processed BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(documents.verified_at, 'YYYY-MM-DD') AS date,
    COUNT(*) AS processed
  FROM
    documents
  WHERE
    documents.verified_at IS NOT NULL
    AND documents.verified_at >= NOW() - INTERVAL '30 days'
  GROUP BY
    TO_CHAR(documents.verified_at, 'YYYY-MM-DD')
  ORDER BY
    date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get worker status by agent
CREATE OR REPLACE FUNCTION get_worker_status_by_agent()
RETURNS TABLE (
  agent_id UUID,
  agent_name TEXT,
  status TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    profiles.id AS agent_id,
    profiles.full_name AS agent_name,
    workers.status,
    COUNT(*) AS count
  FROM
    workers
  JOIN
    profiles ON workers.agent_id = profiles.id
  GROUP BY
    profiles.id, profiles.full_name, workers.status
  ORDER BY
    profiles.full_name, workers.status;
END;
$$ LANGUAGE plpgsql;