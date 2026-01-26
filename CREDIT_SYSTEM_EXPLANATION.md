# Credit System Setup - Complete Explanation

## 📊 Credit Costs Overview

All credit costs are defined in `config/constants.ts`:

```typescript
export const CREDITS_PER_MESSAGE = 1;              // For chat messages (if used)
export const CREDITS_PER_WEBSITE_EXTRACTION = 1;   // For website scraping/extraction
export const CREDITS_PER_BRAND_ANALYSIS = 10;      // For brand monitor analysis
export const CREDITS_PER_ACTION = 5;                // For Boost Actions (Generate Content)
```

### Summary:
- **Website Extraction** (Scraping): **1 credit** per URL scrape
- **Brand Monitor Analysis**: **10 credits** per analysis
- **Complete Brand Analysis**: **11 credits total** (1 for extraction + 10 for analysis)
- **Boost Actions** (Generate Content): **5 credits** per action execution
- **Chat Messages**: **1 credit** per message (if implemented)

---

## 🔍 Where Credits Are Checked & Deducted

### 1. Website Extraction (`app/api/brand-monitor/scrape/route.ts`)

**Credit Cost**: 1 credit

**Flow**:
1. **Check Credits** (Line 29-48):
   ```typescript
   const access = await autumn.check({
     customer_id: sessionResponse.user.id,
     feature_id: FEATURE_ID_MESSAGES,
   });
   
   if (access.data?.balance < CREDITS_PER_WEBSITE_EXTRACTION) {
     throw new InsufficientCreditsError(...);
   }
   ```

2. **Deduct Credits** (Line 64-74):
   ```typescript
   await autumn.track({
     customer_id: sessionResponse.user.id,
     feature_id: FEATURE_ID_MESSAGES,
     count: CREDITS_PER_WEBSITE_EXTRACTION,  // 1 credit
   });
   ```

**Important**: This happens when user enters a URL and clicks "Scrape" button. This is the first step before running the full analysis.

---

### 2. Brand Monitor Analysis (`app/api/brand-monitor/analyze/route.ts`)

**Credit Cost**: 10 credits

**Flow**:
1. **Check Credits** (Line 38-58):
   ```typescript
   const access = await autumn.check({
     customer_id: sessionResponse.user.id,
     feature_id: FEATURE_ID_MESSAGES,
   });
   
   if (access.data?.balance < CREDITS_PER_BRAND_ANALYSIS) {
     throw new InsufficientCreditsError(...);
   }
   ```

2. **Deduct Credits** (Line 68-87):
   ```typescript
   const trackResult = await autumn.track({
     customer_id: sessionResponse.user.id,
     feature_id: FEATURE_ID_MESSAGES,
     count: CREDITS_PER_BRAND_ANALYSIS,  // 10 credits
   });
   ```

3. **Get Remaining Credits** (Line 89-97):
   ```typescript
   const usage = await autumn.check({...});
   remainingCredits = usage.data?.balance || 0;
   ```

**Important**: Credits are deducted **BEFORE** the analysis runs, so if the analysis fails, credits are still deducted.

---

### 3. Boost Actions (`app/api/brand-monitor/execute-action/route.ts`)

**Credit Cost**: 5 credits

**Flow**:
1. **Check Credits** (Line 34-58):
   ```typescript
   const access = await autumn.check({
     customer_id: sessionResponse.user.id,
     feature_id: FEATURE_ID_MESSAGES,
   });
   
   if (access.data?.balance < CREDITS_PER_ACTION) {
     return Response.json({
       success: false,
       error: 'Insufficient credits',
       creditsRequired: CREDITS_PER_ACTION,  // 5 credits
       creditsAvailable: access.data?.balance || 0
     }, { status: 402 });
   }
   ```

2. **Deduct Credits** (Line 96-113):
   ```typescript
   const trackResult = await autumn.track({
     customer_id: sessionResponse.user.id,
     feature_id: FEATURE_ID_MESSAGES,
     count: CREDITS_PER_ACTION,  // 5 credits
   });
   ```

3. **Get Remaining Credits** (Line 123-131):
   ```typescript
   const usage = await autumn.check({...});
   remainingCredits = usage.data?.balance || 0;
   ```

4. **Return in Response** (Line 166):
   ```typescript
   return Response.json({
     success: true,
     creditsUsed: CREDITS_PER_ACTION,
     remainingCredits: remainingCredits
   });
   ```

**Important**: Credits are deducted **BEFORE** the action executes, so if execution fails, credits are still deducted.

---

## 🎯 Frontend Credit Display

### 1. Navbar (`components/navbar.tsx`)

**Shows**: Current credit balance
```typescript
const { customer } = useCustomer();
const messageUsage = customer?.features?.messages;
const remainingCredits = messageUsage ? (messageUsage.balance || 0) : 0;
```

**Displays**: "X credits" next to "Buy More Credits" button

---

### 2. Boost Actions Tab (`components/brand-monitor/boost-actions-tab.tsx`)

**Shows**: Credit cost and balance on each action card
```typescript
// Line 590: Shows credit cost
"Generate Content • 5 credits • You have {remainingCredits}"

// Line 598: Disables button if insufficient credits
disabled={remainingCredits < CREDITS_PER_ACTION}
```

**Insufficient Credits Handling**:
- Button shows "Insufficient Credits" message
- Automatically opens Buy Credits Modal when user tries to execute

---

### 3. Buy Credits Modal (`components/modals/buy-credits-modal.tsx`)

**Shows**: Top-up plans
- top-up-10: $12 → 10 credits
- top-up-25: $25 → 25 credits  
- top-up-50: $45 → 50 credits

**Purchase Flow**:
```typescript
await attach(productId);  // Autumn handles purchase
```

---

## 🔧 Autumn Integration

### Feature ID
All credits use the same feature ID: `FEATURE_ID_MESSAGES = 'messages'`

### Autumn API Calls

1. **Check Credits**:
   ```typescript
   autumn.check({
     customer_id: userId,
     feature_id: 'messages'
   })
   ```

2. **Deduct Credits**:
   ```typescript
   autumn.track({
     customer_id: userId,
     feature_id: 'messages',
     count: CREDITS_TO_DEDUCT
   })
   ```

### Initialization
```typescript
// In route files
const autumn = new Autumn({
  apiKey: process.env.AUTUMN_SECRET_KEY!,
});
```

---

## 📋 Complete Credit Flow Example

### Example: User executes a Boost Action

1. **User clicks "Execute"** on an action card
   - Frontend checks: `remainingCredits >= 5`
   - If false: Button disabled, shows "Insufficient Credits"

2. **Frontend sends request** to `/api/brand-monitor/execute-action`
   - Includes: action, brandName, brandData, etc.

3. **Backend checks credits**:
   ```typescript
   const access = await autumn.check({...});
   if (access.data.balance < 5) {
     return 402 error with "Insufficient credits"
   }
   ```

4. **Backend deducts credits**:
   ```typescript
   await autumn.track({
     customer_id: userId,
     feature_id: 'messages',
     count: 5
   });
   ```

5. **Backend executes action**:
   ```typescript
   const result = await executeBoostAction(context);
   ```

6. **Backend returns response**:
   ```typescript
   {
     success: true,
     creditsUsed: 5,
     remainingCredits: 15,  // Updated balance
     generatedContent: [...]
   }
   ```

7. **Frontend updates UI**:
   - Refreshes credit balance
   - Shows generated content
   - Updates "You have X credits" display

---

## 🚨 Error Handling

### Insufficient Credits

**Brand Monitor Analysis**:
- Throws `InsufficientCreditsError`
- Returns 402 status
- Shows error message to user

**Boost Actions**:
- Returns 402 status with error details
- Frontend automatically opens Buy Credits Modal
- User can purchase credits immediately

### Credit Deduction Failures

If `autumn.track()` fails:
- Returns 500 error
- Credits are NOT deducted
- User sees error message
- Can retry the action

---

## 📍 Key Files Reference

| File | Purpose |
|------|---------|
| `config/constants.ts` | Defines all credit costs |
| `app/api/brand-monitor/scrape/route.ts` | Website extraction credit handling (1 credit) |
| `app/api/brand-monitor/analyze/route.ts` | Brand analysis credit handling (10 credits) |
| `app/api/brand-monitor/execute-action/route.ts` | Boost action credit handling (5 credits) |
| `components/navbar.tsx` | Shows credit balance |
| `components/brand-monitor/boost-actions-tab.tsx` | Shows credit cost per action |
| `components/modals/buy-credits-modal.tsx` | Purchase credits UI |
| `hooks/useAutumnCustomer.tsx` | Hook to get customer/credit data |

---

## 💡 Important Notes

1. **Credits are deducted BEFORE execution** - This prevents users from running actions without credits, but means credits are lost if execution fails.

2. **All credits use the same feature ID** - `'messages'` is used for all credit operations, regardless of the action type.

3. **Credit balance is cached** - Frontend uses `useCustomer()` hook which may cache data. After purchases, call `refreshCustomer()` to update.

4. **Top-up plans** - Defined in `components/modals/buy-credits-modal.tsx` with fallback values. Should match products in Autumn dashboard.

5. **Credit checks happen twice**:
   - Frontend: Prevents unnecessary API calls
   - Backend: Security - always validates before deducting

---

## 🔄 Credit Refresh Flow

After credit operations, the frontend should refresh:

```typescript
// In boost-actions-tab.tsx
const refreshCustomer = useRefreshCustomer();

// After action execution
await refreshCustomer();  // Updates credit balance

// After purchase
await refreshCustomer();  // Updates credit balance
```

This ensures the UI always shows the current credit balance.
