const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get environment argument from command
const env = process.argv[2];

// Map environment to file, build command, and output directory
const envConfig = {
  'dev': {
    file: '.env-dev',
    buildCmd: 'env-cmd -f .env-dev craco build',
    outputDir: 'build-dev'
  },
  'stg': {
    file: '.env-stg',
    buildCmd: 'env-cmd -f .env-stg craco build',
    outputDir: 'build-stg'
  },
  'prod': {
    file: '.env-prod',
    buildCmd: 'env-cmd -f .env-prod craco build',
    outputDir: 'build-prod'
  },
  'build': {
    file: '.env',
    buildCmd: 'craco build',
    outputDir: 'build'
  }
};

// Validate environment
if (!env || !envConfig[env]) {
  console.error('Error: Invalid environment specified');
  console.error('Usage: node scripts/build-with-version.js [dev|stg|prod|build]');
  process.exit(1);
}

const { file, buildCmd, outputDir } = envConfig[env];
const envPath = path.join(__dirname, '..', file);

// Check if file exists
if (!fs.existsSync(envPath)) {
  console.error(`Error: ${file} file not found`);
  process.exit(1);
}

// Read .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Find and increment version - handles "v.1.0.1" format with quotes
const versionRegex = /REACT_APP_VERSION\s*=\s*"v\.(\d+)\.(\d+)\.(\d+)"/;
const match = envContent.match(versionRegex);

if (match) {
  const [fullMatch, major, minor, patch] = match;
  const newPatch = parseInt(patch) + 1;
  const newVersion = `v.${major}.${minor}.${newPatch}`;
  
  // Replace version in content
  envContent = envContent.replace(versionRegex, `REACT_APP_VERSION="${newVersion}"`);
  
  // Write back to file
  fs.writeFileSync(envPath, envContent, 'utf8');
  
  console.log(`✓ Version incremented to ${newVersion} in ${file}`);
  
  // Set BUILD_PATH environment variable and run build command
  console.log(`Running build for ${env} environment...`);
  console.log(`Output directory: ${outputDir}`);
  
  execSync(buildCmd, { 
    stdio: 'inherit',
    env: { ...process.env, BUILD_PATH: outputDir }
  });
  
  console.log(`✓ Build complete! Output in ${outputDir}/`);
} else {
  console.error(`Error: REACT_APP_VERSION not found in ${file}`);
  console.error('Expected format: REACT_APP_VERSION="v.1.0.1"');
  process.exit(1);
}