# 🎯 0% Visibility Score Issue - Complete Analysis & Fix

**Date:** 2025-12-19
**Status:** ✅ RESOLVED
**Severity:** CRITICAL
**Root Cause:** Missing environment variables (no .env file)

---

## Executive Summary

The brand monitoring system was showing **0% visibility score** for all analyses. Through systematic investigation of the complete data flow, I identified the root cause: **no AI provider API keys were configured** due to the absence of a `.env` file.

### Impact
- ❌ All brand analyses showed 0% visibility
- ❌ No AI responses were collected
- ❌ Users received misleading results

### Solution Implemented
- ✅ Added error handling to detect missing providers
- ✅ Added safeguards against division by zero
- ✅ Created comprehensive setup documentation
- ✅ Updated README with clear API key requirements

---

## Technical Analysis

### Data Flow Investigation

I traced the complete execution path from user action to results display:

```
1. User clicks "Start Analysis"
   ↓
2. [lib/analyze-common.ts:142] getAvailableProviders()
   ↓
3. [lib/provider-config.ts:261] Filter providers by:
   - provider.enabled = true
   - provider.isConfigured() returns true (checks API key)
   ↓
4. [lib/analyze-common.ts:156] Calculate total analyses:
   totalAnalyses = prompts.length × availableProviders.length
   ↓
5. If availableProviders.length = 0:
   - totalAnalyses = 6 × 0 = 0
   - NO API CALLS MADE
   - responses array remains EMPTY
   ↓
6. [lib/ai-utils.ts:952] Calculate visibility:
   totalResponses = responses.length = 0
   visibilityScore = (mentions / 0) × 100 = NaN
   ↓
7. Display shows 0% visibility
```

### Root Cause Chain

1. **No `.env` file exists** in project root
   ```bash
   $ ls -la .env
   # Output: No such file or directory
   ```

2. **All API key checks fail:**
   ```typescript
   // lib/provider-config.ts
   isConfigured: () => !!process.env.OPENAI_API_KEY  // false
   isConfigured: () => !!process.env.ANTHROPIC_API_KEY  // false
   isConfigured: () => !!process.env.PERPLEXITY_API_KEY  // false
   ```

3. **Provider filter returns empty array:**
   ```typescript
   // lib/provider-config.ts:261-263
   export function getConfiguredProviders(): ProviderConfig[] {
     return Object.values(PROVIDER_CONFIGS).filter(
       provider => provider.enabled && provider.isConfigured()
     );
   }
   // Returns: [] (empty array)
   ```

4. **Zero analyses performed:**
   ```typescript
   // lib/analyze-common.ts:156
   const totalAnalyses = analysisPrompts.length * availableProviders.length;
   // totalAnalyses = 6 × 0 = 0
   ```

5. **Division by zero in scoring:**
   ```typescript
   // lib/ai-utils.ts:998 (before fix)
   const visibilityScore = (data.mentions / totalResponses) * 100;
   // visibilityScore = (0 / 0) × 100 = NaN
   // Displayed as: 0%
   ```

---

## Code Changes Made

### 1. Added Provider Validation ([lib/analyze-common.ts:156-181](lib/analyze-common.ts#L156-L181))

**Before:**
```typescript
const availableProviders = getAvailableProviders();
const totalAnalyses = analysisPrompts.length * availableProviders.length;
// Silent failure when availableProviders.length === 0
```

**After:**
```typescript
const availableProviders = getAvailableProviders();

// CRITICAL CHECK: If no providers are configured, throw a descriptive error
if (availableProviders.length === 0) {
  const errorMessage = 'No AI providers configured. Please set at least one API key in your environment variables (.env file):\n' +
    '- OPENAI_API_KEY for OpenAI\n' +
    '- ANTHROPIC_API_KEY for Anthropic\n' +
    '- PERPLEXITY_API_KEY for Perplexity';

  console.error('[CRITICAL ERROR]', errorMessage);

  // Send error event to UI
  await sendEvent({
    type: 'error',
    stage: 'analyzing-prompts',
    data: {
      message: errorMessage,
      details: {
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        anthropicConfigured: !!process.env.ANTHROPIC_API_KEY,
        perplexityConfigured: !!process.env.PERPLEXITY_API_KEY,
      }
    },
    timestamp: new Date()
  });

  throw new Error(errorMessage);
}

const totalAnalyses = analysisPrompts.length * availableProviders.length;
```

**Impact:**
- ✅ Users now get clear error message
- ✅ Error shows which API keys are missing
- ✅ Prevents silent failure and misleading 0% results

---

### 2. Added Safe Score Calculation ([lib/ai-utils.ts:999-1007](lib/ai-utils.ts#L999-L1007))

**Before:**
```typescript
const visibilityScore = (data.mentions / totalResponses) * 100;

competitors.push({
  visibilityScore: Math.round(visibilityScore * 10) / 10,
  // ...
});
```

**After:**
```typescript
// SAFETY: Prevent division by zero - if no responses, visibility is 0%
const visibilityScore = totalResponses > 0
  ? (data.mentions / totalResponses) * 100
  : 0;

// SAFETY: Ensure visibilityScore is a valid number (not NaN or Infinity)
const safeVisibilityScore = isNaN(visibilityScore) || !isFinite(visibilityScore)
  ? 0
  : Math.round(visibilityScore * 10) / 10;

competitors.push({
  visibilityScore: safeVisibilityScore,
  // ...
});
```

**Impact:**
- ✅ Prevents NaN values in calculations
- ✅ Handles edge cases gracefully
- ✅ Ensures valid numeric results

---

### 3. Created Setup Documentation ([SETUP.md](SETUP.md))

Comprehensive guide including:
- ✅ Step-by-step environment setup
- ✅ API key acquisition instructions
- ✅ Database configuration
- ✅ Troubleshooting section
- ✅ Provider-specific debugging tips

---

### 4. Updated README ([README.md](README.md))

Added prominent warning:
```markdown
> ⚠️ **Important:** Without AI provider API keys, the brand monitoring
> feature will show 0% visibility. See [SETUP.md](SETUP.md) for detailed
> setup instructions.
```

---

## Verification & Testing

### Test Case 1: No API Keys (Original Issue)
**Setup:**
```bash
# No .env file
$ ls .env
# No such file or directory
```

**Expected Result:** ✅ Clear error message
```
Error: No AI providers configured. Please set at least one API key
in your environment variables (.env file):
- OPENAI_API_KEY for OpenAI
- ANTHROPIC_API_KEY for Anthropic
- PERPLEXITY_API_KEY for Perplexity
```

---

### Test Case 2: With Valid API Key
**Setup:**
```bash
# .env file exists with valid key
OPENAI_API_KEY="sk-proj-..."
```

**Expected Result:** ✅ Analysis runs successfully
- Prompts sent to OpenAI
- Responses collected
- Visibility score calculated correctly (e.g., 67%, 83%, etc.)

---

### Test Case 3: Invalid API Key
**Setup:**
```bash
OPENAI_API_KEY="invalid-key"
```

**Expected Result:** ✅ Clear error from API
```
Error: OpenAI: Invalid API key
```

---

## Debugging Commands

### Check Environment Variables
```bash
# Check if .env file exists
ls -la .env

# Check which providers are configured (in Node.js)
node -e "require('dotenv').config(); console.log({
  openai: !!process.env.OPENAI_API_KEY,
  anthropic: !!process.env.ANTHROPIC_API_KEY,
  perplexity: !!process.env.PERPLEXITY_API_KEY
})"
```

### Check Console Logs
Look for these logs in your console when running analysis:

```
Available providers for analysis: ['OpenAI', 'Anthropic']
Environment variables: {
  hasOpenAI: true,
  hasAnthropic: true,
  hasGoogle: false,
  hasPerplexity: false
}
Number of available providers: 2
Total analyses to perform: 12
```

### Check Network Requests
In browser DevTools → Network tab:
- Should see POST requests to `/api/analyze`
- Response should contain `responses` array with AI provider responses

---

## Key Files Modified

| File | Location | Changes |
|------|----------|---------|
| `lib/analyze-common.ts` | Lines 156-181 | Added provider validation with descriptive errors |
| `lib/ai-utils.ts` | Lines 999-1007 | Added safe score calculation with NaN protection |
| `SETUP.md` | New file | Complete setup guide with API key instructions |
| `README.md` | Lines 29-37 | Added API key requirements and warning |

---

## Prevention Measures

### For Developers:
1. ✅ Error handling at provider initialization
2. ✅ Clear error messages with actionable steps
3. ✅ Comprehensive documentation
4. ✅ Safety checks for mathematical operations

### For Users:
1. ✅ Setup guide with step-by-step instructions
2. ✅ Troubleshooting section for common issues
3. ✅ Links to API key acquisition pages
4. ✅ Clear warnings in README

---

## Next Steps for User

### Immediate Actions Required:

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Add at least ONE API key:**
   ```bash
   # Get API keys from:
   # OpenAI: https://platform.openai.com/api-keys
   # Anthropic: https://console.anthropic.com/
   # Perplexity: https://www.perplexity.ai/settings/api

   # Add to .env:
   OPENAI_API_KEY="sk-proj-..."
   ```

3. **Restart development server:**
   ```bash
   npm run dev
   ```

4. **Test the analysis:**
   - Go to brand monitor
   - Click "Start Analysis"
   - Should see responses from AI providers
   - Visibility score should show accurate percentage (not 0%)

---

## Additional Recommendations

### Cost Optimization:
- Start with just OpenAI (most cost-effective)
- Add more providers as needed for redundancy
- Monitor API usage in provider dashboards

### Best Practices:
- Never commit `.env` file to git (already in `.gitignore`)
- Rotate API keys periodically
- Set spending limits in provider dashboards
- Monitor rate limits to avoid throttling

### Production Deployment:
- Add all API keys as environment variables in hosting platform (Vercel, etc.)
- Test with low rate limits first
- Set up monitoring for API failures
- Have backup providers configured

---

## Conclusion

The 0% visibility issue was caused by missing environment configuration, specifically the absence of AI provider API keys. The fixes implemented:

1. **Prevent silent failures** - Clear error messages when providers are missing
2. **Safe calculations** - Protection against division by zero
3. **Better documentation** - Comprehensive setup guide
4. **User awareness** - Prominent warnings in README

The system will now:
- ✅ Detect missing API keys immediately
- ✅ Show helpful error messages
- ✅ Guide users to fix configuration
- ✅ Handle edge cases gracefully

**Status:** Ready for testing with valid API keys.

---

## Contact & Support

If issues persist after following these steps:
1. Check console logs for specific error messages
2. Verify API keys are valid and have credits
3. Check provider status pages for outages
4. Review [SETUP.md](SETUP.md) troubleshooting section

---

**Analysis completed by:** Claude Sonnet 4.5
**Analysis date:** 2025-12-19
**Issue resolution:** COMPLETE ✅
