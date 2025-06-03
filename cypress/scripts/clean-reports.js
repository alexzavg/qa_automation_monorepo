const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const rm = promisify(fs.rm);
const mkdir = promisify(fs.mkdir);

async function cleanReports() {
  console.log('\n=== Starting cleanup ===');
  const basePath = process.cwd();
  console.log(`Base path: ${basePath}`);

  const pathsToClean = [
    path.join(basePath, 'mochawesome.json'),
    path.join(basePath, 'mochawesome-report'),
    path.join(basePath, 'cypress/mochawesome.json'),
    path.join(basePath, 'cypress/reports'),
    path.join(basePath, 'reports')
  ];

  for (const itemPath of pathsToClean) {
    try {
      if (fs.existsSync(itemPath)) {
        const stat = fs.lstatSync(itemPath);
        if (stat.isDirectory()) {
          console.log(`Removing directory: ${itemPath}`);
          await rm(itemPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
        } else {
          console.log(`Removing file: ${itemPath}`);
          await rm(itemPath, { force: true });
        }
        console.log(`Successfully removed: ${itemPath}`);
      } else {
        console.log(`Path does not exist: ${itemPath}`);
      }
    } catch (error) {
      console.error(`Error removing ${itemPath}:`, error);
    }
  }

  // Recreate necessary directories
  const reportsDir = path.join(basePath, 'reports');
  if (!fs.existsSync(reportsDir)) {
    await mkdir(reportsDir, { recursive: true });
    console.log(`Created directory: ${reportsDir}`);
  }

  console.log('=== Cleanup completed ===\n');
}

cleanReports().catch(console.error);
