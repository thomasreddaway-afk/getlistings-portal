/**
 * Competitor Analysis Types
 * 
 * Data models for the competitor analysis feature that helps agents
 * understand their ranking vs other agents in their suburb.
 */

export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type ImpactLevel = 'small' | 'medium' | 'high';

/**
 * Individual competitor in the leaderboard
 */
export interface LeaderboardEntry {
  id: string;
  rank: number;
  agentName: string;
  agencyName?: string;
  score: number;
  winningReason: string;
  isCurrentUser: boolean;
  avatarUrl?: string;
  changeFromLastWeek?: number; // +2 means moved up 2 spots
}

/**
 * Individual pillar score (Social Proof, Local Dominance, etc.)
 */
export interface PillarScore {
  id: string;
  name: string;
  score: number; // 0-25
  maxScore: number; // 25
  confidence: ConfidenceLevel;
  insight: string;
  icon: 'social' | 'dominance' | 'trust' | 'visibility';
}

/**
 * Action item in the "Fastest Moves to Climb" section
 */
export interface FastestMove {
  id: string;
  rank: number;
  title: string;
  whyItWorks: string;
  steps: string[];
  impact: ImpactLevel;
  estimatedTime?: string;
  category: 'social' | 'content' | 'reviews' | 'visibility' | 'engagement';
}

/**
 * Daily task in the 7-day action plan
 */
export interface DailyTask {
  id: string;
  day: number; // 1-7
  task: string;
  description?: string;
  completed: boolean;
  actionType?: 'generate-post' | 'generate-script' | 'external-link' | 'none';
  actionLabel?: string;
  actionUrl?: string;
}

/**
 * Content idea for suburb-specific posts
 */
export interface SuburbContentIdea {
  id: string;
  title: string;
  hook: string;
  filmingTip?: string;
  cta: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'any';
  contentType: 'video' | 'photo' | 'carousel' | 'text';
}

/**
 * Main competitor analysis data structure
 */
export interface CompetitorAnalysis {
  id: string;
  userId: string;
  suburb: string;
  suburbs: string[]; // All suburbs the agent operates in
  
  // Local Authority Score
  scoreOutOf100: number;
  rankLow: number;
  rankHigh: number;
  confidence: ConfidenceLevel;
  lastUpdated: Date;
  changeFromLastWeek?: number;
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  
  // Pillar Scores
  pillarScores: {
    socialProof: PillarScore;
    localDominance: PillarScore;
    trustReputation: PillarScore;
    visibilityAssets: PillarScore;
  };
  
  // Action Items
  fastestMoves: FastestMove[];
  
  // 7-Day Plan
  next7Days: DailyTask[];
  
  // Content Ideas
  suburbContentIdeas: SuburbContentIdea[];
  
  // Metadata
  generatedAt: Date;
  expiresAt: Date;
}

/**
 * Empty state status
 */
export type CompetitorAnalysisStatus = 'loading' | 'empty' | 'generating' | 'ready' | 'error';

/**
 * API Response wrapper
 */
export interface CompetitorAnalysisResponse {
  status: CompetitorAnalysisStatus;
  data: CompetitorAnalysis | null;
  error?: string;
}
