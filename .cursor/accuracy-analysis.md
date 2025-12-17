# Accuracy Analysis - Brand Mentions Counting Logic

## Current Screenshot Data:
- **Strategic Insights**: 3 mentions, 50% visibility
- **Prompts & Responses**: 4 prompts, 2 show "Brand Mentioned" tags
- **Visibility Score**: 50%

## Logic Analysis:

### Counting Logic (lib/ai-utils.ts:734-810):
1. **Process Rankings First**: If brand appears in `response.rankings`, count it and add to `mentionedInResponse` set
2. **Process brandMentioned Flag**: If `response.brandMentioned === true` AND brand NOT in `mentionedInResponse`, count it
3. **Prevents Double-Counting**: Uses `mentionedInResponse` set to ensure each response counts brand only once

### Visibility Score Calculation (lib/ai-utils.ts:862):
```typescript
visibilityScore = (data.mentions / totalResponses) * 100
```

### "Brand Mentioned" Tag Logic (prompts-responses-tab.tsx:169):
```typescript
hasBrandMention = promptResponses.some(r => r.brandMentioned)
```
Shows tag if ANY provider has `brandMentioned=true` for that prompt.

## Scenario Analysis:

If visibility = 50% and mentions = 3:
- **totalResponses = 6** (3 / 0.5 = 6)

If there are 4 prompts and 6 responses:
- Some prompts have multiple providers (likely 2 prompts with 2 providers each, 2 prompts with 1 provider each)

**Example Scenario:**
- Prompt 1: 2 providers, both mention brand → 2 mentions, shows tag ✓
- Prompt 2: 1 provider, mentions brand → 1 mention, shows tag ✓
- Prompt 3: 1 provider, no mention → 0 mentions, no tag ✓
- Prompt 4: 2 providers, no mentions → 0 mentions, no tag ✓
- **Total: 3 mentions, 2 tags, 6 responses, 50% visibility** ✓

## Potential Issues:

### Issue 1: Brand in Rankings but brandMentioned=false
- If brand is in rankings but AI didn't set `brandMentioned=true`
- Counting logic: Counts from rankings ✓
- brandMentioned flag: false
- Detection fallback: Might set `brandMentioned=true` via detection
- **Result**: Should still count correctly (once from rankings)

### Issue 2: Validation Mismatch
- Validation checks: `responses.filter(r => r.brandMentioned).length`
- But counting also includes brands from rankings
- **Potential**: If brand in rankings but `brandMentioned=false`, validation might show mismatch
- **Current**: Validation allows difference of 1, so this would only be a warning

## Conclusion:

The logic appears **CORRECT**. The discrepancy (3 mentions vs 2 tags) is expected behavior:
- **Mentions** = Total responses where brand appears (response-level)
- **Tags** = Prompts where brand appears (prompt-level, shows if ANY provider mentioned it)

The UI might be confusing users. Consider:
1. Making the distinction clearer in the UI
2. Showing "3 mentions across 2 prompts" instead of just "3 mentions"
3. Adding tooltip explaining the difference

