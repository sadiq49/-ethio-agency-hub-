import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../../lib/logger';

interface MetricEvent {
  name: string;
  value?: number;
  tags?: Record<string, string>;
  timestamp: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { events } = req.body as { events: MetricEvent[] };
    
    if (!Array.isArray(events)) {
      return res.status(400).json({ error: 'Invalid events format' });
    }
    
    // Log metrics for now
    // In production, you would send these to a metrics service
    logger.info(`Received ${events.length} metric events`, {
      context: { events }
    });
    
    // Here you would typically send metrics to your monitoring service
    // For example:
    // await sendToDatadog(events);
    // or
    // await sendToPrometheus(events);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error processing metrics', error as Error);
    return res.status(500).json({ error: 'Failed to process metrics' });
  }
}