/**
 * Competitor Analysis Mock Data
 * 
 * Provides realistic mock data for the competitor analysis feature.
 * Structured to easily swap for real API data later.
 */

import type { 
  CompetitorAnalysis, 
  LeaderboardEntry, 
  PillarScore, 
  FastestMove, 
  DailyTask, 
  SuburbContentIdea 
} from '@/types/competitor-analysis';

/**
 * Generate mock leaderboard data
 */
function generateLeaderboard(suburb: string, currentUserRank: number): LeaderboardEntry[] {
  const competitors = [
    { name: 'Sarah Mitchell', agency: 'Ray White', reason: 'Consistently posts local market updates on Instagram' },
    { name: 'James Chen', agency: 'McGrath', reason: 'Has 47 Google reviews averaging 4.9 stars' },
    { name: 'Emma Wilson', agency: 'Belle Property', reason: 'Sponsors local school events and community groups' },
    { name: 'Michael Brown', agency: 'LJ Hooker', reason: 'Featured in local newspaper monthly market column' },
    { name: 'You', agency: 'Your Agency', reason: 'Strong recent sales but limited social presence' },
    { name: 'David Lee', agency: 'Harcourts', reason: 'Active TikTok presence with suburb walking tours' },
    { name: 'Jessica Taylor', agency: 'Raine & Horne', reason: 'Longest-serving agent in the suburb (12 years)' },
  ];

  // Sort so current user is at their rank position
  const sorted = [...competitors].filter(c => c.name !== 'You');
  sorted.splice(currentUserRank - 1, 0, competitors.find(c => c.name === 'You')!);

  return sorted.slice(0, 7).map((c, idx) => ({
    id: `comp-${idx + 1}`,
    rank: idx + 1,
    agentName: c.name,
    agencyName: c.agency,
    score: Math.max(95 - (idx * 8) + Math.floor(Math.random() * 5), 45),
    winningReason: c.reason,
    isCurrentUser: c.name === 'You',
    changeFromLastWeek: c.name === 'You' ? 2 : (Math.random() > 0.6 ? Math.floor(Math.random() * 3) - 1 : 0),
  }));
}

/**
 * Generate pillar scores
 */
function generatePillarScores(): CompetitorAnalysis['pillarScores'] {
  return {
    socialProof: {
      id: 'social-proof',
      name: 'Social Proof',
      score: 14,
      maxScore: 25,
      confidence: 'high',
      insight: 'Posting consistency is below top competitors. They post 4-5x weekly vs your 1-2x.',
      icon: 'social',
    },
    localDominance: {
      id: 'local-dominance',
      name: 'Local Dominance',
      score: 18,
      maxScore: 25,
      confidence: 'medium',
      insight: 'Good sales history but lacking community sponsorships and local event presence.',
      icon: 'dominance',
    },
    trustReputation: {
      id: 'trust-reputation',
      name: 'Trust & Reputation',
      score: 12,
      maxScore: 25,
      confidence: 'high',
      insight: 'Only 8 Google reviews vs competitor average of 32. This is your biggest gap.',
      icon: 'trust',
    },
    visibilityAssets: {
      id: 'visibility-assets',
      name: 'Visibility & Assets',
      score: 16,
      maxScore: 25,
      confidence: 'medium',
      insight: 'Website exists but no lead magnets or suburb-specific landing pages.',
      icon: 'visibility',
    },
  };
}

/**
 * Generate fastest moves to climb
 */
function generateFastestMoves(suburb: string): FastestMove[] {
  return [
    {
      id: 'move-1',
      rank: 1,
      title: 'Launch a Google Review Campaign',
      whyItWorks: 'Reviews are the #1 trust signal. Top agents in ' + suburb + ' average 35+ reviews.',
      steps: [
        'Export your last 20 happy clients from your CRM',
        'Send a personal text: "Hi [Name], I\'d love your feedback! Could you leave a quick Google review?"',
        'Include your direct Google review link',
        'Follow up once after 3 days if no response',
        'Aim for 5 new reviews this week',
      ],
      impact: 'high',
      estimatedTime: '2 hours setup, 5 mins/day follow-up',
      category: 'reviews',
    },
    {
      id: 'move-2',
      rank: 2,
      title: 'Post 3 "Suburb Insider" Videos This Week',
      whyItWorks: 'Top competitors post 4-5x weekly. Local content gets 3x more engagement than listings.',
      steps: [
        'Film a 60-second "hidden gem" video at a local cafe or park',
        'Share a market update: "What\'s actually selling in ' + suburb + ' right now"',
        'Do a quick "New to ' + suburb + '?" tips video',
        'Post to Instagram Reels + Facebook',
        'Use location tags and suburb hashtags',
      ],
      impact: 'high',
      estimatedTime: '30 mins per video',
      category: 'content',
    },
    {
      id: 'move-3',
      rank: 3,
      title: 'Sponsor a Local Sports Team or Event',
      whyItWorks: 'Creates ongoing visibility and community goodwill. Most agents overlook this.',
      steps: [
        'Research local junior sports teams, school events, or community groups',
        'Budget $200-500 for signage or jersey sponsorship',
        'Attend one game/event and take photos for social media',
        'Build relationship with organizers for ongoing presence',
      ],
      impact: 'medium',
      estimatedTime: '1-2 hours research, ongoing attendance',
      category: 'engagement',
    },
  ];
}

/**
 * Generate 7-day action plan
 */
function generateNext7Days(suburb: string): DailyTask[] {
  return [
    {
      id: 'day-1',
      day: 1,
      task: 'Send review requests to 5 past clients',
      description: 'Use the template: "Hi [Name], I\'d love your feedback on Google!"',
      completed: false,
      actionType: 'generate-script',
      actionLabel: 'Generate Message',
    },
    {
      id: 'day-2',
      day: 2,
      task: 'Film a 60-second video at a local cafe',
      description: 'Share why you love this spot and tag the business.',
      completed: false,
      actionType: 'generate-post',
      actionLabel: 'Generate Script',
    },
    {
      id: 'day-3',
      day: 3,
      task: 'Post a market update for ' + suburb,
      description: 'Share 1-2 recent sales and what buyers are looking for.',
      completed: false,
      actionType: 'generate-post',
      actionLabel: 'Generate Post',
    },
    {
      id: 'day-4',
      day: 4,
      task: 'Research local sponsorship opportunities',
      description: 'Find 3 local teams or events you could sponsor.',
      completed: false,
      actionType: 'none',
    },
    {
      id: 'day-5',
      day: 5,
      task: 'Follow up on review requests sent Day 1',
      description: 'A gentle reminder can double your response rate.',
      completed: false,
      actionType: 'generate-script',
      actionLabel: 'Generate Follow-up',
    },
    {
      id: 'day-6',
      day: 6,
      task: 'Post a "Hidden Gem" video about ' + suburb,
      description: 'Show a park, walking trail, or local shop that newcomers love.',
      completed: false,
      actionType: 'generate-post',
      actionLabel: 'Generate Script',
    },
    {
      id: 'day-7',
      day: 7,
      task: 'Review your week and plan next week',
      description: 'Check how many reviews you got and what content performed best.',
      completed: false,
      actionType: 'none',
    },
  ];
}

/**
 * Generate suburb content ideas
 */
function generateContentIdeas(suburb: string): SuburbContentIdea[] {
  return [
    {
      id: 'idea-1',
      title: `The ${suburb} Weekend Guide`,
      hook: `Here's how locals actually spend their weekends in ${suburb}...`,
      filmingTip: 'Film at 3 locations: cafe, park, and a family activity spot.',
      cta: 'Comment "GUIDE" and I\'ll send you my full local recommendations!',
      platform: 'instagram',
      contentType: 'video',
    },
    {
      id: 'idea-2',
      title: `What $1M Gets You in ${suburb} vs 5 Years Ago`,
      hook: 'The ${suburb} market has changed dramatically. Let me show you...',
      filmingTip: 'Use before/after listing photos or stand in front of two different homes.',
      cta: 'Want to know what your home is worth today? Link in bio.',
      platform: 'tiktok',
      contentType: 'video',
    },
    {
      id: 'idea-3',
      title: `3 Things I Wish Buyers Knew About ${suburb}`,
      hook: 'After selling 50+ homes here, these are the insider secrets...',
      filmingTip: 'Sit-down talking head or walk-and-talk through the suburb.',
      cta: 'DM me "BUYER" for my free suburb buyer guide.',
      platform: 'instagram',
      contentType: 'video',
    },
    {
      id: 'idea-4',
      title: `The Best Streets in ${suburb} (And Why)`,
      hook: 'Not all streets are equal. Here are the ones that hold value...',
      filmingTip: 'Drive or walk through 2-3 premium streets, explain what makes them special.',
      cta: 'Thinking of buying? Comment your budget and I\'ll suggest streets.',
      platform: 'facebook',
      contentType: 'video',
    },
    {
      id: 'idea-5',
      title: `School Zone Secrets: ${suburb} Edition`,
      hook: 'The school catchment can add $100k+ to your home value...',
      filmingTip: 'Film near school entrance, show catchment boundaries on a map.',
      cta: 'Want the full school zone map? DM me "SCHOOLS"',
      platform: 'instagram',
      contentType: 'carousel',
    },
    {
      id: 'idea-6',
      title: `My Favorite Coffee in ${suburb}`,
      hook: 'I\'ve tried every cafe here. This is the winner...',
      filmingTip: 'Quick video at the cafe, show the coffee, tag the business.',
      cta: 'What\'s YOUR favorite spot? Drop it in the comments!',
      platform: 'instagram',
      contentType: 'video',
    },
    {
      id: 'idea-7',
      title: `${suburb} Market Update: What Actually Sold This Month`,
      hook: 'Forget the news headlines. Here\'s what\'s really happening...',
      filmingTip: 'Use screen recording of sales data or stand in front of a "Sold" sign.',
      cta: 'Want a free price estimate for your home? Link in bio.',
      platform: 'any',
      contentType: 'video',
    },
    {
      id: 'idea-8',
      title: `The ${suburb} Walking Tour`,
      hook: 'Moving here? Let me show you around...',
      filmingTip: '2-3 minute walk through main street, parks, and highlights.',
      cta: 'Save this for when you visit! DM me for a personal tour.',
      platform: 'tiktok',
      contentType: 'video',
    },
    {
      id: 'idea-9',
      title: `Why I Love Selling in ${suburb}`,
      hook: 'I\'ve worked this suburb for X years. Here\'s why it\'s special...',
      filmingTip: 'Personal, authentic sit-down video. Show your passion.',
      cta: 'Thinking of selling? Let\'s chat about your property.',
      platform: 'linkedin',
      contentType: 'video',
    },
    {
      id: 'idea-10',
      title: `Before You Renovate in ${suburb}: Read This`,
      hook: 'Some renos add value here, others don\'t. Let me explain...',
      filmingTip: 'Show examples of good and bad renos, or use before/after photos.',
      cta: 'Planning a reno? I\'ll tell you what buyers actually want here.',
      platform: 'instagram',
      contentType: 'carousel',
    },
  ];
}

/**
 * Generate complete mock competitor analysis data
 */
export function generateMockCompetitorAnalysis(
  userId: string,
  suburb: string = 'Paddington',
  suburbs: string[] = ['Paddington', 'Woollahra', 'Double Bay']
): CompetitorAnalysis {
  const currentUserRank = 5; // User is ranked 5th
  const pillarScores = generatePillarScores();
  const totalScore = 
    pillarScores.socialProof.score + 
    pillarScores.localDominance.score + 
    pillarScores.trustReputation.score + 
    pillarScores.visibilityAssets.score;

  return {
    id: `ca-${userId}-${suburb.toLowerCase().replace(/\s/g, '-')}`,
    userId,
    suburb,
    suburbs,
    scoreOutOf100: totalScore,
    rankLow: currentUserRank - 1,
    rankHigh: currentUserRank + 2,
    confidence: 'medium',
    lastUpdated: new Date(),
    changeFromLastWeek: 2,
    leaderboard: generateLeaderboard(suburb, currentUserRank),
    pillarScores,
    fastestMoves: generateFastestMoves(suburb),
    next7Days: generateNext7Days(suburb),
    suburbContentIdeas: generateContentIdeas(suburb),
    generatedAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
}

/**
 * Available suburbs for the demo
 */
export const AVAILABLE_SUBURBS = [
  'Paddington',
  'Woollahra',
  'Double Bay',
  'Surry Hills',
  'Darlinghurst',
  'Bondi',
  'Mosman',
  'Neutral Bay',
  'Cremorne',
  'Manly',
];
