// Simple test to check if the main components can be imported
const { execSync } = require('child_process');
const path = require('path');

console.log('Testing SAMVAD Frontend Build...');

try {
    // Try to run the build command
    console.log('Running build...');
    const result = execSync('npm run build', { 
        cwd: path.join(__dirname),
        encoding: 'utf8',
        stdio: 'pipe'
    });
    
    console.log('✅ Build successful!');
    console.log(result);
} catch (error) {
    console.log('❌ Build failed:');
    console.log(error.stdout);
    console.log(error.stderr);
    process.exit(1);
}
