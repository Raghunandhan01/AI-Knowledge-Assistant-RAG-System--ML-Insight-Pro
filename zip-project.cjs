const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const zip = new AdmZip();
const rootDir = process.cwd();
const outputFile = 'project.zip';

const excludes = ['node_modules', '.git', 'dist', 'project.zip', '.env'];

function addFilesRecursively(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (excludes.includes(file)) continue;
        
        const fullPath = path.join(dir, file);
        const relativePath = path.relative(rootDir, fullPath);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            addFilesRecursively(fullPath);
        } else {
            zip.addLocalFile(fullPath, path.dirname(relativePath) === '.' ? '' : path.dirname(relativePath));
        }
    }
}

try {
    console.log('Starting compression...');
    addFilesRecursively(rootDir);
    zip.writeZip(outputFile);
    console.log(`Successfully created ${outputFile}`);
} catch (error) {
    console.error('Error creating zip:', error);
    process.exit(1);
}
