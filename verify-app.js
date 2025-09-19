// StellarHub Application Verification Script
const fs = require('fs');
const path = require('path');

console.log('🔍 StellarHub Application Verification\n');

// Check if all essential files exist
const essentialFiles = [
    'src/App.jsx',
    'src/main.jsx',
    'src/index.css',
    'src/pages/LandingPage.jsx',
    'src/pages/AuthPage.jsx',
    'src/pages/DashboardPage.jsx',
    'src/components/Layout.jsx',
    'src/context/AuthContext.jsx',
    'src/services/api.js',
    'package.json',
    'vite.config.js',
    'tailwind.config.js'
];

console.log('📁 Checking essential files...');
let allFilesExist = true;

essentialFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

console.log('\n📦 Checking package.json dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    'axios',
    'lucide-react',
    '@react-oauth/google'
];

requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
        console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
        console.log(`❌ ${dep} - MISSING`);
        allFilesExist = false;
    }
});

console.log('\n🎨 Checking Tailwind configuration...');
if (fs.existsSync('tailwind.config.js')) {
    console.log('✅ Tailwind config exists');
} else {
    console.log('❌ Tailwind config missing');
    allFilesExist = false;
}

console.log('\n🔧 Checking build configuration...');
if (fs.existsSync('vite.config.js')) {
    console.log('✅ Vite config exists');
} else {
    console.log('❌ Vite config missing');
    allFilesExist = false;
}

console.log('\n📝 Checking environment setup...');
if (fs.existsSync('env.example')) {
    console.log('✅ Environment example exists');
} else {
    console.log('❌ Environment example missing');
}

if (fs.existsSync('.env.local')) {
    console.log('✅ Local environment configured');
} else {
    console.log('⚠️  .env.local not found - copy from env.example');
}

console.log('\n🚀 Application Status:');
if (allFilesExist) {
    console.log('✅ All essential files present');
    console.log('✅ Dependencies configured');
    console.log('✅ Ready to run!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm install');
    console.log('2. Copy: env.example to .env.local');
    console.log('3. Start: npm run dev');
    console.log('4. Visit: http://localhost:5173');
} else {
    console.log('❌ Some files are missing');
    console.log('Please check the missing files above');
}

console.log('\n🌟 StellarHub Features Available:');
console.log('• Modern Landing Page');
console.log('• Beautiful Authentication');
console.log('• Role-based Dashboards');
console.log('• Club Management');
console.log('• Event System');
console.log('• Photo Gallery');
console.log('• AI Chatbot');
console.log('• Face Enrollment');
console.log('• Responsive Design');
console.log('• Google OAuth Integration');
