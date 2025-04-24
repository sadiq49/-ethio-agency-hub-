// Script to audit dependencies for vulnerabilities
// Run with: node -r ts-node/register lib/security/dependency-audit.ts

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function auditDependencies() {
  try {
    console.log('Running npm audit...');
    const { stdout, stderr } = await execAsync('npm audit --json');
    
    if (stderr) {
      console.error('Error running npm audit:', stderr);
      return;
    }
    
    const auditResults = JSON.parse(stdout);
    
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }
    
    // Write audit results to file
    fs.writeFileSync(
      path.join(reportsDir, 'dependency-audit.json'),
      JSON.stringify(auditResults, null, 2)
    );
    
    // Log summary
    console.log('Audit completed. Results saved to reports/dependency-audit.json');
    console.log('Summary:');
    console.log(`- Total vulnerabilities: ${auditResults.metadata.vulnerabilities.total}`);
    console.log(`- Critical: ${auditResults.metadata.vulnerabilities.critical}`);
    console.log(`- High: ${auditResults.metadata.vulnerabilities.high}`);
    console.log(`- Moderate: ${auditResults.metadata.vulnerabilities.moderate}`);
    console.log(`- Low: ${auditResults.metadata.vulnerabilities.low}`);
    
    // Suggest fixes for vulnerabilities
    if (auditResults.metadata.vulnerabilities.total > 0) {
      console.log('\nRecommended actions:');
      console.log('Run `npm audit fix` to automatically fix vulnerabilities');
      console.log('For major version updates, run `npm audit fix --force` (may break compatibility)');
    }
  } catch (error) {
    console.error('Error auditing dependencies:', error);
  }
}

// Run the audit
auditDependencies();