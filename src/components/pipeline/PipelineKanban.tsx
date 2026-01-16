'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  MoreHorizontal, 
  Phone, 
  Calendar,
  MapPin,
  GripVertical,
} from 'lucide-react';
import { PipelineStage } from '@/types/config';
import { Opportunity, Lead, Property } from '@/types';
import { KanbanCard as KanbanCardType } from '@/types/api';
import { cn } from '@/lib/utils/cn';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface PipelineKanbanProps {
  columns: Array<{
    stage: PipelineStage;
    count: number;
    total_value?: number;
    opportunities: KanbanCardType[];
  }>;
  onMoveCard?: (opportunityId: string, fromStageId: string, toStageId: string) => void;
  onCardClick?: (card: KanbanCardType) => void;
}

export function PipelineKanban({ columns, onMoveCard, onCardClick }: PipelineKanbanProps) {
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = findCard(active.id as string);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCard = findCard(active.id as string);
    if (!activeCard) return;

    // Determine the target stage
    const overStageId = over.id as string;
    const fromStageId = activeCard.opportunity.stage_id;

    // Check if dropped on a different stage
    if (overStageId !== fromStageId && columns.some(c => c.stage.id === overStageId)) {
      onMoveCard?.(activeCard.opportunity.id, fromStageId, overStageId);
    }
  };

  const findCard = (id: string): KanbanCardType | undefined => {
    for (const column of columns) {
      const card = column.opportunities.find(c => c.opportunity.id === id);
      if (card) return card;
    }
    return undefined;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
        {columns.map((column) => (
          <KanbanColumn
            key={column.stage.id}
            stage={column.stage}
            count={column.count}
            totalValue={column.total_value}
            cards={column.opportunities}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard && (
          <KanbanCardComponent
            card={activeCard}
            isDragging
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

interface KanbanColumnProps {
  stage: PipelineStage;
  count: number;
  totalValue?: number;
  cards: KanbanCardType[];
  onCardClick?: (card: KanbanCardType) => void;
}

function KanbanColumn({ stage, count, totalValue, cards, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useSortable({
    id: stage.id,
    data: { type: 'column' },
  });

  const stageColorMap: Record<string, string> = {
    'stage-lead': 'bg-slate-500',
    'stage-qualified': 'bg-blue-500',
    'stage-contact': 'bg-purple-500',
    'stage-appointment': 'bg-amber-500',
    'stage-listing': 'bg-emerald-500',
    'stage-sale': 'bg-green-500',
    'stage-lost': 'bg-red-500',
  };

  const headerColor = stageColorMap[stage.color] || 'bg-slate-500';

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'kanban-column flex-shrink-0 w-80 flex flex-col',
        isOver && 'ring-2 ring-brand-500 ring-inset'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', headerColor)} />
          <h3 className="font-medium text-slate-900">{stage.name}</h3>
          <span className="text-sm text-slate-500">({count})</span>
        </div>
        {totalValue && totalValue > 0 && (
          <span className="text-xs text-slate-500">
            ${(totalValue / 1000).toFixed(0)}k
          </span>
        )}
      </div>

      {/* Cards */}
      <SortableContext
        items={cards.map(c => c.opportunity.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 flex-1">
          {cards.map((card) => (
            <SortableCard
              key={card.opportunity.id}
              card={card}
              onClick={() => onCardClick?.(card)}
            />
          ))}

          {cards.length === 0 && (
            <div className="text-center py-8 text-sm text-slate-400">
              No leads in this stage
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

interface SortableCardProps {
  card: KanbanCardType;
  onClick?: () => void;
}

function SortableCard({ card, onClick }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.opportunity.id,
    data: { type: 'card', card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <KanbanCardComponent
        card={card}
        isDragging={isDragging}
        dragHandleProps={listeners}
        onClick={onClick}
      />
    </div>
  );
}

interface KanbanCardComponentProps {
  card: KanbanCardType;
  isDragging?: boolean;
  dragHandleProps?: any;
  onClick?: () => void;
}

function KanbanCardComponent({ card, isDragging, dragHandleProps, onClick }: KanbanCardComponentProps) {
  const { lead, property, opportunity } = card;

  return (
    <div
      className={cn(
        'kanban-card',
        isDragging && 'dragging opacity-50'
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div 
            className="cursor-grab p-1 -ml-1 hover:bg-slate-100 rounded"
            {...dragHandleProps}
          >
            <GripVertical className="w-3 h-3 text-slate-400" />
          </div>
          <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-slate-600">
              {lead.first_name?.[0]}{lead.last_name?.[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {lead.first_name} {lead.last_name}
            </p>
          </div>
        </div>
        
        {property && (
          <span className={cn(
            'score-badge text-xs',
            property.seller_score >= 80 ? 'score-hot' : 
            property.seller_score >= 60 ? 'score-warm' : 
            property.seller_score >= 40 ? 'score-cool' : 'score-cold'
          )}>
            {property.seller_score}%
          </span>
        )}
      </div>

      {/* Address */}
      {(lead.property_address || property?.address) && (
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{lead.property_address || property?.address}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-3">
          {lead.follow_up_count && lead.follow_up_count > 0 && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {lead.follow_up_count}
            </span>
          )}
          {opportunity.expected_close_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(opportunity.expected_close_date.toDate(), { addSuffix: true })}
            </span>
          )}
        </div>
        
        {lead.is_exclusive && (
          <span className="text-amber-500">⭐</span>
        )}
      </div>
    </div>
  );
}
