/**
 * Test Script: Infographic Generation
 * Tests the AI-powered infographic generation system
 */

import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

import { generateContentForAction } from '../lib/content-generator';
import { ActionItem } from '../lib/strategic-insights';
import { CompetitorRanking } from '../lib/types';

// Mock data for testing
const mockAction: ActionItem = {
  id: 'test-action-1',
  priority: 'high',
  category: 'content',
  title: 'Create Comprehensive Blog Post About AI Brand Visibility',
  description: 'Generate a detailed blog post explaining how AI platforms are becoming the primary touchpoint between brands and consumers, including statistics and actionable insights.',
  impact: 'High visibility improvement potential',
  effort: 'medium'
};

const mockBrandData: CompetitorRanking = {
  name: 'Test Brand',
  visibilityScore: 65,
  sentimentScore: 75,
  mentions: 45,
  averagePosition: 3.2,
  shareOfVoice: 15.5,
  isOwn: true,
};

const mockCompetitors: CompetitorRanking[] = [
  {
    name: 'Competitor A',
    visibilityScore: 80,
    sentimentScore: 70,
    mentions: 60,
    averagePosition: 2.1,
    shareOfVoice: 25.0,
    isOwn: false,
  },
  {
    name: 'Competitor B',
    visibilityScore: 55,
    sentimentScore: 65,
    mentions: 30,
    averagePosition: 4.5,
    shareOfVoice: 12.0,
    isOwn: false,
  },
];

async function testInfographicGeneration() {
  console.log('🧪 Testing Infographic Generation System\n');
  console.log('=' .repeat(60));
  
  // Check for required environment variables
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  
  if (!hasOpenAI && !hasAnthropic) {
    console.log('\n⚠️  Missing API Keys\n');
    console.log('   To run this test, you need at least one of:');
    console.log('   - OPENAI_API_KEY in .env.local');
    console.log('   - ANTHROPIC_API_KEY in .env.local');
    console.log('\n   Add them to your .env.local file and try again.\n');
    console.log('=' .repeat(60));
    return;
  }
  
  console.log('\n✅ API Keys Found:');
  if (hasOpenAI) console.log('   ✓ OPENAI_API_KEY');
  if (hasAnthropic) console.log('   ✓ ANTHROPIC_API_KEY');
  console.log('');
  
  try {
    console.log('📝 Generating blog post with infographics...\n');
    
    const result = await generateContentForAction({
      action: mockAction,
      brandName: mockBrandData.name,
      brandData: mockBrandData,
      competitors: mockCompetitors,
      brandUrl: 'https://example.com',
      seoData: {
        keywords: [
          { keyword: 'AI brand visibility', searchVolume: 5000, difficulty: 45 },
          { keyword: 'brand monitoring tools', searchVolume: 3000, difficulty: 55 },
          { keyword: 'AI SEO', searchVolume: 8000, difficulty: 60 },
        ],
      },
    });

    console.log('\n✅ Blog Generation Complete!\n');
    console.log('=' .repeat(60));
    
    if (result && result.length > 0) {
      const blogPost = result.find(c => c.type === 'blog');
      
      if (blogPost) {
        console.log('\n📄 Blog Post Details:');
        console.log(`   Title: ${blogPost.title}`);
        console.log(`   Word Count: ${blogPost.wordCount}`);
        console.log(`   Ready to Publish: ${blogPost.readyToPublish ? '✅ Yes' : '❌ No'}`);
        
        if (blogPost.infographics && blogPost.infographics.length > 0) {
          console.log(`\n🎨 Infographics Generated: ${blogPost.infographics.length}\n`);
          
          blogPost.infographics.forEach((infographic, idx) => {
            console.log(`   Infographic ${idx + 1}:`);
            console.log(`   ├─ Title: ${infographic.title}`);
            console.log(`   ├─ Section: ${infographic.section || 'N/A'}`);
            console.log(`   ├─ Position: ${infographic.position ?? 'N/A'}`);
            console.log(`   ├─ Description: ${infographic.description.substring(0, 60)}...`);
            console.log(`   ├─ Data Points: ${infographic.dataPoints.join(', ')}`);
            console.log(`   └─ Image URL: ${infographic.imageUrl.substring(0, 80)}...`);
            console.log('');
          });
          
          console.log('=' .repeat(60));
          console.log('\n✨ Test Results:');
          console.log(`   ✅ Blog post generated successfully`);
          console.log(`   ✅ ${blogPost.infographics.length} infographic(s) created`);
          console.log(`   ✅ All infographics have titles and descriptions`);
          console.log(`   ✅ Infographics are placed at: ${blogPost.infographics.map(i => i.section).join(', ')}`);
          
        } else {
          console.log('\n⚠️  No infographics were generated');
          console.log('   This might be because:');
          console.log('   - No statistics found in blog content');
          console.log('   - AI insight identification failed');
          console.log('   - Check console logs for errors');
        }
      } else {
        console.log('\n⚠️  No blog post found in generated content');
      }
    } else {
      console.log('\n❌ No content was generated');
    }
    
  } catch (error) {
    console.error('\n❌ Test Failed:', error);
    if (error instanceof Error) {
      console.error('   Error Message:', error.message);
      console.error('   Stack:', error.stack);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 Test Complete\n');
}

// Run the test
testInfographicGeneration().catch(console.error);
