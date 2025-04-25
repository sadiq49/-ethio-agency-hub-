import { useOcr } from '../hooks/use-ocr';

interface TestResult {
  imageType: string;
  processingTime: number;
  success: boolean;
  text?: string;
  error?: string;
  confidence?: number;
}

export async function testOcrWithImageTypes(
  imageFiles: File[],
  progressCallback?: (progress: number, total: number) => void
): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const { extractText } = useOcr();
  
  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const imageType = file.type;
    const startTime = performance.now();
    
    try {
      const result = await extractText(file);
      const processingTime = performance.now() - startTime;
      
      results.push({
        imageType,
        processingTime,
        success: true,
        text: result.text,
        confidence: result.confidence
      });
    } catch (error) {
      const processingTime = performance.now() - startTime;
      
      results.push({
        imageType,
        processingTime,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    if (progressCallback) {
      progressCallback(i + 1, imageFiles.length);
    }
  }
  
  return results;
}

export function generateTestReport(results: TestResult[]): string {
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;
  const averageTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;
  
  let report = `# OCR Test Report\n\n`;
  report += `- Total images tested: ${results.length}\n`;
  report += `- Success rate: ${((successCount / results.length) * 100).toFixed(2)}%\n`;
  report += `- Average processing time: ${averageTime.toFixed(2)}ms\n\n`;
  
  report += `## Results by Image Type\n\n`;
  
  const byType = results.reduce((acc, result) => {
    const type = result.imageType;
    if (!acc[type]) {
      acc[type] = { total: 0, success: 0, times: [] };
    }
    acc[type].total++;
    if (result.success) acc[type].success++;
    acc[type].times.push(result.processingTime);
    return acc;
  }, {} as Record<string, { total: number; success: number; times: number[] }>);
  
  for (const [type, data] of Object.entries(byType)) {
    const avgTime = data.times.reduce((sum, t) => sum + t, 0) / data.times.length;
    report += `### ${type}\n`;
    report += `- Success rate: ${((data.success / data.total) * 100).toFixed(2)}%\n`;
    report += `- Average time: ${avgTime.toFixed(2)}ms\n\n`;
  }
  
  report += `## Detailed Results\n\n`;
  
  results.forEach((result, index) => {
    report += `### Image ${index + 1} (${result.imageType})\n`;
    report += `- Success: ${result.success ? '✅' : '❌'}\n`;
    report += `- Processing time: ${result.processingTime.toFixed(2)}ms\n`;
    
    if (result.success) {
      report += `- Confidence: ${result.confidence !== undefined ? (result.confidence * 100).toFixed(2) + '%' : 'N/A'}\n`;
      report += `- Text length: ${result.text?.length || 0} characters\n`;
    } else {
      report += `- Error: ${result.error}\n`;
    }
    
    report += '\n';
  });
  
  return report;
}