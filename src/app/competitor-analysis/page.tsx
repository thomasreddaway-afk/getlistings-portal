'use client';

import { useState, useEffect } from 'react';
import { AppLayout, Header } from '@/components/layout';
import { useAuth } from '@/lib/auth/client';
import { cn } from '@/lib/utils/cn';
import { 
  Trophy,
  ChevronDown,
  Check,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Star,
  Eye,
  Heart,
  Zap,
  ArrowRight,
  Play,
  RefreshCw,
  ChevronRight,
  Target,
  MessageSquare,
  Video,
  Image,
  FileText,
  Lightbulb,
} from 'lucide-react';
import type { 
  CompetitorAnalysis, 
  CompetitorAnalysisStatus,
  ConfidenceLevel,
  ImpactLevel,
  PillarScore,
  FastestMove,
  DailyTask,
  SuburbContentIdea,
  LeaderboardEntry,
} from '@/types/competitor-analysis';
import { generateMockCompetitorAnalysis, AVAILABLE_SUBURBS } from '@/lib/competitor-analysis/mock-data';

/**
 * Competitor Analysis Page
 * 
 * Shows agents how they rank vs competitors in their suburb
 * and provides an action plan to improve their ranking.
 */
export default function CompetitorAnalysisPage() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<CompetitorAnalysisStatus>('empty');
  const [data, setData] = useState<CompetitorAnalysis | null>(null);
  const [selectedSuburb, setSelectedSuburb] = useState<string>('Paddington');
  const [showSuburbDropdown, setShowSuburbDropdown] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Simulate generating report
  const handleGenerateReport = () => {
    setStatus('generating');
    setTimeout(() => {
      const mockData = generateMockCompetitorAnalysis(user?.id || 'demo-user', selectedSuburb);
      setData(mockData);
      setStatus('ready');
    }, 2000);
  };

  // Handle suburb change
  const handleSuburbChange = (suburb: string) => {
    setSelectedSuburb(suburb);
    setShowSuburbDropdown(false);
    if (status === 'ready') {
      // Regenerate with new suburb
      const mockData = generateMockCompetitorAnalysis(user?.id || 'demo-user', suburb);
      setData(mockData);
    }
  };

  // Toggle task completion
  const toggleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header 
        title="Competitor Analysis"
        subtitle="See where you rank in your suburb and what to do next to climb."
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Suburb Selector */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowSuburbDropdown(!showSuburbDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{selectedSuburb}</span>
                <ChevronDown className={cn(
                  "w-4 h-4 text-slate-400 transition-transform",
                  showSuburbDropdown && "rotate-180"
                )} />
              </button>
              
              {showSuburbDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                  {AVAILABLE_SUBURBS.map((suburb) => (
                    <button
                      key={suburb}
                      onClick={() => handleSuburbChange(suburb)}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg",
                        suburb === selectedSuburb ? "bg-brand-50 text-brand-700" : "text-slate-700"
                      )}
                    >
                      {suburb}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {status === 'ready' && (
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            )}
          </div>

          {/* Empty State */}
          {status === 'empty' && (
            <EmptyState onGenerate={handleGenerateReport} suburb={selectedSuburb} />
          )}

          {/* Generating State */}
          {status === 'generating' && (
            <GeneratingState suburb={selectedSuburb} />
          )}

          {/* Ready State - Show All Sections */}
          {status === 'ready' && data && (
            <>
              {/* Top Row: Score Card + Leaderboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LocalAuthorityScoreCard data={data} />
                <LeaderboardCard leaderboard={data.leaderboard} suburb={data.suburb} />
              </div>

              {/* Pillar Breakdown */}
              <PillarBreakdown pillars={data.pillarScores} />

              {/* Fastest Moves */}
              <FastestMovesCard moves={data.fastestMoves} />

              {/* 7-Day Checklist */}
              <Next7DaysCard 
                tasks={data.next7Days} 
                completedTasks={completedTasks}
                onToggleComplete={toggleTaskComplete}
              />

              {/* Content Ideas */}
              <ContentIdeasCard ideas={data.suburbContentIdeas} suburb={data.suburb} />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// =============================================================================
// EMPTY STATE
// =============================================================================

function EmptyState({ onGenerate, suburb }: { onGenerate: () => void; suburb: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trophy className="w-8 h-8 text-brand-500" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Ready to see how you rank in {suburb}?
      </h2>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">
        We'll analyze your local competition and show you exactly where you stand — plus a personalized action plan to climb the rankings.
      </p>
      <button
        onClick={onGenerate}
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
      >
        <Sparkles className="w-5 h-5" />
        Generate Competitor Report
      </button>
    </div>
  );
}

// =============================================================================
// GENERATING STATE
// =============================================================================

function GeneratingState({ suburb }: { suburb: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Building your competitor report…
      </h2>
      <p className="text-slate-600 max-w-md mx-auto">
        Analyzing agents in {suburb}, checking reviews, social presence, and market activity.
      </p>
    </div>
  );
}

// =============================================================================
// LOCAL AUTHORITY SCORE CARD
// =============================================================================

function LocalAuthorityScoreCard({ data }: { data: CompetitorAnalysis }) {
  const scoreColor = data.scoreOutOf100 >= 70 ? 'text-green-600' : 
                     data.scoreOutOf100 >= 50 ? 'text-amber-600' : 'text-red-600';
  const progressColor = data.scoreOutOf100 >= 70 ? 'bg-green-500' : 
                        data.scoreOutOf100 >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">Local Authority Score</h3>
          <p className="text-sm text-slate-500">Your overall ranking strength in {data.suburb}</p>
        </div>
        <ConfidenceBadge confidence={data.confidence} />
      </div>

      <div className="flex items-end gap-4 mb-4">
        <span className={cn("text-5xl font-bold", scoreColor)}>
          {data.scoreOutOf100}
        </span>
        <span className="text-2xl text-slate-400 mb-1">/100</span>
        
        {data.changeFromLastWeek !== undefined && data.changeFromLastWeek !== 0 && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium mb-1",
            data.changeFromLastWeek > 0 
              ? "bg-green-50 text-green-700" 
              : "bg-red-50 text-red-700"
          )}>
            {data.changeFromLastWeek > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {data.changeFromLastWeek > 0 ? '+' : ''}{data.changeFromLastWeek} this week
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", progressColor)}
          style={{ width: `${data.scoreOutOf100}%` }}
        />
      </div>

      <div className="flex items-center gap-2 text-slate-600">
        <Trophy className="w-4 h-4 text-amber-500" />
        <span>
          You're currently <strong className="text-slate-900">#{data.rankLow}–#{data.rankHigh}</strong> in {data.suburb}
        </span>
      </div>

      <p className="text-xs text-slate-400 mt-2">Updated weekly</p>
    </div>
  );
}

// =============================================================================
// LEADERBOARD CARD
// =============================================================================

function LeaderboardCard({ leaderboard, suburb }: { leaderboard: LeaderboardEntry[]; suburb: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">Top Agents in {suburb}</h3>
          <p className="text-sm text-slate-500">Who you're competing against</p>
        </div>
        <Users className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-2">
        {leaderboard.slice(0, 5).map((entry) => (
          <div 
            key={entry.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              entry.isCurrentUser 
                ? "bg-brand-50 border border-brand-200" 
                : "hover:bg-slate-50"
            )}
          >
            {/* Rank */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              entry.rank === 1 ? "bg-amber-100 text-amber-700" :
              entry.rank === 2 ? "bg-slate-200 text-slate-700" :
              entry.rank === 3 ? "bg-orange-100 text-orange-700" :
              "bg-slate-100 text-slate-600"
            )}>
              {entry.rank}
            </div>

            {/* Agent Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-medium truncate",
                  entry.isCurrentUser ? "text-brand-700" : "text-slate-900"
                )}>
                  {entry.isCurrentUser ? 'You' : entry.agentName}
                </span>
                {entry.changeFromLastWeek !== undefined && entry.changeFromLastWeek > 0 && (
                  <span className="text-xs text-green-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    +{entry.changeFromLastWeek}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">{entry.winningReason}</p>
            </div>

            {/* Score */}
            <div className="text-right">
              <span className="font-semibold text-slate-900">{entry.score}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// PILLAR BREAKDOWN
// =============================================================================

function PillarBreakdown({ pillars }: { pillars: CompetitorAnalysis['pillarScores'] }) {
  const pillarArray = [
    { ...pillars.socialProof, iconComponent: Heart },
    { ...pillars.localDominance, iconComponent: MapPin },
    { ...pillars.trustReputation, iconComponent: Star },
    { ...pillars.visibilityAssets, iconComponent: Eye },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {pillarArray.map((pillar) => (
        <PillarCard key={pillar.id} pillar={pillar} Icon={pillar.iconComponent} />
      ))}
    </div>
  );
}

function PillarCard({ pillar, Icon }: { pillar: PillarScore; Icon: typeof Heart }) {
  const percentage = (pillar.score / pillar.maxScore) * 100;
  const color = percentage >= 70 ? 'bg-green-500' : 
                percentage >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-500" />
        </div>
        <ConfidenceBadge confidence={pillar.confidence} small />
      </div>

      <h4 className="font-medium text-slate-900 mb-1">{pillar.name}</h4>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-slate-900">{pillar.score}</span>
        <span className="text-sm text-slate-400">/{pillar.maxScore}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div 
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-slate-600 line-clamp-2">{pillar.insight}</p>
    </div>
  );
}

// =============================================================================
// FASTEST MOVES CARD
// =============================================================================

function FastestMovesCard({ moves }: { moves: FastestMove[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">3 Fastest Moves to Climb</h3>
          <p className="text-sm text-slate-500">Your personalized action plan to improve rankings</p>
        </div>
      </div>

      <div className="space-y-6">
        {moves.map((move, index) => (
          <div key={move.id} className="relative pl-8">
            {/* Rank Badge */}
            <div className={cn(
              "absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold",
              index === 0 ? "bg-amber-100 text-amber-700" :
              index === 1 ? "bg-slate-200 text-slate-700" :
              "bg-orange-100 text-orange-700"
            )}>
              {move.rank}
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h4 className="font-medium text-slate-900">{move.title}</h4>
                <ImpactBadge impact={move.impact} />
              </div>

              <p className="text-sm text-slate-600 mb-3">{move.whyItWorks}</p>

              <ul className="space-y-1.5">
                {move.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-2 text-sm text-slate-600">
                    <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>

              {move.estimatedTime && (
                <p className="text-xs text-slate-400 mt-2">⏱ {move.estimatedTime}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// NEXT 7 DAYS CARD
// =============================================================================

function Next7DaysCard({ 
  tasks, 
  completedTasks,
  onToggleComplete 
}: { 
  tasks: DailyTask[]; 
  completedTasks: Set<string>;
  onToggleComplete: (taskId: string) => void;
}) {
  const completedCount = tasks.filter(t => completedTasks.has(t.id)).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Next 7 Days</h3>
            <p className="text-sm text-slate-500">Your daily action checklist</p>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          <span className="font-semibold text-green-600">{completedCount}</span>
          <span className="text-slate-400">/{tasks.length} completed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {tasks.map((task) => {
          const isCompleted = completedTasks.has(task.id);
          
          return (
            <div 
              key={task.id}
              className={cn(
                "p-4 rounded-lg border transition-all",
                isCompleted 
                  ? "bg-green-50 border-green-200" 
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-slate-400">Day {task.day}</span>
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ml-auto",
                    isCompleted 
                      ? "bg-green-500 border-green-500 text-white" 
                      : "border-slate-300 hover:border-brand-500"
                  )}
                >
                  {isCompleted && <Check className="w-3 h-3" />}
                </button>
              </div>

              <p className={cn(
                "text-sm font-medium mb-1",
                isCompleted ? "text-green-700 line-through" : "text-slate-900"
              )}>
                {task.task}
              </p>

              {task.actionType && task.actionType !== 'none' && (
                <button className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 mt-2">
                  <Play className="w-3 h-3" />
                  {task.actionLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// CONTENT IDEAS CARD
// =============================================================================

function ContentIdeasCard({ ideas, suburb }: { ideas: SuburbContentIdea[]; suburb: string }) {
  const [showAll, setShowAll] = useState(false);
  const displayedIdeas = showAll ? ideas : ideas.slice(0, 4);

  const platformIcons: Record<string, typeof Video> = {
    instagram: Video,
    tiktok: Video,
    facebook: Video,
    linkedin: FileText,
    any: Lightbulb,
  };

  const contentTypeIcons: Record<string, typeof Video> = {
    video: Video,
    photo: Image,
    carousel: Image,
    text: FileText,
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{suburb} Content Ideas</h3>
          <p className="text-sm text-slate-500">10 post and video ideas specific to your suburb</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedIdeas.map((idea) => {
          const PlatformIcon = platformIcons[idea.platform] || Lightbulb;
          const ContentIcon = contentTypeIcons[idea.contentType] || Video;

          return (
            <div 
              key={idea.id}
              className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <ContentIcon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 text-sm mb-1">{idea.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">
                    <strong>Hook:</strong> "{idea.hook}"
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="capitalize">{idea.platform}</span>
                    <span>•</span>
                    <span className="capitalize">{idea.contentType}</span>
                  </div>
                </div>
              </div>
              {idea.cta && (
                <p className="text-xs text-brand-600 mt-2">
                  <strong>CTA:</strong> {idea.cta}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {ideas.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mt-4 mx-auto"
        >
          {showAll ? 'Show less' : `Show all ${ideas.length} ideas`}
          <ChevronDown className={cn("w-4 h-4 transition-transform", showAll && "rotate-180")} />
        </button>
      )}
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function ConfidenceBadge({ confidence, small }: { confidence: ConfidenceLevel; small?: boolean }) {
  const colors = {
    high: 'bg-green-50 text-green-700',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-red-50 text-red-700',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
      colors[confidence],
      small && "text-[10px]"
    )}>
      {confidence} confidence
    </span>
  );
}

function ImpactBadge({ impact }: { impact: ImpactLevel }) {
  const colors = {
    high: 'bg-green-50 text-green-700 border-green-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    small: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium capitalize border",
      colors[impact]
    )}>
      {impact} impact
    </span>
  );
}
