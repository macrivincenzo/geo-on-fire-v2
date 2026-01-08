# Debug Guide: Why Competitors Are Empty

## Step-by-Step Debug Process

### 1. Check Browser Console
After clicking "Identify Competitors", look for these debug logs:

```
Debug - extractedCompetitors: [...]
Debug - industryCompetitors: [...]
Debug - company.industry: "..."
Debug - competitorMap before filter: [...]
Debug - shouldFilterGiants: true/false
Debug - companyIsGiant: true/false
Identified competitors: [...]
```

### 2. What Each Log Tells You

**`extractedCompetitors`**: 
- Should contain competitors found during scraping (e.g., ["Nike", "Adidas", "New Balance"])
- If empty `[]`, scraping didn't find competitors
- If contains giants, they'll be filtered out

**`industryCompetitors`**:
- Should contain default competitors for the industry
- For "direct-to-consumer brand", returns placeholders: ["Competitor 1", "Competitor 2", ...]
- These get filtered out as placeholders

**`competitorMap before filter`**:
- Shows all competitors BEFORE filtering
- If this is empty, no competitors were found from scraping OR industry defaults

**`shouldFilterGiants`**:
- Should be `true` for Allbirds (not a giant)
- If `false`, giants won't be filtered

**`companyIsGiant`**:
- Should be `false` for Allbirds
- If `true`, something is wrong with detection

### 3. Common Issues

**Issue 1: No competitors from scraping**
- Scraping AI might not be extracting competitors
- Check if `extractedCompetitors` is empty
- Solution: Improve scraping prompt or manually add competitors

**Issue 2: All competitors are giants**
- Scraping finds Nike, Adidas, etc.
- Filter removes them all
- Result: Empty array
- Solution: Filter is working, but scraping needs to find niche competitors

**Issue 3: Industry has no defaults**
- "direct-to-consumer brand" has no real competitors
- Only returns placeholders
- Placeholders get filtered out
- Solution: Add default competitors for DTC brands OR rely on scraping

### 4. Quick Fix Test

To test if filter is working:
1. Temporarily comment out the giant filter
2. See if competitors appear
3. If yes, filter is working but removing all competitors
4. If no, scraping isn't finding competitors

### 5. Files to Check

1. `lib/scrape-utils.ts` - Line 17: `competitors: z.array(z.string()).optional()`
   - This is where competitors are extracted from website
   
2. `components/brand-monitor/brand-monitor.tsx` - Line 286-365
   - This is where competitors are filtered
   
3. `lib/brand-monitor-utils.ts` - Line 208-314
   - This is where industry defaults are returned

