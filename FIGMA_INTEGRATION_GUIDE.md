# Figma Infographic Integration Guide

## ✅ What's Been Implemented

Your blog agent now **automatically creates infographics** when generating blog posts! The system uses your Figma design structure to create professional infographics that match your exact design.

## 🎨 How to Get Your Figma Code

### Step 1: Open Your Figma Design
1. Go to your Figma file with the infographic design
2. Select the infographic frame/component

### Step 2: Get the Code
1. Click the **`</>` Code** button in the top-right corner of Figma
2. You'll see HTML/CSS code for your design
3. **Copy the entire HTML/CSS code**

### Step 3: Update the Template
1. Open `lib/infographic-renderer.ts`
2. Find the `DEFAULT_INFographic_TEMPLATE` constant
3. Replace it with your Figma code
4. Replace dynamic text with template variables:
   - `{{TITLE}}` - Main headline
   - `{{PRIMARY_METRIC}}` - First statistic (e.g., "40%")
   - `{{PRIMARY_LABEL}}` - Label for first metric (e.g., "Traffic Increase")
   - `{{SECONDARY_METRIC}}` - Second statistic
   - `{{SECONDARY_LABEL}}` - Label for second metric
   - `{{TERTIARY_METRIC}}` - Third statistic
   - `{{TERTIARY_LABEL}}` - Label for third metric
   - `{{DESCRIPTION}}` - Supporting text
   - `{{SHIFT_TEXT}}`, `{{CHALLENGE_TEXT}}`, `{{SOLUTION_TEXT}}` - Column texts

## 🔧 How It Works

1. **Blog Post Generated** → System extracts statistics (40%, Top 3, #1, etc.)
2. **Infographic Data Created** → Statistics are formatted for your template
3. **HTML Rendered** → Your Figma design structure is used with new data
4. **Image Generated** → HTML is converted to PNG image
5. **Added to Blog** → Infographic is automatically inserted into blog post

## 📝 Example Template Variables

Your Figma code should have placeholders like this:

```html
<h1>{{TITLE}}</h1>
<div class="metric">{{PRIMARY_METRIC}}</div>
<div class="label">{{PRIMARY_LABEL}}</div>
<p>{{DESCRIPTION}}</p>
```

## 🚀 Installation

Run this to install required dependencies:

```bash
npm install puppeteer html-to-image
```

## ⚙️ Configuration

### Option 1: Use Default Template
The default template matches your Figma design structure. It will work out of the box.

### Option 2: Use Custom Figma Code
1. Copy your Figma HTML/CSS code
2. Paste it into `lib/infographic-renderer.ts` as the `DEFAULT_INFographic_TEMPLATE`
3. Replace text with template variables ({{VARIABLE}})

### Option 3: Load Template Dynamically
You can also load templates from a file or API:

```typescript
import { loadFigmaTemplate } from './infographic-renderer';

const customTemplate = loadFigmaTemplate(yourFigmaCode);
```

## 🎯 What Gets Generated

When you create a blog post, the system automatically:

1. ✅ Extracts statistics from blog content (40%, Top 3, #1, etc.)
2. ✅ Creates infographic data matching your design structure
3. ✅ Renders HTML using your Figma template
4. ✅ Converts to high-quality PNG image
5. ✅ Adds infographic to blog post at the start

## 📊 Infographic Structure

Each infographic includes:
- **Title**: Main headline
- **Metrics**: 3 key statistics (primary, secondary, tertiary)
- **Description**: Supporting text
- **Image URL**: Generated PNG image
- **Placement**: Automatically inserted into blog post

## 🔍 Testing

To test the integration:

1. Generate a blog post using your content generator
2. Check the `infographics` array in the returned content
3. View the blog preview to see infographics embedded

## 🐛 Troubleshooting

**Infographics not generating?**
- Check that statistics are present in blog content (40%, Top 3, etc.)
- Verify Puppeteer is installed: `npm install puppeteer`
- Check console logs for errors

**Images not rendering?**
- Ensure your Figma template has correct CSS
- Verify template variables are properly replaced
- Check that Puppeteer can launch (may need system dependencies)

**Design doesn't match?**
- Update the `DEFAULT_INFographic_TEMPLATE` with your exact Figma code
- Ensure template variables match your design structure

## 📝 Next Steps

1. **Get your Figma code** (click `</>` Code button in Figma)
2. **Update the template** in `lib/infographic-renderer.ts`
3. **Install dependencies**: `npm install puppeteer html-to-image`
4. **Test** by generating a blog post

Your infographics will now be created automatically with your exact Figma design! 🎉
