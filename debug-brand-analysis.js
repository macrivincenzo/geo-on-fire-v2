/**
 * DEBUG SCRIPT: Brand Analysis Issue Diagnostic
 *
 * This script helps diagnose why brand visibility shows 0%
 * Run this to check your configuration and simulate brand detection
 */

// Simulated brand detection test
function testBrandDetection(responseText, brandName) {
  const textLower = responseText.toLowerCase();
  const brandLower = brandName.toLowerCase();

  console.log('\n=== BRAND DETECTION TEST ===');
  console.log('Brand Name:', brandName);
  console.log('Response Sample:', responseText.substring(0, 200));
  console.log('\n--- Detection Methods ---');

  // Test 1: Exact match
  const exactMatch = textLower.includes(brandLower);
  console.log('1. Exact match:', exactMatch);

  // Test 2: Word boundary match
  const wordBoundaryRegex = new RegExp(`\\b${brandLower}\\b`, 'i');
  const wordBoundaryMatch = wordBoundaryRegex.test(responseText);
  console.log('2. Word boundary match:', wordBoundaryMatch);

  // Test 3: Special character handling (e.g., "Tea Burn + something")
  const specialCharRegex = new RegExp(`\\b${brandLower}(?:\\s*[+&]|\\s+[A-Z])`, 'i');
  const specialCharMatch = specialCharRegex.test(responseText);
  console.log('3. Special char match:', specialCharMatch);

  // Test 4: Case variations
  const variations = [
    brandName,
    brandName.toLowerCase(),
    brandName.toUpperCase(),
    brandName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
  ];
  console.log('4. Case variations found:', variations.some(v => responseText.includes(v)));

  return {
    exactMatch,
    wordBoundaryMatch,
    specialCharMatch,
    anyMatch: exactMatch || wordBoundaryMatch || specialCharMatch
  };
}

// Example test cases for Tea Burn
console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║  BRAND ANALYSIS DIAGNOSTIC - Tea Burn                 ║');
console.log('╚═══════════════════════════════════════════════════════╝');

// Test Case 1: Simple mention
const response1 = "Tea Burn is a nutritional supplement designed to enhance metabolism when added to tea.";
const test1 = testBrandDetection(response1, "Tea Burn");

// Test Case 2: Compound name
const response2 = "Tea Burn + Control Coffee are both popular weight loss supplements.";
const test2 = testBrandDetection(response2, "Tea Burn");

// Test Case 3: Case variations
const response3 = "TEA BURN and tea burn and Tea burn are the same product.";
const test3 = testBrandDetection(response3, "Tea Burn");

// Test Case 4: No mention
const response4 = "The best tea supplements include Green Tea Extract and Matcha.";
const test4 = testBrandDetection(response4, "Tea Burn");

console.log('\n═══════════════════════════════════════════════════════');
console.log('SUMMARY:');
console.log('Test 1 (Simple):', test1.anyMatch ? '✅ PASS' : '❌ FAIL');
console.log('Test 2 (Compound):', test2.anyMatch ? '✅ PASS' : '❌ FAIL');
console.log('Test 3 (Case variations):', test3.anyMatch ? '✅ PASS' : '❌ FAIL');
console.log('Test 4 (No mention):', !test4.anyMatch ? '✅ PASS' : '❌ FAIL');
console.log('═══════════════════════════════════════════════════════\n');

// Environment check
console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║  ENVIRONMENT CONFIGURATION CHECK                      ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

console.log('API Keys Configured (in your environment):');
console.log('  OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set');
console.log('  ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Not set');
console.log('  PERPLEXITY_API_KEY:', process.env.PERPLEXITY_API_KEY ? '✅ Set' : '❌ Not set');
console.log('  GOOGLE_GENERATIVE_AI_API_KEY:', process.env.GOOGLE_GENERATIVE_AI_API_KEY ? '✅ Set' : '❌ Not set');

console.log('\n═══════════════════════════════════════════════════════');
console.log('TROUBLESHOOTING CHECKLIST:');
console.log('═══════════════════════════════════════════════════════');

let hasAnyKey = false;
if (process.env.OPENAI_API_KEY) {
  console.log('✅ OpenAI configured');
  hasAnyKey = true;
} else {
  console.log('❌ OpenAI not configured');
}

if (process.env.ANTHROPIC_API_KEY) {
  console.log('✅ Anthropic configured');
  hasAnyKey = true;
} else {
  console.log('❌ Anthropic not configured');
}

if (process.env.PERPLEXITY_API_KEY) {
  console.log('✅ Perplexity configured');
  hasAnyKey = true;
} else {
  console.log('❌ Perplexity not configured');
}

console.log('\n═══════════════════════════════════════════════════════');
if (!hasAnyKey) {
  console.log('⚠️  CRITICAL: NO API KEYS FOUND!');
  console.log('   This will cause 0% visibility scores.');
  console.log('   Solution: Add API keys to your environment');
} else {
  console.log('✅ At least one AI provider is configured');
  console.log('   If you still see 0%, check:');
  console.log('   1. API key validity (not expired)');
  console.log('   2. API account has credits');
  console.log('   3. Check browser console for actual AI responses');
  console.log('   4. Check server logs for [BRAND-DETECTION] messages');
}
console.log('═══════════════════════════════════════════════════════\n');

// Instructions
console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║  HOW TO USE THIS DIAGNOSTIC                           ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');
console.log('1. Run this script:');
console.log('   node debug-brand-analysis.js\n');
console.log('2. Check the output for:');
console.log('   - Brand detection tests (should all pass)');
console.log('   - API key configuration (at least one ✅)');
console.log('   - Troubleshooting suggestions\n');
console.log('3. If API keys show ❌:');
console.log('   - In Vercel: Redeploy after adding env vars');
console.log('   - Locally: Create .env file with keys');
console.log('   - Restart your dev server\n');
console.log('4. If still 0% after fixing keys:');
console.log('   - Check browser DevTools → Console');
console.log('   - Look for [BRAND-DETECTION] logs');
console.log('   - Check Network tab for API responses');
console.log('   - Copy actual AI response text and test with this script\n');
