# Instagram Campaign Tracking & Attribution
## Serbian Digital Wedding Invitations

**Product:** Digital wedding invitations with 10 unique layouts
**Pricing:** Free preview, €39 Starter, €59 Standard, €89 Premium
**Target Audience:** Serbian women 23-35
**Channels:** Instagram (organic, paid ads, influencer partnerships)

---

## 1. UTM Parameter Strategy

### Naming Convention Structure
```
https://invitations.example.com?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={content}&utm_term={term}
```

### Parameter Standards

#### utm_source (Traffic Source)
- `instagram` - All Instagram traffic
- `instagram_organic` - Organic posts
- `instagram_ads` - Paid advertisements
- `instagram_influencer` - Influencer partnerships

#### utm_medium (Marketing Medium)
- `social` - Organic social content
- `cpc` - Cost per click ads
- `cpm` - Cost per thousand impressions ads
- `partnership` - Influencer collaborations
- `story` - Instagram Stories
- `reel` - Instagram Reels
- `carousel` - Carousel posts
- `bio_link` - Link in bio

#### utm_campaign (Campaign Name)
Format: `{year}{month}_{campaign_objective}_{theme}`

Examples:
- `202602_awareness_spring_weddings`
- `202603_conversion_easter_promo`
- `202604_engagement_real_couples`
- `202605_launch_new_layouts`

#### utm_content (Content Variation)
Format: `{content_type}_{variation}_{layout_theme}`

Examples:
- `reel_v1_passport`
- `carousel_v2_magazine`
- `story_v1_glass`
- `post_v3_cinema`
- `ad_creative_a_storybook`

#### utm_term (Paid Keywords/Targeting)
For paid ads only:
- `lookalike_brides`
- `engaged_women_23_30`
- `wedding_planning_interest`
- `recently_engaged`

### UTM Examples by Channel

#### Organic Instagram Posts
```
utm_source=instagram_organic
utm_medium=carousel
utm_campaign=202602_engagement_real_couples
utm_content=carousel_v1_passport
```
**Full URL:** `https://yourdomain.com?utm_source=instagram_organic&utm_medium=carousel&utm_campaign=202602_engagement_real_couples&utm_content=carousel_v1_passport`

#### Instagram Reels
```
utm_source=instagram_organic
utm_medium=reel
utm_campaign=202602_awareness_layout_showcase
utm_content=reel_v2_magazine_animation
```

#### Instagram Stories
```
utm_source=instagram_organic
utm_medium=story
utm_campaign=202602_conversion_weekend_sale
utm_content=story_v1_swipeup
```

#### Paid Ads
```
utm_source=instagram_ads
utm_medium=cpc
utm_campaign=202602_conversion_premium_layouts
utm_content=ad_creative_a_glass
utm_term=engaged_women_25_32
```

#### Influencer Posts
```
utm_source=instagram_influencer
utm_medium=partnership
utm_campaign=202602_awareness_weddingplanner_marija
utm_content=reel_testimonial_passport
```

#### Bio Link
```
utm_source=instagram_organic
utm_medium=bio_link
utm_campaign=202602_evergreen_main
utm_content=linktree_main
```

### Link Shortening Strategy
Use Bitly or similar for:
- Instagram Stories (character limit)
- Influencer tracking (cleaner links)
- A/B testing different landing pages

**Naming Convention for Shortened Links:**
- `bit.ly/pozivnice-{campaign}-{content}`
- Example: `bit.ly/pozivnice-feb-reel1`

**Always add UTM parameters BEFORE shortening**

---

## 2. KPI Framework

### Daily Tracking (Instagram Insights)

#### Engagement Metrics
- **Likes:** Track by post type (Reel, Carousel, Story)
- **Comments:** Engagement depth indicator
- **Saves:** Strong conversion intent signal
- **Shares:** Virality and social proof
- **Profile Visits:** Interest indicator
- **Engagement Rate:** (Likes + Comments + Saves + Shares) / Reach × 100

**Serbian Market Benchmarks:**
- Engagement Rate: 2-4% (good), 4-6% (excellent)
- Save Rate: 1-2% of reach
- Share Rate: 0.5-1% of reach

#### Reach Metrics
- **Impressions:** Total views
- **Reach:** Unique accounts reached
- **Follower Growth:** Net new followers
- **Non-follower Reach:** Discovery potential

**Serbian Market Benchmarks:**
- Follower Growth: 3-5% monthly (organic), 8-12% (with paid)
- Non-follower Reach: 30-50% of total reach

#### Story Metrics
- **Story Views:** Completion rate
- **Story Exits:** Drop-off points
- **Story Replies:** Direct engagement
- **Link Clicks:** Direct conversion intent
- **Link Click Rate:** Clicks / Views × 100

**Serbian Market Benchmarks:**
- Story Completion Rate: 70-80% (good)
- Link Click Rate: 1-3% of views

#### Reel Metrics
- **Plays:** Total video starts
- **Watch Time:** Average completion %
- **Plays from Non-Followers:** Discovery metric
- **Reel Shares:** Virality indicator

**Serbian Market Benchmarks:**
- Reel Completion Rate: 40-60% (good)
- Non-follower Plays: 60-80% of total

### Weekly Tracking (Instagram + Website)

#### Website Traffic (Google Analytics)
- **Sessions from Instagram:** Total visits
- **New Users from Instagram:** First-time visitors
- **Bounce Rate:** <60% good for e-commerce
- **Pages per Session:** 2.5-3.5 target
- **Average Session Duration:** 2-4 minutes target

#### Conversion Funnel
- **Link Clicks (Instagram):** UTM tracked
- **Landing Page Views:** Website arrival
- **Preview Creations:** Free trial starts
- **Add to Cart:** Purchase intent
- **Checkout Initiated:** High intent
- **Purchase Completed:** Conversion

#### Conversion Rates
- **Link Click to Landing:** 85-95%
- **Landing to Preview:** 10-15% (cold traffic), 20-30% (warm)
- **Preview to Purchase:** 8-12%
- **Overall Instagram to Purchase:** 1-3%

**Track by:**
- Campaign type (organic/paid/influencer)
- Content type (Reel/Carousel/Story)
- Layout featured
- Price tier selected

### Monthly Tracking (Performance & ROI)

#### Revenue Metrics
- **Total Revenue from Instagram:** UTM attribution
- **Revenue by Channel:** Organic vs Paid vs Influencer
- **Revenue by Content Type:** Reel vs Carousel vs Story
- **Revenue by Layout:** Which designs convert best
- **Average Order Value (AOV):** €39-€89 range
- **Revenue per Follower:** Total revenue / follower count

**Serbian Market Targets:**
- AOV: €55-€65 (blend of all tiers)
- Revenue per Follower: €0.50-€1.50/month

#### Customer Acquisition Metrics
- **Customer Acquisition Cost (CAC):** Total spend / customers
- **CAC by Channel:**
  - Organic: €5-€10 (content creation time value)
  - Paid Ads: €15-€30
  - Influencer: €20-€40
- **Cost per Click (CPC):** Ad spend / clicks
- **Cost per Thousand Impressions (CPM):** Ad spend / impressions × 1000
- **Return on Ad Spend (ROAS):** Revenue / ad spend

**Serbian Market Targets:**
- CPC: €0.20-€0.40 (Instagram ads)
- CPM: €3-€6 (Serbian audience)
- ROAS: 3:1 minimum, 5:1 target, 8:1 excellent

#### Content Performance
- **Top Performing Posts:** Engagement + conversions
- **Best Converting Content Type:** Reel/Carousel/Story
- **Best Converting Layout Featured:** Which designs sell
- **Best Posting Times:** Engagement by hour/day
- **Hashtag Performance:** Reach per hashtag set

#### Audience Insights
- **Follower Demographics:** Age, gender, location
- **Active Hours:** When followers are online
- **Content Preferences:** Reel vs Carousel engagement
- **Competitor Benchmarking:** Growth vs competitors

**Serbian Market Insights:**
- Peak Instagram Usage: 7-9 PM weekdays, 11 AM-2 PM weekends
- Top Cities: Beograd, Novi Sad, Niš, Kragujevac
- Language Preference: Serbian Cyrillic + Latin mix

---

## 3. Attribution Model

### Multi-Touch Attribution Framework

#### Attribution Window
- **First Click:** 30 days
- **Last Click:** 7 days
- **Assisted Conversions:** All touchpoints in 30-day window

#### Attribution Models to Use

**1. Last-Click Attribution (Primary)**
- Credit goes to the final Instagram touchpoint before conversion
- Use for: Campaign performance reporting, ad optimization
- Tool: Google Analytics "Last Interaction" model

**2. First-Click Attribution (Secondary)**
- Credit goes to the first Instagram touchpoint in customer journey
- Use for: Awareness campaign effectiveness, top-of-funnel content
- Tool: Google Analytics "First Interaction" model

**3. Linear Attribution (Analysis)**
- Equal credit to all touchpoints in conversion path
- Use for: Understanding multi-touch journeys, content synergy
- Tool: Google Analytics "Linear" model

**4. Time-Decay Attribution (Advanced)**
- More credit to recent touchpoints (exponential decay)
- Use for: Optimizing conversion-focused content
- Tool: Google Analytics "Time Decay" model

### Channel Attribution Rules

#### Organic Instagram
**Attribution:** Customer arrives via `utm_source=instagram_organic`

**Scenarios:**
- User sees Reel → clicks bio link → purchases same day = **Organic Reel conversion**
- User saves Carousel → returns via bio link next day → purchases = **Organic Carousel assisted conversion**
- User views Story link → doesn't click → searches brand → purchases = **Organic Story influenced conversion** (track via "Instagram" typed/direct traffic spike)

**Tracking Method:**
- Primary: UTM parameters in all bio links and Story links
- Secondary: Instagram referral traffic (instagram.com referrer)
- Tertiary: Promo codes unique to Instagram organic posts

#### Paid Instagram Ads
**Attribution:** Customer arrives via `utm_source=instagram_ads`

**Scenarios:**
- User clicks ad → purchases immediately = **Paid Ads direct conversion**
- User clicks ad → signs up for preview → purchases 3 days later = **Paid Ads assisted conversion**
- User sees ad (no click) → searches brand → purchases = **View-through conversion** (track via Facebook Ads Manager)

**Tracking Method:**
- Primary: Facebook Ads Manager conversion tracking pixel
- Secondary: UTM parameters in ad destination URLs
- Tertiary: Ad-specific promo codes

**View-Through Window:** 1 day (user saw ad but didn't click)

#### Influencer Partnerships
**Attribution:** Customer arrives via `utm_source=instagram_influencer`

**Scenarios:**
- User clicks influencer link → purchases = **Influencer direct conversion**
- User sees influencer post → searches brand → purchases = **Influencer influenced conversion**
- User clicks influencer link → doesn't buy → sees your ad → purchases = **Influencer assisted conversion**

**Tracking Method:**
- Primary: Unique UTM links per influencer
- Secondary: Influencer-specific promo codes (e.g., MARIJA10, JOVANA15)
- Tertiary: Spike in traffic/searches during influencer post period

**Attribution Split:**
- If customer uses influencer promo code: 100% influencer attribution
- If customer clicks influencer link then uses different source: 50/50 split
- If customer mentions influencer in order notes: Manual influencer attribution

### Cross-Channel Attribution

#### Scenario: Multi-Touch Journey
**Example:**
1. Day 1: User sees Instagram Reel (organic) - doesn't click
2. Day 3: User clicks Instagram Ad - views website - exits
3. Day 5: User clicks influencer Story link - creates preview
4. Day 7: User returns via Google search - purchases

**Attribution Breakdown:**
- **Last-Click:** Google Organic (100%)
- **First-Click:** Instagram Organic Reel (100%)
- **Linear:** Instagram Organic (25%), Instagram Ad (25%), Influencer (25%), Google Organic (25%)
- **Time-Decay:** Instagram Organic (10%), Instagram Ad (20%), Influencer (30%), Google Organic (40%)

**Recommended Reporting:** Use Last-Click for campaign ROI, Linear for understanding customer journey, Time-Decay for optimization decisions

### Conversion Attribution by Source

#### Direct Conversions
Customer journey: Instagram → Website → Purchase (same session)

**Attribution:** 100% to Instagram source (organic/paid/influencer based on UTM)

#### Assisted Conversions
Customer journey: Instagram → Website → Exit → Return later → Purchase

**Attribution Rules:**
- If return is within 7 days: Instagram gets "assisted conversion" credit
- Track via Google Analytics "Assisted Conversions" report
- Value: 50% of conversion value for performance calculation

#### Influenced Conversions
Customer sees Instagram content but doesn't click, then converts via other channel

**Tracking Methods:**
1. **Correlation Analysis:** Traffic spike from Instagram post correlates with Direct/Organic search increase
2. **Survey Data:** Post-purchase survey asks "How did you hear about us?" with "Instagram" option
3. **Brand Search Lift:** Monitor branded search volume increase during Instagram campaigns

**Attribution:** Track separately as "Instagram Influenced" conversions (not included in direct ROI)

### Attribution Reporting Template

```
INSTAGRAM ATTRIBUTION REPORT - [Month]

DIRECT CONVERSIONS (Last-Click Attribution)
- Organic Instagram: X conversions, €Y revenue (CAC: €Z)
- Paid Instagram Ads: X conversions, €Y revenue (CAC: €Z, ROAS: X:1)
- Influencer Partnerships: X conversions, €Y revenue (CAC: €Z per influencer)
TOTAL DIRECT: X conversions, €Y revenue

ASSISTED CONVERSIONS (Multi-Touch Attribution)
- Instagram Organic Assisted: X conversions, €Y revenue
- Instagram Ads Assisted: X conversions, €Y revenue
- Influencer Assisted: X conversions, €Y revenue
TOTAL ASSISTED: X conversions, €Y revenue

INFLUENCED CONVERSIONS (Correlation & Survey)
- Brand Search Lift: +X% during campaigns
- Survey Attribution: X customers mentioned Instagram
- Estimated Influenced Revenue: €Y
```

### Tools for Attribution Tracking

1. **Google Analytics 4:**
   - Multi-Channel Funnels report
   - Conversion Paths report
   - Model Comparison Tool

2. **Facebook Ads Manager:**
   - Attribution Settings: 7-day click, 1-day view
   - Conversion Tracking via pixel
   - Cross-device tracking

3. **Custom Tracking:**
   - Promo code usage tracking in e-commerce platform
   - Post-purchase survey with source attribution question
   - UTM parameter tracking in CRM/database

---

## 4. Instagram Insights Metrics

### Native Metrics Priority Matrix

#### HIGH PRIORITY (Check Daily)

**1. Engagement Rate**
- **Formula:** (Likes + Comments + Saves + Shares) / Reach × 100
- **Why it matters:** Overall content quality indicator
- **Serbian Benchmarks:**
  - 2-3%: Average
  - 3-5%: Good
  - 5-8%: Excellent
  - 8%+: Viral potential

**2. Saves**
- **Why it matters:** Strongest conversion intent signal (users want to reference later)
- **Serbian Benchmarks:**
  - Save rate: 1-2% of reach (wedding content typically higher)
  - Posts with 50+ saves = high-value content

**3. Shares**
- **Why it matters:** Viral potential and social proof (users recommending to engaged friends)
- **Serbian Benchmarks:**
  - Share rate: 0.5-1% of reach
  - Wedding content: 1-2% share rate (highly shareable)

**4. Profile Visits**
- **Why it matters:** Interest in your brand beyond single post
- **Serbian Benchmarks:**
  - 5-10% of reach should visit profile
  - Spike indicates viral content or influencer mention

**5. Link Clicks (Stories/Bio)**
- **Why it matters:** Direct conversion intent
- **Serbian Benchmarks:**
  - Story link clicks: 1-3% of story views
  - Bio link clicks: 2-5% of profile visits

#### MEDIUM PRIORITY (Check Weekly)

**6. Reach vs Impressions**
- **Reach:** Unique accounts
- **Impressions:** Total views
- **Ratio:** Impressions/Reach shows content re-views
- **Serbian Benchmarks:**
  - 1.2-1.5: Normal
  - 1.5-2.0: High re-engagement
  - 2.0+: Viral or saved content being revisited

**7. Non-Follower Reach**
- **Why it matters:** Discovery and growth potential
- **Serbian Benchmarks:**
  - Reels: 60-80% non-follower reach
  - Carousels: 20-40% non-follower reach
  - Stories: 5-15% non-follower reach

**8. Follower Growth Rate**
- **Formula:** (New Followers - Unfollows) / Total Followers × 100
- **Serbian Benchmarks:**
  - 3-5% monthly: Organic growth
  - 5-8% monthly: Strong organic + some paid
  - 8-12% monthly: Paid ads + viral content

**9. Stories Completion Rate**
- **Why it matters:** Content quality and narrative engagement
- **Serbian Benchmarks:**
  - 70-80%: Good completion
  - 80-90%: Excellent storytelling
  - <60%: Content too long or unengaging

**10. Reel Average Watch Time**
- **Why it matters:** Algorithm ranking factor
- **Serbian Benchmarks:**
  - 40-50%: Average
  - 50-70%: Good (algorithm boost)
  - 70%+: Excellent (high replay value)

#### LOW PRIORITY (Check Monthly)

**11. Audience Demographics**
- Age distribution (target: 23-35)
- Gender split (target: 80%+ female)
- Top cities (Beograd, Novi Sad, Niš)
- Active hours (post timing optimization)

**12. Hashtag Performance**
- Reach from hashtags
- Top performing hashtags
- Hashtag usage patterns

**13. Content Type Performance**
- Reels vs Carousels vs Single Image
- Video length performance
- Caption length impact

### Serbian Market Specific Benchmarks

#### Wedding Industry Instagram Benchmarks (Serbia)

**Engagement by Content Type:**
- Real couple testimonials: 4-7% engagement
- Layout showcases (before/after): 3-5% engagement
- Behind-the-scenes: 2-4% engagement
- Educational (how-to): 3-6% engagement
- User-generated content: 5-8% engagement

**Peak Posting Times (Serbia Time - CET/CEST):**
- **Weekdays:**
  - Morning: 8-9 AM (commute browsing)
  - Lunch: 12-1 PM (break time)
  - Evening: 7-9 PM (BEST - relaxation time)
- **Weekends:**
  - Late morning: 10 AM-12 PM (leisure browsing)
  - Afternoon: 2-4 PM
  - Evening: 7-9 PM

**Best Posting Days:**
1. Thursday (planning for weekend)
2. Sunday (wedding planning day)
3. Tuesday (mid-week engagement)
4. Saturday (leisurely browsing)

**Worst:** Monday (lowest engagement), Friday evening (going out)

#### Seasonal Trends (Serbian Wedding Market)

**High Season (April - October):**
- Higher engagement on conversion content
- Increased link clicks and purchases
- Focus on "book now" CTAs
- Peak months: May, June, September

**Low Season (November - March):**
- Higher engagement on inspiration content
- More saves and shares (planning for next year)
- Focus on "save for later" CTAs
- Exception: December (winter weddings)

**Cultural Events Impact:**
- **Slava season (various dates):** Family-focused content performs well
- **Nova Godina (New Year):** Engagement dips Dec 31 - Jan 2
- **Easter (Uskrs):** Spring wedding content peaks
- **Summer vacation (July-August):** Engagement dips mid-August

### Metrics to Ignore (Low Correlation with Conversions)

1. **Likes only:** Vanity metric without saves/shares/comments
2. **Follower count alone:** Quality > quantity
3. **Total impressions:** Focus on reach instead
4. **Video views without watch time:** Views <3 seconds don't matter

### Weekly Metrics Scorecard

```
INSTAGRAM PERFORMANCE SCORECARD - Week of [Date]

CONTENT PERFORMANCE
Posts Published: X Reels, X Carousels, X Stories
Average Engagement Rate: X.X% (target: 3-5%)
Total Saves: X (target: 50+ per post)
Total Shares: X (target: 30+ per post)
Profile Visits: X (target: 500+/week)

GROWTH METRICS
New Followers: +X (target: +50-100/week organic)
Follower Growth Rate: X.X%
Non-Follower Reach: X (target: 40% of total reach)

CONVERSION METRICS
Link Clicks: X (Stories + Bio)
Website Sessions from IG: X
Preview Creations from IG: X
Purchases from IG: X

TOP CONTENT THIS WEEK
1. [Post type]: X engagement rate, X saves
2. [Post type]: X engagement rate, X saves
3. [Post type]: X engagement rate, X saves

INSIGHTS & ACTIONS
- [Insight about what worked]
- [Insight about what didn't work]
- [Action item for next week]
```

---

## 5. Conversion Funnel

### Instagram to Purchase Funnel

```
STAGE 1: AWARENESS
↓ Instagram Impression
    - User sees your content (Reel/Carousel/Story/Ad)
    - Goal: Stop the scroll, capture attention
    - Metrics: Impressions, Reach, 3-second video views

STAGE 2: INTEREST
↓ Engagement (Like/Comment/Save/Share)
    - User interacts with content
    - Goal: Build interest and desire
    - Metrics: Engagement rate, Saves (highest intent)

STAGE 3: CONSIDERATION
↓ Profile Visit
    - User clicks to view your profile
    - Goal: Establish credibility and brand value
    - Metrics: Profile visits, Bio link clicks
    - Conversion Rate: 5-10% of reach → profile visit

STAGE 4: INTENT
↓ Link Click (Story/Bio)
    - User clicks through to website
    - Goal: Move user off Instagram to conversion environment
    - Metrics: Link clicks, Click-through rate
    - Conversion Rate: 2-5% of profile visits → link click

STAGE 5: ACTIVATION
↓ Landing Page View
    - User arrives at website
    - Goal: Maintain interest, prevent bounce
    - Metrics: Sessions, Bounce rate, Time on site
    - Conversion Rate: 85-95% of link clicks → landing page view

STAGE 6: TRIAL
↓ Preview Creation (Free)
    - User creates free wedding invitation preview
    - Goal: Product experience, value demonstration
    - Metrics: Preview starts, Preview completions
    - Conversion Rate: 10-20% of landing page views → preview creation

STAGE 7: PURCHASE INTENT
↓ Add to Cart / Select Package
    - User chooses paid tier (€39/€59/€89)
    - Goal: Commitment to purchase
    - Metrics: Add to cart rate, Package selection
    - Conversion Rate: 15-25% of preview completions → add to cart

STAGE 8: CONVERSION
↓ Checkout Initiated
    - User begins payment process
    - Goal: Minimize checkout friction
    - Metrics: Checkout start rate, Payment method selection
    - Conversion Rate: 60-70% of add to cart → checkout

STAGE 9: REVENUE
✓ Purchase Completed
    - User completes payment
    - Goal: Revenue generation, customer acquisition
    - Metrics: Transactions, Revenue, AOV
    - Conversion Rate: 70-85% of checkouts → purchase

POST-PURCHASE
↓ Advocacy
    - User shares invitation, leaves review, refers friends
    - Goal: Organic growth, user-generated content
    - Metrics: Social shares, referral conversions
```

### Funnel Conversion Rate Benchmarks

#### Overall Funnel (Instagram Impression → Purchase)

**Cold Traffic (First-time viewers):**
- Impression → Profile Visit: 3-5%
- Profile Visit → Link Click: 2-4%
- Link Click → Landing Page: 90%
- Landing Page → Preview Creation: 8-12%
- Preview Creation → Add to Cart: 12-18%
- Add to Cart → Purchase: 50-60%
- **OVERALL: 0.5-1.5% impression to purchase**

**Warm Traffic (Followers, retargeting):**
- Impression → Profile Visit: 8-12%
- Profile Visit → Link Click: 5-8%
- Link Click → Landing Page: 90%
- Landing Page → Preview Creation: 20-30%
- Preview Creation → Add to Cart: 20-30%
- Add to Cart → Purchase: 60-70%
- **OVERALL: 2-4% impression to purchase**

**Hot Traffic (Engaged followers, influencer referrals):**
- Impression → Profile Visit: 15-20%
- Profile Visit → Link Click: 10-15%
- Link Click → Landing Page: 95%
- Landing Page → Preview Creation: 30-40%
- Preview Creation → Add to Cart: 25-35%
- Add to Cart → Purchase: 70-80%
- **OVERALL: 4-8% impression to purchase**

### Funnel Drop-off Analysis

#### Critical Drop-off Points

**1. Profile Visit → Link Click (Biggest Drop-off)**
- **Target:** 2-5% conversion
- **Common Issues:**
  - Bio unclear or unappealing
  - No clear CTA in bio
  - Link not visible (below fold)
  - Lack of social proof in highlights
- **Solutions:**
  - Optimize bio with clear value proposition
  - Use "Link in bio ☝️" callouts
  - Create compelling highlights (testimonials, examples)
  - Add urgency (limited-time offers)

**2. Landing Page → Preview Creation**
- **Target:** 10-20% conversion
- **Common Issues:**
  - Slow page load (>3 seconds)
  - Unclear how to start
  - Too much friction (login required)
  - Mismatch between Instagram content and landing page
- **Solutions:**
  - Fast-loading, mobile-optimized landing page
  - Prominent "Create Free Preview" CTA above fold
  - No login required for preview
  - Match landing page design to Instagram aesthetic

**3. Add to Cart → Purchase**
- **Target:** 50-70% conversion
- **Common Issues:**
  - Unexpected costs (shipping, fees)
  - Limited payment methods
  - Complicated checkout process
  - Security concerns
- **Solutions:**
  - Display all costs upfront
  - Multiple payment options (card, PayPal, bank transfer)
  - Guest checkout option
  - Trust badges and security seals

### Funnel Tracking Setup

#### Google Analytics 4 Events

```javascript
// Stage 1-3: Instagram (tracked via UTM)
// Automatic via UTM parameters

// Stage 4: Link Click (Instagram)
// Track in Instagram Insights + Bitly

// Stage 5: Landing Page View
// Automatic page_view event in GA4

// Stage 6: Preview Creation Start
gtag('event', 'begin_preview', {
  'event_category': 'engagement',
  'event_label': 'preview_started',
  'value': 0,
  'source': '{{utm_source}}',
  'campaign': '{{utm_campaign}}'
});

// Stage 6b: Preview Completion
gtag('event', 'complete_preview', {
  'event_category': 'engagement',
  'event_label': 'preview_completed',
  'value': 0,
  'layout_selected': 'passport|magazine|cinema|etc',
  'source': '{{utm_source}}'
});

// Stage 7: Add to Cart
gtag('event', 'add_to_cart', {
  'event_category': 'ecommerce',
  'items': [{
    'item_id': 'plan_starter|standard|premium',
    'item_name': 'Digital Invitation',
    'price': 39|59|89,
    'currency': 'EUR'
  }],
  'source': '{{utm_source}}'
});

// Stage 8: Begin Checkout
gtag('event', 'begin_checkout', {
  'event_category': 'ecommerce',
  'items': [{
    'item_id': 'plan_starter|standard|premium',
    'price': 39|59|89,
    'currency': 'EUR'
  }],
  'source': '{{utm_source}}'
});

// Stage 9: Purchase
gtag('event', 'purchase', {
  'transaction_id': 'TXN123',
  'value': 59.00,
  'currency': 'EUR',
  'items': [{
    'item_id': 'plan_standard',
    'item_name': 'Standard Plan',
    'price': 59.00
  }],
  'source': '{{utm_source}}',
  'campaign': '{{utm_campaign}}'
});
```

#### Facebook Pixel Events

```javascript
// Page View (automatic)
fbq('track', 'PageView');

// Preview Started
fbq('track', 'Lead', {
  content_name: 'Preview Started',
  source: 'instagram'
});

// Add to Cart
fbq('track', 'AddToCart', {
  value: 59.00,
  currency: 'EUR',
  content_ids: ['plan_standard'],
  content_type: 'product'
});

// Initiate Checkout
fbq('track', 'InitiateCheckout', {
  value: 59.00,
  currency: 'EUR'
});

// Purchase
fbq('track', 'Purchase', {
  value: 59.00,
  currency: 'EUR',
  content_ids: ['plan_standard'],
  content_type: 'product'
});
```

### Funnel Optimization Priorities

#### Week 1-2: Top of Funnel
- Focus: Awareness → Interest → Profile Visit
- Test: Content formats (Reels vs Carousels), hooks, thumbnails
- Goal: Increase engagement rate from X% to Y%

#### Week 3-4: Middle of Funnel
- Focus: Profile Visit → Link Click → Landing Page
- Test: Bio copy, CTA placement, link shorteners
- Goal: Increase link click rate from X% to Y%

#### Month 2: Bottom of Funnel
- Focus: Landing Page → Preview → Purchase
- Test: Landing page design, CTA copy, pricing display
- Goal: Increase preview-to-purchase from X% to Y%

#### Ongoing: Retargeting
- Target users who dropped off at each stage
- Retargeting ads for:
  - Profile visitors who didn't click link
  - Landing page visitors who didn't start preview
  - Preview creators who didn't purchase

---

## 6. A/B Testing Plan

### Testing Framework

#### Test Prioritization Matrix
**Prioritize tests by:** Impact × Confidence ÷ Effort

**HIGH PRIORITY:**
- High impact, high confidence, low effort
- Example: CTA button color, post timing

**MEDIUM PRIORITY:**
- High impact, medium confidence, medium effort
- Example: Content format (Reel vs Carousel)

**LOW PRIORITY:**
- Low impact, low confidence, high effort
- Example: Complete website redesign

### Month 1: Content Format Tests

#### Test 1: Reel vs Carousel (Layout Showcase)
**Hypothesis:** Reels generate more reach, but Carousels drive more saves and conversions

**Variables:**
- **Control (A):** Reel showcasing Passport layout (15s, trending audio)
- **Variant (B):** Carousel showcasing Passport layout (5 slides, before/after/details)

**Success Metrics:**
- Primary: Saves per 1000 reach
- Secondary: Link clicks per 1000 reach
- Tertiary: Preview creations attributed

**Test Duration:** 1 week (post both on same day, same time)

**Sample Size:** Minimum 5,000 reach per variant

**Serbian Context:** Test Serbian music (turbo-folk) vs international trending audio

---

#### Test 2: Hook Variations (First 3 Seconds)
**Hypothesis:** Question hooks outperform statement hooks for engagement

**Variables:**
- **Hook A:** "Zašto plaćati štampariju hiljadu evra?" (Why pay print shop €1000?)
- **Hook B:** "Digitalne pozivnice su budućnost" (Digital invitations are the future)
- **Hook C:** "Kreirala sam pozivnicu za 5 minuta" (I created invitation in 5 minutes)

**Success Metrics:**
- Primary: 3-second watch rate
- Secondary: Average watch time %
- Tertiary: Shares

**Test Duration:** 1 week (3 Reels, same layout, posted different days)

**Winner:** Highest watch time + engagement rate

---

### Month 2: Call-to-Action Tests

#### Test 3: CTA Placement (Stories)
**Hypothesis:** Mid-story CTAs outperform end-story CTAs

**Variables:**
- **Control (A):** Link sticker at end of story (frame 5/5)
- **Variant (B):** Link sticker in middle (frame 3/5)
- **Variant (C):** Link sticker on every frame

**Success Metrics:**
- Primary: Link click rate (clicks / views)
- Secondary: Story completion rate

**Test Duration:** 1 week (3 different story series)

**Serbian Context:** Test "Klikni ovde" vs "Swipe Up" vs emoji CTA (☝️)

---

#### Test 4: CTA Copy (Bio Link)
**Hypothesis:** Benefit-focused CTA outperforms feature-focused CTA

**Variables:**
- **CTA A:** "Kreiraj svoju pozivnicu besplatno" (Create your invitation free)
- **CTA B:** "Uštedi vreme i novac" (Save time and money)
- **CTA C:** "Vidi 10 modernih dizajna" (See 10 modern designs)

**Success Metrics:**
- Primary: Bio link clicks / profile visits
- Secondary: Landing page bounce rate

**Test Duration:** 1 week per variation (rotate weekly)

**Winner:** Highest click rate + lowest bounce rate

---

### Month 3: Visual Creative Tests

#### Test 5: Thumbnail Styles (Carousel)
**Hypothesis:** Human faces in thumbnails increase click-through vs graphic design only

**Variables:**
- **Thumbnail A:** Couple holding phone with invitation
- **Thumbnail B:** Close-up of invitation design only
- **Thumbnail C:** Before/after comparison graphic

**Success Metrics:**
- Primary: Carousel swipe-through rate
- Secondary: Saves
- Tertiary: Profile visits

**Test Duration:** 1 week (3 carousels, same content, different thumbnails)

---

#### Test 6: Color Schemes (Layout Preference)
**Hypothesis:** Certain color palettes drive higher conversion by target audience preference

**Variables:**
- **Color A:** Gold + White (luxury, traditional)
- **Color B:** Blush Pink + Sage Green (modern, romantic)
- **Color C:** Navy + Copper (elegant, contemporary)

**Success Metrics:**
- Primary: Preview creation rate by color
- Secondary: Purchase rate by color
- Tertiary: AOV by color

**Test Duration:** 2 weeks (feature all three equally in content)

**Data Source:** Website analytics (which layouts/colors selected most)

---

### Month 4: Posting Strategy Tests

#### Test 7: Posting Time
**Hypothesis:** 8 PM posts outperform 12 PM posts for reach and engagement

**Variables:**
- **Time A:** 12:00 PM (lunch break)
- **Time B:** 8:00 PM (evening relaxation)
- **Time C:** 9:00 AM (morning commute)

**Success Metrics:**
- Primary: Engagement rate
- Secondary: Non-follower reach %
- Tertiary: Link clicks

**Test Duration:** 3 weeks (rotate times, same content type/quality)

**Serbian Context:** Test weekday vs weekend patterns

---

#### Test 8: Posting Frequency
**Hypothesis:** 5 posts/week maintains engagement better than 3 posts/week or 7 posts/week

**Variables:**
- **Frequency A:** 3 posts/week (Mon, Wed, Fri)
- **Frequency B:** 5 posts/week (Mon-Fri)
- **Frequency C:** 7 posts/week (daily)

**Success Metrics:**
- Primary: Average engagement rate per post
- Secondary: Follower growth rate
- Tertiary: Follower retention (unfollows)

**Test Duration:** 4 weeks (full month per frequency)

---

### Month 5: Caption Strategy Tests

#### Test 9: Caption Length
**Hypothesis:** Medium-length captions (100-150 words) outperform short (<50 words) or long (>200 words)

**Variables:**
- **Length A:** Short (30-50 words) - quick value prop
- **Length B:** Medium (100-150 words) - story + CTA
- **Length C:** Long (200+ words) - full story, emotional

**Success Metrics:**
- Primary: Engagement rate
- Secondary: Comment depth (comment word count)
- Tertiary: Saves

**Test Duration:** 3 weeks (same Reel, different caption lengths)

**Serbian Context:** Test Cyrillic vs Latin script engagement

---

#### Test 10: Emoji Usage
**Hypothesis:** Moderate emoji use (3-5 per caption) increases engagement vs none or excessive (10+)

**Variables:**
- **Emoji A:** No emojis (professional tone)
- **Emoji B:** 3-5 emojis (friendly tone)
- **Emoji C:** 10+ emojis (playful tone)

**Success Metrics:**
- Primary: Comment rate
- Secondary: Shares
- Tertiary: Saves

**Test Duration:** 3 weeks

**Serbian Context:** Test wedding-specific emojis (💒💍👰🤵) vs generic (❤️✨🎉)

---

### Month 6: Social Proof Tests

#### Test 11: Testimonial Formats
**Hypothesis:** Video testimonials drive more conversions than text testimonials

**Variables:**
- **Format A:** Text testimonial on graphic background
- **Format B:** Video testimonial (couple speaking)
- **Format C:** Before/after with testimonial overlay

**Success Metrics:**
- Primary: Link clicks per 1000 reach
- Secondary: Saves
- Tertiary: Attributed conversions

**Test Duration:** 1 week (post all three formats)

**Serbian Context:** Test Serbian language testimonials vs subtitled English

---

#### Test 12: User-Generated Content (UGC)
**Hypothesis:** Reposting customer invitations drives higher engagement and trust than branded content

**Variables:**
- **Content A:** Brand-created showcase (professional)
- **Content B:** Customer repost with testimonial
- **Content C:** Customer story takeover

**Success Metrics:**
- Primary: Engagement rate
- Secondary: Profile visits
- Tertiary: New follower rate

**Test Duration:** 2 weeks (alternate weeks)

---

### Paid Ads A/B Tests

#### Test 13: Ad Creative (Paid Campaign)
**Hypothesis:** Lifestyle imagery (couple using product) outperforms product-only imagery

**Variables:**
- **Creative A:** Product screenshot (invitation design only)
- **Creative B:** Lifestyle (couple looking at phone with invitation)
- **Creative C:** Video (invitation animation + couple reaction)

**Success Metrics:**
- Primary: CPC (Cost per Click)
- Secondary: CTR (Click-Through Rate)
- Tertiary: CPA (Cost per Acquisition)

**Test Duration:** 1 week (split budget evenly, same audience)

**Budget:** €100 per variant

---

#### Test 14: Ad Audience Targeting
**Hypothesis:** Engaged (relationship status) + wedding interest targeting outperforms broader 23-35 women targeting

**Variables:**
- **Audience A:** Women 23-35, Serbia, engaged
- **Audience B:** Women 23-35, Serbia, wedding planning interest
- **Audience C:** Women 23-35, Serbia, recently engaged (life event)
- **Audience D:** Women 23-35, Serbia, broad targeting

**Success Metrics:**
- Primary: CPA (Cost per Acquisition)
- Secondary: ROAS (Return on Ad Spend)
- Tertiary: CTR and engagement rate

**Test Duration:** 2 weeks (€50 per audience)

---

### Advanced Tests (Months 7-12)

#### Test 15: Hashtag Strategy
- **Test:** 5 hashtags vs 15 hashtags vs 30 hashtags
- **Metric:** Reach from hashtags

#### Test 16: Collaborative Posts
- **Test:** Solo posts vs collaborative posts with wedding vendors
- **Metric:** Reach and follower growth

#### Test 17: Giveaway Structure
- **Test:** "Like + Follow" vs "Tag 3 Friends" vs "Share to Story"
- **Metric:** New followers and engagement quality

#### Test 18: Pricing Display
- **Test:** Show prices in posts vs "Link in bio for pricing"
- **Metric:** Link clicks and conversion rate

#### Test 19: Urgency Tactics
- **Test:** Limited-time discount vs scarcity ("Only 10 spots") vs no urgency
- **Metric:** Conversion rate and AOV

#### Test 20: Language/Script
- **Test:** Serbian Cyrillic vs Latin vs mixed
- **Metric:** Engagement rate by region

---

### A/B Testing Best Practices

#### Sample Size Requirements
- **Minimum reach per variant:** 5,000 impressions
- **Minimum conversions:** 30 per variant (for statistical significance)
- **Confidence level:** 95% (p-value < 0.05)

#### Test Duration Guidelines
- **Content tests:** 1-2 weeks (allow algorithm to distribute)
- **Strategy tests:** 3-4 weeks (account for day-of-week variations)
- **Paid ad tests:** 3-7 days (faster data collection)

#### Control Variables
When testing one element, keep all other variables constant:
- Same posting time
- Same day of week
- Similar audience reach
- Same external factors (no major holidays)

#### Documentation Template

```
TEST NAME: [Descriptive name]
TEST ID: AB-[Number]
DATES: [Start] - [End]

HYPOTHESIS: [What you expect to happen and why]

VARIABLES:
- Control (A): [Description]
- Variant (B): [Description]
- Variant (C): [Description] (if applicable)

METRICS:
- Primary: [Most important metric]
- Secondary: [Supporting metric]
- Tertiary: [Additional insight]

RESULTS:
- Control: [Numbers]
- Variant B: [Numbers]
- Variant C: [Numbers]
- Winner: [A/B/C]
- Statistical Significance: [Yes/No, p-value]

INSIGHTS:
- [Key learning 1]
- [Key learning 2]

ACTION ITEMS:
- [What to implement based on results]
- [What to test next]
```

---

### Testing Calendar Template

```
MONTH 1: CONTENT FORMAT
Week 1: Test 1 - Reel vs Carousel
Week 2: Test 1 results analysis
Week 3: Test 2 - Hook variations (3 variants)
Week 4: Test 2 results + implement winner

MONTH 2: CALL-TO-ACTION
Week 1: Test 3 - CTA placement (Stories)
Week 2: Test 3 results analysis
Week 3: Test 4 - CTA copy (Bio)
Week 4: Test 4 results + implement winner

MONTH 3: VISUAL CREATIVE
Week 1-2: Test 5 - Thumbnail styles
Week 3-4: Test 6 - Color scheme preference

[Continue pattern...]
```

---

## 7. Reporting Template

### WEEKLY INSTAGRAM PERFORMANCE REPORT

**Report Period:** [Start Date] - [End Date]
**Report Date:** [Date]
**Reporting on:** @[instagram_handle]

---

#### EXECUTIVE SUMMARY

**Overall Performance:** [Summary sentence: up/down/stable vs last week]

**Key Wins:**
1. [Biggest achievement]
2. [Second achievement]
3. [Third achievement]

**Key Challenges:**
1. [Biggest challenge]
2. [Action taken/planned]

**Top Content:** [Post type + brief description] - [X engagement rate]

---

#### CONTENT PUBLISHED

| Day | Type | Topic | Link |
|-----|------|-------|------|
| Mon | Reel | [Topic] | [URL] |
| Wed | Carousel | [Topic] | [URL] |
| Fri | Story Series | [Topic] | [URL] |

**Total:** X Reels, X Carousels, X Stories

---

#### ENGAGEMENT METRICS

| Metric | This Week | Last Week | Change | Target | Status |
|--------|-----------|-----------|--------|--------|--------|
| **Avg Engagement Rate** | X.X% | X.X% | +/-X.X% | 3-5% | ✓/✗ |
| **Total Likes** | X | X | +/-X | - | - |
| **Total Comments** | X | X | +/-X | - | - |
| **Total Saves** | X | X | +/-X | 200+ | ✓/✗ |
| **Total Shares** | X | X | +/-X | 100+ | ✓/✗ |
| **Profile Visits** | X | X | +/-X | 500+ | ✓/✗ |

**Engagement Rate Breakdown by Content Type:**
- Reels: X.X%
- Carousels: X.X%
- Stories: X.X%

---

#### REACH & GROWTH

| Metric | This Week | Last Week | Change | Target | Status |
|--------|-----------|-----------|--------|--------|--------|
| **Total Reach** | X | X | +/-X | - | - |
| **Total Impressions** | X | X | +/-X | - | - |
| **Non-Follower Reach** | X (X%) | X (X%) | +/-X | 40%+ | ✓/✗ |
| **New Followers** | +X | +X | +/-X | +50-100 | ✓/✗ |
| **Unfollows** | -X | -X | +/-X | <20 | ✓/✗ |
| **Net Growth** | +X | +X | +/-X | +30-80 | ✓/✗ |
| **Total Followers** | X | X | +X.X% | - | - |

**Top Geographic Locations:**
1. [City]: X%
2. [City]: X%
3. [City]: X%

---

#### CONVERSION METRICS

| Metric | This Week | Last Week | Change | Target | Status |
|--------|-----------|-----------|--------|--------|--------|
| **Story Link Clicks** | X | X | +/-X | 50+ | ✓/✗ |
| **Bio Link Clicks** | X | X | +/-X | 100+ | ✓/✗ |
| **Total Link Clicks** | X | X | +/-X | 150+ | ✓/✗ |
| **Link Click Rate** | X.X% | X.X% | +/-X.X% | 2-3% | ✓/✗ |
| **Website Sessions (IG)** | X | X | +/-X | 130+ | ✓/✗ |
| **Preview Creations (IG)** | X | X | +/-X | 15-25 | ✓/✗ |
| **Purchases (IG)** | X | X | +/-X | 2-4 | ✓/✗ |
| **Revenue (IG)** | €X | €X | +/-€X | €100-250 | ✓/✗ |

**Conversion Funnel:**
- Reach → Profile Visit: X.X%
- Profile Visit → Link Click: X.X%
- Link Click → Preview: X.X%
- Preview → Purchase: X.X%

---

#### TOP PERFORMING CONTENT

**#1 BEST OVERALL**
- **Type:** [Reel/Carousel/Story]
- **Topic:** [Brief description]
- **Posted:** [Day, Time]
- **Reach:** X (X% non-followers)
- **Engagement Rate:** X.X%
- **Saves:** X
- **Shares:** X
- **Link Clicks:** X
- **Why it worked:** [1-2 sentence analysis]

**#2 BEST CONVERTING**
- **Type:** [Reel/Carousel/Story]
- **Topic:** [Brief description]
- **Link Clicks:** X
- **Preview Creations:** X
- **Purchases:** X
- **Why it worked:** [1-2 sentence analysis]

**#3 MOST ENGAGING**
- **Type:** [Reel/Carousel/Story]
- **Topic:** [Brief description]
- **Engagement Rate:** X.X%
- **Comments:** X (notable: [theme of comments])
- **Saves:** X
- **Why it worked:** [1-2 sentence analysis]

---

#### LOWEST PERFORMING CONTENT

**Underperformer:**
- **Type:** [Reel/Carousel/Story]
- **Topic:** [Brief description]
- **Engagement Rate:** X.X%
- **Why it underperformed:** [Analysis]
- **Learning:** [What to avoid/improve]

---

#### A/B TEST RESULTS (if applicable)

**Test:** [Test name]
- **Variant A:** [Description] - [Result]
- **Variant B:** [Description] - [Result]
- **Winner:** [A/B]
- **Insight:** [Key learning]
- **Action:** [What to implement]

---

#### PAID ADS PERFORMANCE (if running)

| Metric | This Week | Target | Status |
|--------|-----------|--------|--------|
| **Ad Spend** | €X | €X | - |
| **Impressions** | X | - | - |
| **Clicks** | X | - | - |
| **CPC** | €X | €0.20-0.40 | ✓/✗ |
| **CPM** | €X | €3-6 | ✓/✗ |
| **Conversions** | X | - | - |
| **CPA** | €X | €15-30 | ✓/✗ |
| **Revenue** | €X | - | - |
| **ROAS** | X:1 | 3:1 min | ✓/✗ |

**Top Performing Ad:** [Brief description]
**Learning:** [Insight from ads this week]

---

#### INSIGHTS & ANALYSIS

**What's Working:**
1. [Insight about content type/topic/format]
2. [Insight about timing/audience behavior]
3. [Insight about conversion drivers]

**What's Not Working:**
1. [Challenge/underperformance]
2. [Possible reason]
3. [Proposed solution]

**Audience Behavior Patterns:**
- Best posting times this week: [Times]
- Most engaged content type: [Reel/Carousel/Story]
- Top conversion driver: [Content topic]

**Competitive Intelligence:** (if tracking competitors)
- [Competitor name]: [Notable activity/performance]
- [Industry trend observed]

---

#### ACTION ITEMS FOR NEXT WEEK

**Content Creation:**
- [ ] Create [X] Reels on [topics]
- [ ] Create [X] Carousels on [topics]
- [ ] Plan [X] Story series on [topics]

**Optimization:**
- [ ] [Action based on this week's learnings]
- [ ] Test [specific variable]
- [ ] Implement winning [test result]

**Campaign Focus:**
- [ ] [Strategic focus for next week]
- [ ] [Specific campaign or theme]

---

### MONTHLY INSTAGRAM PERFORMANCE REPORT

**Report Period:** [Month Year]
**Report Date:** [Date]
**Reporting on:** @[instagram_handle]

---

#### EXECUTIVE SUMMARY

**Monthly Overview:** [2-3 sentences on overall performance]

**Key Achievements:**
1. [Major win #1] - [Impact]
2. [Major win #2] - [Impact]
3. [Major win #3] - [Impact]

**Challenges & Solutions:**
1. [Challenge] → [Solution implemented]
2. [Challenge] → [Solution planned]

**Month-over-Month Growth:** +/-X% followers, +/-X% engagement, +/-X% revenue

---

#### MONTHLY PERFORMANCE SNAPSHOT

| Metric | This Month | Last Month | MoM Change | YoY Change | Target | Status |
|--------|------------|------------|------------|------------|--------|--------|
| **Followers** | X | X | +X (+X%) | +X (+X%) | - | - |
| **Avg Engagement Rate** | X.X% | X.X% | +/-X.X% | - | 3-5% | ✓/✗ |
| **Total Reach** | X | X | +/-X% | - | - | - |
| **Profile Visits** | X | X | +/-X% | - | 2,000+ | ✓/✗ |
| **Link Clicks** | X | X | +/-X% | - | 600+ | ✓/✗ |
| **Website Sessions** | X | X | +/-X% | - | 500+ | ✓/✗ |
| **Previews Created** | X | X | +/-X% | - | 60-100 | ✓/✗ |
| **Purchases** | X | X | +/-X% | - | 10-15 | ✓/✗ |
| **Revenue** | €X | €X | +/-€X (+/-X%) | - | €500-900 | ✓/✗ |

---

#### CONTENT SUMMARY

**Content Published:**
- Total Reels: X
- Total Carousels: X
- Total Story Series: X
- Posting Frequency: X.X posts/week

**Content Performance by Type:**

| Type | Posts | Avg Reach | Avg Engagement Rate | Avg Saves | Total Link Clicks |
|------|-------|-----------|---------------------|-----------|-------------------|
| Reels | X | X | X.X% | X | X |
| Carousels | X | X | X.X% | X | X |
| Stories | X series | X views | X.X% completion | - | X clicks |

**Best Performing Content Theme:**
1. [Theme]: X posts, X.X% avg engagement
2. [Theme]: X posts, X.X% avg engagement
3. [Theme]: X posts, X.X% avg engagement

---

#### TOP 5 POSTS OF THE MONTH

**#1: [Post Title/Topic]**
- Type: [Reel/Carousel]
- Date: [Date]
- Reach: X (X% non-followers)
- Engagement Rate: X.X%
- Saves: X
- Link Clicks: X
- Conversions: X
- **Why it worked:** [Analysis]

**#2-5:** [Same format]

---

#### AUDIENCE INSIGHTS

**Demographics:**
- Gender: X% female, X% male
- Age: X% (23-27), X% (28-32), X% (33-35)
- Top Cities: [City] (X%), [City] (X%), [City] (X%)

**Behavior:**
- Most Active Days: [Day 1], [Day 2], [Day 3]
- Most Active Times: [Time range 1], [Time range 2]
- Avg Online Hours: [Hours]

**Growth Quality:**
- New Followers: +X
- Unfollows: -X
- Net Growth: +X
- Follower Engagement Rate: X.X% (engaged followers / total followers)

**Audience Evolution:**
- Target audience %: X% (women 23-35 in Serbia)
- Content resonance: [Improving/Stable/Declining]

---

#### CONVERSION FUNNEL ANALYSIS

**Monthly Funnel Performance:**

```
Reach: X
    ↓ (X.X%)
Profile Visits: X
    ↓ (X.X%)
Link Clicks: X
    ↓ (X.X%)
Landing Page Views: X
    ↓ (X.X%)
Preview Creations: X
    ↓ (X.X%)
Add to Cart: X
    ↓ (X.X%)
Purchases: X

Overall Conversion Rate: X.X% (reach to purchase)
```

**Funnel Improvements:**
- [Stage]: Improved from X% to Y% (+ Z%)
- [Stage]: Declined from X% to Y% (- Z%)

**Drop-off Points:**
1. [Biggest drop-off stage]: X% drop - [Reason + solution]
2. [Second drop-off stage]: X% drop - [Reason + solution]

---

#### ATTRIBUTION & ROI

**Revenue Attribution:**
- Total Instagram Revenue: €X
  - Organic: €X (X%)
  - Paid Ads: €X (X%)
  - Influencer: €X (X%)

**Cost Analysis:**
- Paid Ad Spend: €X
- Influencer Partnerships: €X
- Content Creation (est.): €X (time value)
- Total Marketing Spend: €X

**ROI Metrics:**
- **ROAS (Paid Ads):** X:1 (target: 3:1 minimum)
- **CAC (Overall):** €X per customer
  - Organic: €X
  - Paid: €X
  - Influencer: €X
- **Revenue per Follower:** €X
- **Overall Marketing ROI:** X% return

**Purchase Breakdown:**
- Starter (€39): X purchases (X%)
- Standard (€59): X purchases (X%)
- Premium (€89): X purchases (X%)
- Average Order Value: €X

---

#### PAID ADS SUMMARY (if running)

**Campaign Performance:**

| Campaign | Spend | Impressions | Clicks | CPC | Conversions | CPA | Revenue | ROAS |
|----------|-------|-------------|--------|-----|-------------|-----|---------|------|
| [Campaign 1] | €X | X | X | €X | X | €X | €X | X:1 |
| [Campaign 2] | €X | X | X | €X | X | €X | €X | X:1 |
| **TOTAL** | €X | X | X | €X | X | €X | €X | X:1 |

**Best Performing Ad:**
- Creative: [Description]
- Audience: [Target]
- CPA: €X
- ROAS: X:1
- Key Success Factor: [Why it worked]

**Ad Insights:**
- [Learning #1]
- [Learning #2]
- [Optimization implemented]

---

#### A/B TESTS CONDUCTED

**Test #1: [Test Name]**
- **Hypothesis:** [What you tested]
- **Winner:** [Variant A/B]
- **Results:** [Key numbers]
- **Implementation:** [How you applied learnings]

**Test #2: [Test Name]**
- [Same format]

**Key Learnings:**
- [Insight #1]
- [Insight #2]

---

#### COMPETITIVE ANALYSIS (if tracked)

| Competitor | Followers | MoM Growth | Avg Engagement | Content Strategy | Notable Activity |
|------------|-----------|------------|----------------|------------------|------------------|
| [Name] | X | +X% | X.X% | [Brief] | [Activity] |
| [Name] | X | +X% | X.X% | [Brief] | [Activity] |

**Industry Trends:**
- [Trend #1 observed]
- [Trend #2 observed]

**Competitive Positioning:**
- [Your advantage]
- [Opportunity to capitalize]

---

#### INSIGHTS & STRATEGIC RECOMMENDATIONS

**What's Working Well:**
1. [Strategic insight #1]
   - Evidence: [Data point]
   - Recommendation: [How to double down]

2. [Strategic insight #2]
   - Evidence: [Data point]
   - Recommendation: [How to scale]

**What Needs Improvement:**
1. [Challenge #1]
   - Impact: [Business impact]
   - Root Cause: [Analysis]
   - Solution: [Action plan]

2. [Challenge #2]
   - [Same format]

**Strategic Opportunities:**
1. [Opportunity #1]: [How to capitalize]
2. [Opportunity #2]: [How to capitalize]

---

#### NEXT MONTH STRATEGY

**Focus Areas:**
1. [Strategic priority #1]
2. [Strategic priority #2]
3. [Strategic priority #3]

**Content Plan:**
- Theme: [Monthly theme/campaign]
- Key Messages: [What to communicate]
- Content Mix: X Reels, X Carousels, X Story series

**Campaign Calendar:**
- Week 1: [Focus]
- Week 2: [Focus]
- Week 3: [Focus]
- Week 4: [Focus]

**Tests to Run:**
- [ ] [Test #1]
- [ ] [Test #2]
- [ ] [Test #3]

**Budget Allocation:**
- Organic Content: €X (time value)
- Paid Ads: €X
- Influencer: €X
- Total: €X

**Targets for Next Month:**
- Followers: +X (X% growth)
- Engagement Rate: X.X%
- Link Clicks: X
- Purchases: X
- Revenue: €X
- ROAS: X:1

---

## 8. Paid Ad Budget Allocation

### Monthly Budget Scenarios

#### SCENARIO 1: €500/Month Budget (Minimum Viable)

**Budget Split:**
- **Campaign Testing: €150 (30%)**
  - Test different audiences, creatives, messages
  - Run 3-5 small tests at €30-50 each
  - Goal: Find winning combinations

- **Awareness Campaign: €200 (40%)**
  - Reach Serbian women 23-35
  - Objective: Brand awareness, follower growth
  - Content: Best-performing organic Reels/Carousels
  - Target: 30,000-50,000 impressions

- **Conversion Campaign: €150 (30%)**
  - Retarget website visitors & engaged users
  - Objective: Preview creations & purchases
  - Content: Preview CTA, testimonials, limited offers
  - Target: 5-8 conversions

**Expected Results:**
- Reach: 40,000-60,000 people
- Profile Visits: 800-1,200
- Website Clicks: 150-250
- Conversions: 5-8 purchases
- Revenue: €250-400 (€39-59 avg)
- ROAS: 0.5:1 - 0.8:1 (building foundation)

**Weekly Budget:** €125/week
- Monday-Wednesday: €50 awareness
- Thursday-Sunday: €75 conversion (weekend wedding planning)

---

#### SCENARIO 2: €750/Month Budget (Balanced Growth)

**Budget Split:**
- **Testing & Optimization: €100 (13%)**
  - Continuous A/B testing
  - Creative testing: 2-3 variants
  - Audience refinement

- **Awareness Campaign: €250 (33%)**
  - Broader reach to cold audience
  - Objective: Brand awareness + follower growth
  - Content: Reel ads, carousel ads
  - Target: 50,000-75,000 impressions

- **Consideration Campaign: €200 (27%)**
  - Engaged audiences (profile visits, story views)
  - Objective: Website traffic, preview creations
  - Content: Layout showcases, feature highlights
  - Target: 2,000-3,000 website visits

- **Conversion Campaign: €200 (27%)**
  - Retarget warm audience
  - Objective: Purchases
  - Content: Testimonials, urgency offers, social proof
  - Target: 10-15 conversions

**Expected Results:**
- Reach: 70,000-100,000 people
- Profile Visits: 1,500-2,000
- Website Clicks: 400-600
- Preview Creations: 60-90
- Conversions: 10-15 purchases
- Revenue: €500-800
- ROAS: 0.7:1 - 1.1:1 (breakeven approaching)

**Weekly Budget:** €187.50/week

---

#### SCENARIO 3: €1,000/Month Budget (Aggressive Growth)

**Budget Split:**
- **Testing & Optimization: €100 (10%)**
  - Ongoing tests for all campaigns
  - Scale winners, kill losers quickly

- **Awareness Campaign: €300 (30%)**
  - Max reach to cold audiences
  - Objective: Brand awareness + followers
  - Target: 80,000-120,000 impressions
  - Goal: +200-300 new followers

- **Consideration Campaign: €300 (30%)**
  - Engaged audiences + lookalikes
  - Objective: Website traffic + preview creations
  - Target: 3,000-4,000 website visits
  - Goal: 80-120 preview creations

- **Conversion Campaign: €200 (20%)**
  - Retarget website visitors & preview creators
  - Objective: First-time purchases
  - Target: 15-20 conversions

- **Retention Campaign: €100 (10%)**
  - NEW: Retarget previous customers
  - Objective: Repeat purchases, upsells
  - Content: New layouts, add-on features
  - Target: 2-4 repeat purchases

**Expected Results:**
- Reach: 100,000-150,000 people
- Profile Visits: 2,500-3,500
- Website Clicks: 600-900
- Preview Creations: 100-150
- New Customers: 15-20
- Repeat Customers: 2-4
- Total Revenue: €900-1,400
- ROAS: 0.9:1 - 1.4:1 (profitable)

**Weekly Budget:** €250/week
- Higher spend Thu-Sun (wedding planning peak)

---

### Campaign Structure by Objective

#### AWARENESS CAMPAIGNS (Top of Funnel)

**Objective:** Reach new audiences, build brand recognition

**Budget:** 30-40% of total

**Campaign Type:** Reach or Brand Awareness

**Audience Targeting:**
1. **Broad Targeting:**
   - Women, 23-35, Serbia
   - Interests: Wedding planning, engaged, weddings, marriage
   - Expand: +10% lookalike of website visitors

2. **Interest Stacking:**
   - Primary: Wedding planning
   - Secondary: Graphic design, invitations, party planning
   - Tertiary: Pinterest, Etsy (design-savvy users)

**Creative:**
- Top-performing Reels (repurpose organic winners)
- Carousel ads showcasing multiple layouts
- Video ads with invitation animations

**Call-to-Action:** "Learn More" or "View Profile"

**Optimization Goal:** Impressions or Reach

**Bidding:** Lowest cost

**Placement:** Instagram Feed + Reels + Stories

**Duration:** Run continuously, adjust budget based on performance

---

#### CONSIDERATION CAMPAIGNS (Middle of Funnel)

**Objective:** Drive website traffic, preview creations

**Budget:** 25-35% of total

**Campaign Type:** Traffic or Engagement

**Audience Targeting:**
1. **Engagement Custom Audiences:**
   - Profile visitors (90 days)
   - Instagram engaged users (90 days)
   - Reel viewers (50%+ watch time, 30 days)
   - Story viewers (30 days)

2. **Lookalike Audiences:**
   - 1% lookalike of website visitors
   - 1% lookalike of preview creators
   - 1% lookalike of purchasers

3. **Interest + Behavior:**
   - Recently engaged (life event)
   - Wedding planning + actively engaged

**Creative:**
- Layout showcase videos
- Before/after comparisons
- "Create your invitation in 5 minutes" messaging
- Feature highlights (customization, themes, ease)

**Call-to-Action:** "Learn More" or "Shop Now"

**Optimization Goal:** Landing Page Views or Link Clicks

**Bidding:** Cost cap (set max CPC at €0.50)

**Placement:** Instagram Feed + Stories

**Duration:** Continuous with budget adjustments

---

#### CONVERSION CAMPAIGNS (Bottom of Funnel)

**Objective:** Drive purchases

**Budget:** 25-35% of total

**Campaign Type:** Conversions

**Audience Targeting:**
1. **Retargeting - High Intent:**
   - Website visitors (30 days)
   - Preview creators who didn't purchase (30 days)
   - Add to cart but didn't complete (30 days)
   - Video viewers 75%+ (14 days)

2. **Retargeting - Medium Intent:**
   - Website visitors (90 days)
   - Instagram engaged users - saved/shared (90 days)

3. **Lookalike - Converters:**
   - 1% lookalike of purchasers (if 50+ conversions)
   - 1-2% lookalike of high-value customers (€89 tier)

**Creative:**
- Customer testimonials (video or text)
- Social proof ("500+ couples used our invitations")
- Urgency ("Limited time: 20% off")
- Scarcity ("Only 10 premium slots this month")
- Before/after with results ("Saved €800 vs print")

**Call-to-Action:** "Shop Now" or "Sign Up"

**Optimization Goal:** Conversions (Purchase event)

**Bidding:** Cost cap (set max CPA at €25)

**Placement:** Instagram Feed + Stories (high intent users)

**Duration:** Continuous for retargeting, 7-14 days for limited offers

---

#### RETENTION CAMPAIGNS (Existing Customers)

**Objective:** Repeat purchases, upsells, referrals

**Budget:** 5-10% of total (only if budget >€800/month)

**Campaign Type:** Conversions

**Audience Targeting:**
- Previous purchasers (90-365 days)
- Previous purchasers - Starter tier only (upsell opportunity)

**Creative:**
- "New layouts available"
- "Create your baby announcement" (new product)
- "Refer a friend, get 20% off"
- "Upgrade to premium features"

**Call-to-Action:** "Shop Now" or "Learn More"

**Optimization Goal:** Conversions

**Bidding:** Lowest cost (small audience)

**Placement:** Instagram Feed + Stories

**Duration:** Campaign bursts (2 weeks every 2 months)

---

### Weekly Budget Pacing

#### Week 1: Testing & Discovery
- **Monday:** Launch awareness campaign (€50-70)
- **Tuesday-Wednesday:** Monitor performance, adjust (€30-40)
- **Thursday:** Launch consideration campaign (€40-60)
- **Friday-Sunday:** Scale top performers (€80-120)

**Focus:** Test audiences and creatives, identify winners

#### Week 2: Optimization
- **Monday:** Pause underperformers, reallocate budget (€60-80)
- **Tuesday-Thursday:** Run winning combinations (€120-160)
- **Friday-Sunday:** Increase conversion campaign budget (€70-110)

**Focus:** Scale what works, optimize for efficiency

#### Week 3-4: Scaling
- **Daily budget:** Increase winners by 20-30% incrementally
- **Weekend boost:** +50% budget Friday-Sunday (wedding planning peak)
- **Testing:** Allocate 10-15% to new creative/audience tests

**Focus:** Maintain performance while scaling spend

---

### Budget Allocation by Day of Week

#### Weekday Distribution (Monday-Thursday)
- **Daily Budget:** €15-25 (for €500 budget) or €30-40 (for €1000 budget)
- **Focus:** Awareness + Consideration
- **Best Times:** 12-1 PM, 7-9 PM (Serbia time)

#### Weekend Distribution (Friday-Sunday)
- **Daily Budget:** €30-50 (for €500 budget) or €60-90 (for €1000 budget)
- **Focus:** Consideration + Conversion
- **Best Times:** 10 AM-12 PM, 2-4 PM, 7-9 PM
- **Why:** Peak wedding planning time for couples

**Weekend Budget:** 45-50% of weekly spend

---

### Seasonal Budget Adjustments

#### HIGH SEASON (April-October)

**Budget Increase:** +30-50%

**Allocation:**
- Awareness: 25% (less needed, more organic interest)
- Consideration: 35% (capture high-intent traffic)
- Conversion: 40% (maximize sales during peak)

**Focus:** Conversion optimization, urgency messaging

#### LOW SEASON (November-March)

**Budget Decrease:** -20-30% (or maintain for year-round growth)

**Allocation:**
- Awareness: 40% (build audience for next season)
- Consideration: 40% (nurture leads)
- Conversion: 20% (opportunistic conversions)

**Focus:** Audience building, brand awareness

#### HOLIDAY PERIODS

**New Year (Dec 28 - Jan 5):** Pause ads (low engagement)
**Easter (Uskrs):** +20% budget week before (spring wedding spike)
**Summer Vacation (Mid-July - Mid-Aug):** -30% budget (low engagement)

---

### Performance Thresholds & Actions

#### IF CPC > €0.50 (Target: €0.20-0.40)
**Actions:**
- Narrow audience targeting (too broad)
- Improve creative quality/relevance
- Test different placements
- Adjust bidding strategy to cost cap

#### IF CPM > €8 (Target: €3-6)
**Actions:**
- Expand audience size (too narrow, high competition)
- Test different creative (ad fatigue)
- Adjust frequency (showing too often to same people)

#### IF CPA > €35 (Target: €15-30)
**Actions:**
- Pause campaign, analyze funnel drop-off
- Improve landing page conversion rate
- Tighten audience to higher intent
- Test conversion-focused creative (testimonials, urgency)

#### IF ROAS < 1.5:1 (Target: 3:1+)
**Actions:**
- Focus budget on retargeting only (highest intent)
- Pause awareness campaigns temporarily
- Optimize website conversion funnel
- Test pricing/offer changes

#### IF Frequency > 3 (Same person seeing ad 3+ times)
**Actions:**
- Expand audience size
- Refresh creative (ad fatigue)
- Reduce daily budget
- Set frequency cap (max 2 impressions/7 days)

---

### Budget Scaling Rules

#### When to INCREASE Budget (+20-30%)
✓ ROAS > 3:1 for 7 consecutive days
✓ CPA < €20 and stable
✓ Purchase volume increasing
✓ No frequency or delivery issues

**How:** Increase daily budget by 20% every 3 days (avoid shocking algorithm)

#### When to DECREASE Budget (-30-50%)
✗ ROAS < 1:1 for 5 consecutive days
✗ CPA > €40
✗ CPM increasing significantly (>€10)
✗ Frequency > 4

**How:** Reduce immediately, analyze, relaunch with changes

#### When to PAUSE Campaign
✗ No conversions after €100 spent
✗ CPA > €50
✗ ROAS < 0.5:1
✗ Technical issues (broken link, pixel issues)

---

### Campaign Budget Examples

#### EXAMPLE 1: €500 Monthly Budget Breakdown

**Week 1 (€125):**
- Mon-Tue: Awareness campaign - €35
- Wed-Thu: Consideration campaign - €30
- Fri-Sun: Conversion campaign (retargeting) - €60

**Week 2-4 (€375):**
- Awareness: €50/week = €150 total
- Consideration: €45/week = €135 total
- Conversion: €30/week = €90 total

**Daily Spend:** €16-18 average

---

#### EXAMPLE 2: €1,000 Monthly Budget Breakdown

**Week 1 (€250 - Testing):**
- Awareness Test A: €50
- Awareness Test B: €50
- Consideration Campaign: €70
- Conversion Retargeting: €80

**Week 2-4 (€750 - Scaling Winners):**
- Awareness (winner from W1): €90/week = €270
- Consideration: €80/week = €240
- Conversion: €70/week = €210
- Testing new variants: €10/week = €30

**Daily Spend:** €30-40 average, €50-70 weekends

---

## 9. Influencer ROI Tracking

### Influencer Partnership Framework

#### Influencer Categories

**NANO INFLUENCERS (1K-10K followers)**
- **Cost:** Free product or €50-150/post
- **Reach:** 1,000-8,000 per post
- **Engagement Rate:** 5-10% (highest)
- **Best For:** Authentic testimonials, local reach
- **Serbian Examples:** Local wedding planners, photographers

**MICRO INFLUENCERS (10K-50K followers)**
- **Cost:** €150-500/post
- **Reach:** 8,000-35,000 per post
- **Engagement Rate:** 3-7%
- **Best For:** Targeted wedding audience, credibility
- **Serbian Examples:** Wedding bloggers, bridal stylists

**MID-TIER INFLUENCERS (50K-500K followers)**
- **Cost:** €500-2,000/post
- **Reach:** 35,000-350,000 per post
- **Engagement Rate:** 2-5%
- **Best For:** Brand awareness, large campaigns
- **Serbian Examples:** Lifestyle influencers, celebrity wedding planners

#### Partnership Types

**1. PRODUCT-FOR-POST (Barter)**
- **Give:** Free Premium plan (€89 value) for their invitation
- **Get:** 1-2 Instagram posts + Stories
- **Best For:** Nano influencers, real couples getting married
- **Tracking:** Unique discount code, branded UTM link

**2. AFFILIATE PARTNERSHIP**
- **Give:** 20-30% commission per sale
- **Get:** Ongoing promotion
- **Best For:** Wedding professionals with active audiences
- **Tracking:** Unique affiliate link, commission software

**3. PAID COLLABORATION**
- **Give:** €150-500 per post
- **Get:** 1 Feed post OR 1 Reel + Stories
- **Best For:** Micro influencers with engaged wedding audience
- **Tracking:** Unique promo code, UTM link, contract terms

**4. BRAND AMBASSADOR**
- **Give:** €300-1,000/month retainer
- **Get:** 4-8 posts/month, ongoing Stories, testimonials
- **Best For:** Long-term partnership with perfect-fit influencer
- **Tracking:** Monthly performance report, dedicated discount code

---

### Influencer Selection Criteria

#### Quantitative Metrics (Objective)

**1. Audience Alignment**
- **Follower Demographics:** 60%+ women, 60%+ ages 23-35
- **Geographic:** 70%+ Serbian audience
- **Check:** Request audience insights screenshot

**2. Engagement Rate**
- **Formula:** (Likes + Comments) / Followers × 100
- **Minimum:** 3% (micro), 5% (nano)
- **Check:** Calculate manually for last 10 posts

**3. Reach & Impressions**
- **Average Reach:** 20-40% of follower count (healthy)
- **Check:** Request insights for recent posts

**4. Content Relevance**
- **Wedding Content:** 30%+ of posts about weddings/events
- **Serbian Language:** 80%+ Serbian content
- **Check:** Manual content audit

**5. Follower Quality**
- **Fake Followers Check:** Use tools (HypeAuditor, Social Blade)
- **Comment Quality:** Real comments vs generic ("Nice!" "❤️")
- **Engagement Pattern:** Consistent vs spikes (bought engagement)

#### Qualitative Metrics (Subjective)

**6. Content Quality**
- Professional photos/videos
- Clear, engaging captions
- Aesthetic alignment with your brand

**7. Authenticity**
- Genuine personality, not overly promotional
- Personal stories and experiences
- Trustworthy recommendations

**8. Brand Alignment**
- Values match (modern, affordable, digital-forward)
- Audience sentiment (positive, supportive community)
- Previous partnerships (quality brands)

---

### Influencer Outreach Process

#### Step 1: Research & Shortlist
- Create spreadsheet with potential influencers
- Calculate engagement rates
- Check audience demographics
- Prioritize top 10-20

#### Step 2: Initial Outreach (DM or Email)

**Message Template:**
```
Pozdrav [Name]! 👋

Pratim tvoj nalog i obožavam tvoj content o venčanjima/planiranju događaja!

Mi smo [Brand Name], platforma za kreiranje modernih digitalnih pozivnica za venčanja. Imamo 10 unikatnih dizajna i već 500+ parova je koristilo naše pozivnice.

Želeli bismo da sarađujemo sa tobom! Konkretno:
- [Specific offering: besplatna premium pozivnica/plaćena saradnja/affiliate partnership]
- [Deliverables: 1 Reel + Story series]
- [Timeline: tokom [mesec]]

Da li bi te ovo zanimalo? Rado bih ti poslao/la više detalja!

Srdačan pozdrav,
[Your Name]
```

#### Step 3: Partnership Agreement
- **Deliverables:** 1 Feed post OR 1 Reel + 3-5 Stories
- **Timeline:** Post within X days of receiving product/payment
- **Content Rights:** Repost rights for your account
- **Tracking:** Unique code "[INFLUENCERNAME]10" (10% discount)
- **Payment Terms:** Payment within 7 days of post (if paid)

#### Step 4: Content Brief

**Provide:**
- Brand overview & key messages
- Product features to highlight
- Visual guidelines (if any)
- UTM link: `bit.ly/pozivnice-[influencername]`
- Discount code: `[INFLUENCERNAME]10`
- Hashtags: #digitalnepozivnice #venčanje2026 #[yourhashtag]

**Request:**
- Draft caption for approval (for paid partnerships)
- Post notification 24h in advance
- Tag your account + use location tag (Serbia)

#### Step 5: Post-Launch
- Engage with comments on influencer's post
- Repost to your Stories (with permission)
- Thank influencer publicly
- Track performance daily

---

### Influencer ROI Tracking System

#### Tracking Setup

**1. Unique Discount Code**
- Format: `[INFLUENCERNAME][NUMBER]`
- Examples: `MARIJA10`, `JOVANA15`, `ANAWEDDING20`
- Track in e-commerce platform with influencer tag

**2. Unique UTM Link**
- Format: `utm_source=instagram_influencer&utm_medium=partnership&utm_campaign=202602_[campaign]&utm_content=[influencer_name]`
- Example: `bit.ly/pozivnice-marija` → full UTM URL
- Track in Google Analytics

**3. Tracking Spreadsheet**

```
| Influencer | Date | Followers | Engagement Rate | Deliverable | Cost | Code | Link | Post Reach | Link Clicks | Conversions | Revenue | ROI |
```

---

#### Key Metrics to Track

**ENGAGEMENT METRICS (Influencer's Post)**

Track within 7 days of post:

| Metric | How to Get | Target |
|--------|-----------|--------|
| **Post Reach** | Request from influencer | 30-40% of followers |
| **Post Impressions** | Request from influencer | 1.2-1.5x reach |
| **Likes** | Public data | 3-5% of reach |
| **Comments** | Public data | 0.3-0.5% of reach |
| **Saves** | Request from influencer | 1-2% of reach |
| **Shares** | Request from influencer | 0.5-1% of reach |
| **Post Engagement Rate** | (Likes+Comments+Saves+Shares)/Reach × 100 | 3-7% |

**TRAFFIC METRICS (Your Website)**

Track for 30 days post-partnership:

| Metric | Source | Target |
|--------|--------|--------|
| **Link Clicks (IG)** | Influencer insights OR Bitly | 1-3% of reach |
| **Landing Page Views** | Google Analytics | 90% of link clicks |
| **Bounce Rate** | Google Analytics | <60% |
| **Pages/Session** | Google Analytics | 2.5+ |
| **Avg Session Duration** | Google Analytics | 2+ minutes |

**CONVERSION METRICS (Your E-commerce)**

Track for 30 days (primary) + 90 days (assisted):

| Metric | Source | Calculation |
|--------|--------|-------------|
| **Preview Creations** | GA4 events | Track form submissions from influencer traffic |
| **Add to Cart** | GA4 ecommerce | Track ATC from influencer traffic |
| **Purchases (Direct)** | Discount code + UTM | Count conversions with influencer code/link |
| **Purchases (Assisted)** | GA4 multi-channel | Users who clicked influencer link but converted via other source |
| **Conversion Rate** | Calculation | Purchases / Landing Page Views × 100 |
| **Revenue (Direct)** | E-commerce | Sum of orders with influencer code |
| **Revenue (Assisted)** | GA4 | Estimate from assisted conversions |

**ROI METRICS**

| Metric | Formula | Target |
|--------|---------|--------|
| **Cost per Click** | Partnership Cost / Link Clicks | €0.50-€2 (lower than ads) |
| **Cost per Acquisition** | Partnership Cost / Conversions | €20-40 (competitive with ads) |
| **Return on Investment** | (Revenue - Cost) / Cost × 100 | 200%+ (3:1 ROAS) |
| **Customer Lifetime Value** | Avg customer value over time | Track for repeat purchases |

---

### Influencer Performance Scorecard

#### POST-CAMPAIGN REPORT (30 Days Post-Launch)

```
INFLUENCER PARTNERSHIP REPORT
Influencer: [Name] (@username)
Campaign: [Campaign name]
Launch Date: [Date]
Partnership Type: [Product/Paid/Affiliate]
Cost: €[Amount] or [Product value]

INFLUENCER POST PERFORMANCE
- Followers: X
- Post Type: [Feed/Reel/Story]
- Post Date: [Date]
- Post Reach: X (X% of followers)
- Engagement Rate: X.X%
- Link Clicks: X (X.X% click rate)

YOUR BUSINESS IMPACT
- Landing Page Views: X
- Preview Creations: X (X% conversion rate)
- Add to Cart: X
- Purchases (Direct): X via code "[CODE]"
- Purchases (Assisted): X (clicked link, converted later)
- Total Attributed Purchases: X

FINANCIAL PERFORMANCE
- Direct Revenue: €X (code redemptions)
- Assisted Revenue: €X (estimated)
- Total Attributed Revenue: €X
- Partnership Cost: €X
- Net Profit: €X
- ROI: X% (X:1 ROAS)
- Cost per Acquisition: €X

COMPARISON TO BENCHMARKS
- CPA vs Paid Ads: €X vs €Y ([Better/Worse])
- ROAS vs Paid Ads: X:1 vs Y:1 ([Better/Worse])
- Engagement vs Organic: X% vs Y% ([Better/Worse])

AUDIENCE INSIGHTS
- New Followers (your account): +X
- Profile Visits: X
- DMs mentioning influencer: X
- Brand search spike: +X% on [date]

QUALITATIVE INSIGHTS
- Content Quality: [Excellent/Good/Average]
- Authenticity: [High/Medium/Low]
- Audience Sentiment: [Positive/Neutral/Negative]
- Notable Comments: ["Quote 1", "Quote 2"]

RECOMMENDATION
☑ Re-partner (high ROI, great fit)
☐ Consider for future (decent performance)
☐ Pass (underperformed, poor fit)

NEXT STEPS
- [Action item 1]
- [Action item 2]
```

---

### Influencer Comparison Matrix

Track all influencers in one view:

| Influencer | Date | Type | Cost | Reach | Clicks | Conversions | Revenue | CPA | ROI | Re-Partner? |
|------------|------|------|------|-------|--------|-------------|---------|-----|-----|-------------|
| Marija K. | Feb 5 | Paid | €300 | 15K | 450 | 12 | €660 | €25 | 220% | ✓ Yes |
| Jovana S. | Feb 12 | Product | €89 | 8K | 180 | 5 | €295 | €18 | 331% | ✓ Yes |
| Ana M. | Feb 20 | Affiliate | €0* | 12K | 320 | 8 | €480 | €12* | ∞* | ✓ Yes |

*Affiliate: Cost = commission paid (20% of €480 = €96), so CPA = €12, ROI = infinite (no upfront cost)

---

### Attribution Models for Influencer Impact

#### 1. DIRECT ATTRIBUTION (Conservative)
Only count conversions using influencer's unique code

**Pros:** Clear, indisputable ROI
**Cons:** Underestimates true impact (many won't use code)

**Use for:** Paid partnerships requiring strict ROI proof

---

#### 2. UTM + CODE ATTRIBUTION (Recommended)
Count conversions from:
- Influencer discount code redemptions
- UTM link clicks that convert (even without code)

**Pros:** More accurate than code-only
**Cons:** Requires proper UTM tracking setup

**Use for:** Standard influencer tracking

---

#### 3. MULTI-TOUCH ATTRIBUTION (Comprehensive)
Count conversions from:
- Direct code/link (100% credit)
- Assisted conversions (50% credit) - clicked influencer link, converted via other channel later
- Influenced conversions (25% credit) - traffic/search spike during influencer post period

**Pros:** Most accurate total impact
**Cons:** Complex, requires estimation

**Use for:** Long-term partnerships, strategic decisions

---

### Red Flags & When to Walk Away

**AVOID INFLUENCERS WITH:**
- Engagement rate <2% (micro), <3.5% (nano)
- Follower spike patterns (bought followers)
- Generic comments only (bot engagement)
- No audience insights shared (hiding low quality)
- 70%+ male or non-Serbian audience (misalignment)
- Controversial content (brand risk)
- Too many sponsored posts (>50% of content)
- Poor past partnerships (low-quality brands)

---

### Influencer Partnership Goals

#### MONTH 1-2: Testing (€200-400 budget)
- Partner with 3-5 nano/micro influencers
- Mix: 2 product-for-post, 1-2 paid
- Goal: Find 1-2 high-performing partners

#### MONTH 3-4: Scaling (€400-600 budget)
- Re-partner with top performers from Month 1-2
- Add 2-3 new influencers
- Test affiliate model with wedding photographers

#### MONTH 5-6: Optimization (€500-800 budget)
- Focus budget on proven high-ROI influencers
- Establish 1-2 brand ambassadors (monthly retainer)
- Build influencer network for ongoing partnerships

---

### Influencer Content Repurposing

**Maximize ROI by reusing influencer content:**

✓ Repost to your Stories (tag influencer)
✓ Create "Customer Love" highlight with influencer testimonials
✓ Use in paid ads (with permission) - UGC ads often outperform branded
✓ Feature on website testimonials page
✓ Share in email marketing
✓ Use in future influencer outreach ("See how we featured Marija!")

**Rights:** Always get written permission for content reuse beyond Instagram repost

---

## 10. Tools Setup

### Essential Tools Stack

#### TIER 1: MUST-HAVE (Free or Low Cost)

**1. Instagram Insights (Native)**
- **Cost:** Free (with Business account)
- **Setup:** Switch to Professional account → Business
- **Use For:**
  - Post/Story/Reel performance metrics
  - Audience demographics
  - Account reach and impressions
  - Website clicks from bio/Stories
- **Limitations:** 90-day data retention, limited export options

---

**2. Meta Business Suite**
- **Cost:** Free
- **Setup:** business.facebook.com → Connect Instagram
- **Use For:**
  - Unified Instagram + Facebook management
  - Post scheduling (up to 25 posts)
  - Inbox management (DMs + comments)
  - Advanced analytics
  - Ads management
- **Pro Tip:** Better analytics export than Instagram app

---

**3. Google Analytics 4**
- **Cost:** Free
- **Setup:**
  1. Create GA4 property at analytics.google.com
  2. Add tracking code to website
  3. Enable Enhanced Measurement
  4. Set up custom events (preview_created, purchase)
- **Use For:**
  - Website traffic from Instagram (UTM tracking)
  - Conversion funnel analysis
  - Multi-channel attribution
  - E-commerce tracking
- **Critical Setup:** Configure e-commerce events (add_to_cart, begin_checkout, purchase)

**GA4 Custom Events for Wedding Invitations:**
```javascript
// Track preview creation
gtag('event', 'begin_preview', {
  'event_category': 'engagement',
  'layout_selected': 'passport',
  'source': 'instagram'
});

// Track layout selection
gtag('event', 'select_layout', {
  'event_category': 'engagement',
  'layout_name': 'magazine',
  'source': 'instagram_organic'
});

// Track purchase
gtag('event', 'purchase', {
  'transaction_id': 'TXN123',
  'value': 59.00,
  'currency': 'EUR',
  'items': [{'item_name': 'Standard Plan'}],
  'source': 'instagram_ads'
});
```

---

**4. Facebook Pixel**
- **Cost:** Free
- **Setup:**
  1. Create pixel in Meta Events Manager
  2. Add pixel code to website <head>
  3. Test with Pixel Helper extension
  4. Set up standard events
- **Use For:**
  - Conversion tracking for Instagram ads
  - Retargeting audiences (website visitors, event completers)
  - View-through conversion attribution
  - Conversion API for iOS 14+ accuracy
- **Critical Events:** PageView, Lead (preview), AddToCart, Purchase

---

**5. Bitly (or Similar Link Shortener)**
- **Cost:** Free plan (10 links/month) or Pro (€29/month)
- **Alternatives:** Rebrandly, TinyURL, ShortURL
- **Setup:** Create account, connect Instagram
- **Use For:**
  - Shorten UTM links for Stories
  - Track link click analytics
  - Create branded short links (pozivnice.link/feb-reel1)
  - A/B test different landing pages
- **Pro Tip:** Create separate Bitly link per influencer for easy tracking

---

**6. Linktree or Similar Bio Link Tool**
- **Cost:** Free or €5/month (Pro)
- **Alternatives:** Beacons, Shorby, Tap.bio, Milkshake
- **Setup:** Create page, add links, place in Instagram bio
- **Use For:**
  - Multiple links from single bio link
  - Track clicks per link
  - Change destination without updating bio
  - Add UTM parameters to each button
- **Structure:**
  - "Create Free Preview" → Landing page with utm_source=instagram_organic&utm_medium=bio_link
  - "View Layouts" → Gallery page
  - "Pricing" → Pricing page
  - "Follow on TikTok" → Cross-platform growth

---

#### TIER 2: RECOMMENDED (Paid, High Value)

**7. Later or Planoly (Scheduling & Analytics)**
- **Cost:** Later €18/month, Planoly €13/month
- **Setup:** Connect Instagram Business account
- **Use For:**
  - Visual content calendar planning
  - Post scheduling (Feed, Stories, Reels)
  - Best time to post suggestions
  - Hashtag analytics
  - First comment scheduling (hashtags)
  - Link in bio management
- **Why Worth It:** Saves 3-5 hours/week, optimize posting times
- **Alternatives:** Buffer, Hootsuite, Sprout Social (more expensive)

---

**8. Canva Pro**
- **Cost:** €11/month
- **Setup:** Create account, use Instagram templates
- **Use For:**
  - Instagram post design (Stories, Reels, Carousels)
  - Brand kit (colors, fonts, logos)
  - Video editing for Reels
  - Templates for consistent aesthetic
  - Animation for Stories
- **Why Worth It:** Professional-quality content without designer, huge template library
- **Serbian Tip:** Use Cyrillic fonts from Canva font library

---

**9. CapCut or InShot (Video Editing)**
- **Cost:** Free (CapCut), InShot €3/month
- **Setup:** Download mobile app
- **Use For:**
  - Reel editing with transitions
  - Add trending audio
  - Captions/subtitles (critical for sound-off viewing)
  - Speed adjustments
  - B-roll overlays
- **Why Worth It:** Native mobile editing for authentic Instagram aesthetic
- **Pro Tip:** Add Serbian subtitles for accessibility + algorithm boost

---

**10. Google Data Studio (Looker Studio)**
- **Cost:** Free
- **Setup:** Connect GA4, Meta data sources
- **Use For:**
  - Custom unified dashboards
  - Automated weekly/monthly reports
  - Cross-platform analytics (Instagram + website)
  - Share reports with stakeholders
- **Template:** Create "Instagram Marketing Dashboard" with:
  - Top-level KPIs (followers, engagement, revenue)
  - Channel attribution breakdown
  - Content performance table
  - Conversion funnel visualization

**Dashboard Components:**
```
ROW 1: Scorecards
[Total Followers] [Engagement Rate] [Link Clicks] [Conversions] [Revenue] [ROAS]

ROW 2: Time Series
[Followers Over Time] [Engagement Rate Trend]

ROW 3: Tables
[Top Posts by Engagement] [Top Converting Content]

ROW 4: Funnel
[Reach → Profile Visit → Link Click → Preview → Purchase]

ROW 5: Attribution
[Pie Chart: Revenue by Source] [Table: Campaign Performance]
```

---

#### TIER 3: ADVANCED (Optional, Larger Budgets)

**11. HypeAuditor or Similar (Influencer Vetting)**
- **Cost:** €299/month (overkill for small budget)
- **Free Alternatives:** Manual checks, Social Blade (basic)
- **Use For:**
  - Check influencer follower authenticity
  - Audience demographics analysis
  - Engagement quality scoring
  - Competitor influencer tracking

---

**12. Hotjar or Microsoft Clarity (Website Behavior)**
- **Cost:** Hotjar from €32/month, Clarity FREE
- **Setup:** Add tracking code to website
- **Use For:**
  - Heatmaps (where users click)
  - Session recordings (watch user behavior)
  - Conversion funnel drop-off analysis
  - Form analytics (preview creation form)
- **Why Worth It:** Understand why Instagram traffic isn't converting, optimize landing pages
- **Recommendation:** Start with FREE Microsoft Clarity

---

**13. Supermetrics or Similar (Data Integration)**
- **Cost:** From €69/month
- **Use For:**
  - Pull Instagram data into Google Sheets
  - Automated reporting
  - Cross-platform data warehouse
- **When Needed:** Only if managing multiple brands or complex reporting needs

---

### Tools Setup Checklist

#### WEEK 1: FOUNDATION

**Instagram Account Setup:**
- [ ] Switch to Professional account (Business)
- [ ] Complete profile (bio, profile pic, website link)
- [ ] Add category "Digital Creator" or "Wedding Planning Service"
- [ ] Create 5-6 Highlights (About, Layouts, Reviews, FAQ, Pricing, How It Works)
- [ ] Enable Shopping (if selling directly via Instagram)

**Meta Business Suite:**
- [ ] Create Business Manager account
- [ ] Connect Instagram account
- [ ] Add pixel to website
- [ ] Create audience lists (website visitors, engaged users)

**Google Analytics 4:**
- [ ] Create GA4 property
- [ ] Install GA4 tracking code on website
- [ ] Enable Enhanced Measurement
- [ ] Set up custom events (preview_created, layout_selected, purchase)
- [ ] Configure e-commerce tracking
- [ ] Create UTM tracking spreadsheet template

**Facebook Pixel:**
- [ ] Create pixel in Events Manager
- [ ] Install pixel code on website
- [ ] Test with Pixel Helper extension
- [ ] Set up standard events (PageView, Lead, AddToCart, Purchase)
- [ ] Create custom conversion for "Preview Created"

---

#### WEEK 2: OPTIMIZATION

**Link Management:**
- [ ] Create Bitly account
- [ ] Set up branded short domain (optional, pozivnice.link)
- [ ] Create Linktree page
- [ ] Add UTM parameters to all Linktree buttons
- [ ] Test all links on mobile

**Content Creation Tools:**
- [ ] Set up Canva Pro account
- [ ] Create brand kit (colors, fonts, logo)
- [ ] Save 10-15 Instagram templates for consistency
- [ ] Download CapCut or InShot app
- [ ] Save trending audio folder for Reels

**Scheduling & Planning:**
- [ ] Set up Later or Planoly account
- [ ] Connect Instagram Business account
- [ ] Import content calendar
- [ ] Schedule first 2 weeks of posts
- [ ] Set up first comment templates (hashtags)

---

#### WEEK 3: TRACKING & REPORTING

**UTM Parameter System:**
- [ ] Create UTM naming convention document
- [ ] Set up UTM builder spreadsheet (campaign.google.com/u/0/ams/app/utm-builder)
- [ ] Create standard UTM templates for common campaigns
- [ ] Document all active UTM campaigns

**Reporting Dashboards:**
- [ ] Create Google Data Studio dashboard
- [ ] Connect GA4 data source
- [ ] Connect Meta data source (if using Supermetrics)
- [ ] Build weekly report template
- [ ] Build monthly report template
- [ ] Schedule automated email delivery

**Analytics Review:**
- [ ] Set calendar reminder: Daily Instagram Insights check (5 min)
- [ ] Set calendar reminder: Weekly performance review (30 min)
- [ ] Set calendar reminder: Monthly deep-dive analysis (2 hours)

---

#### WEEK 4: TESTING & REFINEMENT

**Conversion Optimization:**
- [ ] Install Microsoft Clarity on website
- [ ] Review first heatmaps and recordings
- [ ] Identify drop-off points in funnel
- [ ] Implement quick wins (CTA placement, form simplification)

**Influencer Tracking:**
- [ ] Create influencer tracking spreadsheet
- [ ] Set up unique discount codes for first 3 influencers
- [ ] Create branded UTM links for each influencer
- [ ] Document influencer outreach process

**A/B Testing Setup:**
- [ ] Document first A/B test (see Section 6)
- [ ] Set up tracking for test variants
- [ ] Schedule test launch and review dates

---

### Tools Budget

**MINIMUM (€0-20/month):**
- Instagram Insights: Free
- Meta Business Suite: Free
- Google Analytics 4: Free
- Facebook Pixel: Free
- Bitly Free: Free
- Linktree Free: Free
- Canva Free: Free
- CapCut: Free
- **TOTAL: €0/month**

**RECOMMENDED (€30-50/month):**
- All free tools above
- Later or Planoly: €18/month
- Canva Pro: €11/month
- Bitly Pro: €8/month (optional)
- InShot Pro: €3/month (optional)
- **TOTAL: €29-40/month**

**ADVANCED (€100+/month):**
- All recommended tools
- Microsoft Clarity: Free (upgrade to Hotjar €32+ if needed)
- Supermetrics: €69/month (only if multi-brand)
- HypeAuditor: €299/month (only if heavy influencer focus)
- **TOTAL: €30-400/month depending on needs**

---

### Tool Integration Flow

```
INSTAGRAM CONTENT
    ↓ (create)
Canva/CapCut
    ↓ (schedule)
Later/Planoly
    ↓ (publish)
Instagram
    ↓ (engage)
Users See Content
    ↓ (click link)
Bitly/Linktree
    ↓ (UTM parameters)
Website Landing Page
    ↓ (track behavior)
Google Analytics 4 + Facebook Pixel + Microsoft Clarity
    ↓ (convert)
Preview Creation → Purchase
    ↓ (analyze)
Google Data Studio Dashboard
    ↓ (optimize)
Adjust Strategy
    ↓ (repeat)
```

---

### Tracking Validation Checklist

**Test BEFORE launching campaigns:**

- [ ] Click bio link → Check GA4 Real-Time report shows visit with utm_source=instagram
- [ ] Click Story link → Check Bitly shows click + GA4 shows session
- [ ] Create preview → Check GA4 shows custom event "begin_preview"
- [ ] Add to cart → Check GA4 + Facebook Pixel show "add_to_cart" event
- [ ] Complete purchase → Check GA4 shows "purchase" event with correct revenue
- [ ] Use influencer code → Check e-commerce backend tags order correctly
- [ ] Check Facebook Ads Manager → Pixel shows events firing correctly

**Common Issues:**
- UTM parameters stripped by redirects → Use UTM.codes redirect checker
- Pixel not firing → Check Pixel Helper extension, ensure HTTPS
- GA4 events not showing → Check debug mode, wait 24-48h for processing
- Instagram link not clickable → Use Linktree, not direct website link in bio

---

### Data Backup & Security

**CRITICAL: Back up data monthly**

- [ ] Export Instagram Insights (followers, reach, engagement) → CSV
- [ ] Export GA4 reports → Google Sheets or CSV
- [ ] Export Facebook Ads data → CSV
- [ ] Screenshot top posts for content library
- [ ] Save all UTM campaigns to spreadsheet
- [ ] Document all custom events and conversions

**Why:** Instagram only keeps 90 days of data. If you want year-over-year comparisons, you MUST export and save.

**Storage:** Google Drive folder structure:
```
/Marketing Analytics
  /Instagram
    /2026
      /02 February
        - instagram-insights-feb-2026.csv
        - top-posts-feb-2026.pdf
      /03 March
        - ...
  /Google Analytics
    /2026
      - ga4-traffic-2026.csv
      - ga4-conversions-2026.csv
  /Reports
    /Weekly
    /Monthly
```

---

### Privacy & Compliance Tools

**GDPR Compliance (Required for Serbian/EU audience):**

- [ ] Add cookie consent banner to website (use Cookiebot, free for small sites)
- [ ] Update Privacy Policy to mention Google Analytics, Facebook Pixel tracking
- [ ] Provide opt-out option for tracking
- [ ] Don't track unnecessary personal data
- [ ] Anonymize IP addresses in GA4 (enabled by default in GA4)

**Instagram Business Account Requirements:**
- [ ] Add Privacy Policy link to Instagram bio
- [ ] Comply with Instagram's Terms of Use (no fake engagement, follow/unfollow tactics)
- [ ] Disclose sponsored/gifted posts (#ad, #sponsored, #gift)

---

This completes the comprehensive Instagram Campaign Tracking & Attribution document. You now have a complete framework covering:

1. UTM Parameter Strategy
2. KPI Framework
3. Attribution Model
4. Instagram Insights Metrics
5. Conversion Funnel
6. A/B Testing Plan
7. Reporting Template
8. Paid Ad Budget Allocation
9. Influencer ROI Tracking
10. Tools Setup

All sections include Serbian market-specific benchmarks, practical examples, and actionable implementation steps.

**Relevant files:**
- /Users/Dimitrije.Stojanovic/dr/invitations/marketing/campaign-tracking.md (comprehensive tracking document created)