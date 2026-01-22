'use client';

import { DemoLayout } from '@/components/layout';
import { useState, useRef, DragEvent } from 'react';
import { Plus, X } from 'lucide-react';

interface PipelineCard {
  id: string;
  address: string;
  suburb: string;
  price: string;
  soldPrice?: string;
}

interface PipelineStage {
  id: string;
  name: string;
  color: 'gray' | 'blue' | 'purple' | 'green' | 'amber';
  cards: PipelineCard[];
}

const colorClasses = {
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    badge: 'bg-gray-200 text-gray-700',
    border: 'border-gray-200',
    hoverBg: 'hover:bg-gray-200',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    border: 'border-blue-200',
    hoverBg: 'hover:bg-blue-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200',
    hoverBg: 'hover:bg-purple-100',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
    border: 'border-green-200',
    hoverBg: 'hover:bg-green-100',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    border: 'border-amber-200',
    hoverBg: 'hover:bg-amber-100',
  },
};

const initialStages: PipelineStage[] = [
  {
    id: 'new',
    name: 'New',
    color: 'gray',
    cards: [
      { id: '1', address: '42 Ocean View Dr', suburb: 'Bondi', price: '$2.4M' },
      { id: '2', address: '89 King St', suburb: 'Sydney', price: '$850K' },
      { id: '3', address: '12 Palm Ave', suburb: 'Manly', price: '$1.8M' },
    ],
  },
  {
    id: 'contacted',
    name: 'Contacted',
    color: 'blue',
    cards: [
      { id: '4', address: '156 Harbour St', suburb: 'Sydney', price: '$980K' },
      { id: '5', address: '45 Beach Rd', suburb: 'Coogee', price: '$1.2M' },
    ],
  },
  {
    id: 'appraisal',
    name: 'Appraisal Set',
    color: 'purple',
    cards: [
      { id: '6', address: '78 Park Ave', suburb: 'Parramatta', price: '$1.5M' },
      { id: '7', address: '234 Rose St', suburb: 'Paddington', price: '$2.2M' },
      { id: '8', address: '67 Station St', suburb: 'Newtown', price: '$890K' },
      { id: '9', address: '19 Valley View', suburb: 'Mosman', price: '$3.1M' },
    ],
  },
  {
    id: 'listed',
    name: 'Listed',
    color: 'green',
    cards: [
      { id: '10', address: '23 Beach Rd', suburb: 'Bondi', price: '$2.1M' },
      { id: '11', address: '88 Cliff Walk', suburb: 'Vaucluse', price: '$4.5M' },
    ],
  },
  {
    id: 'sold',
    name: 'Sold 🎉',
    color: 'amber',
    cards: [
      { id: '12', address: '56 Marine Pde', suburb: 'Manly', price: '$2.8M', soldPrice: '$2.95M' },
    ],
  },
];

export default function PipelinePage() {
  const [stages, setStages] = useState<PipelineStage[]>(initialStages);
  const [draggedCard, setDraggedCard] = useState<{ card: PipelineCard; fromStage: string } | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Calculate totals
  const totalCards = stages.reduce((sum, stage) => sum + stage.cards.length, 0);
  const totalValue = stages.reduce((sum, stage) => {
    return sum + stage.cards.reduce((cardSum, card) => {
      const val = parseFloat(card.price.replace('$', '').replace('M', '').replace('K', ''));
      const multiplier = card.price.includes('M') ? 1000000 : card.price.includes('K') ? 1000 : 1;
      return cardSum + (val * multiplier);
    }, 0);
  }, 0);

  const formatValue = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  // Drag handlers
  const handleDragStart = (e: DragEvent, card: PipelineCard, stageId: string) => {
    setDraggedCard({ card, fromStage: stageId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: DragEvent, toStageId: string) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (!draggedCard || draggedCard.fromStage === toStageId) {
      setDraggedCard(null);
      return;
    }

    setStages(prev => {
      const newStages = prev.map(stage => {
        if (stage.id === draggedCard.fromStage) {
          return { ...stage, cards: stage.cards.filter(c => c.id !== draggedCard.card.id) };
        }
        if (stage.id === toStageId) {
          return { ...stage, cards: [...stage.cards, draggedCard.card] };
        }
        return stage;
      });
      return newStages;
    });
    
    setDraggedCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverStage(null);
  };

  // Stage name editing
  const startEditingStage = (stageId: string) => {
    setEditingStage(stageId);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const saveStageEdit = (stageId: string, newName: string) => {
    if (newName.trim()) {
      setStages(prev => prev.map(s => s.id === stageId ? { ...s, name: newName.trim() } : s));
    }
    setEditingStage(null);
  };

  // Add new stage
  const addStage = () => {
    const colors: Array<'gray' | 'blue' | 'purple' | 'green' | 'amber'> = ['gray', 'blue', 'purple', 'green', 'amber'];
    const newStage: PipelineStage = {
      id: `stage-${Date.now()}`,
      name: 'New Stage',
      color: colors[stages.length % colors.length],
      cards: [],
    };
    setStages([...stages, newStage]);
  };

  // Delete stage
  const deleteStage = (stageId: string) => {
    setStages(prev => prev.filter(s => s.id !== stageId));
  };

  return (
    <DemoLayout currentPage="pipeline">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                <span className="font-semibold text-gray-900">{totalCards}</span> opportunities • <span className="font-semibold text-gray-900">{formatValue(totalValue)}</span> total value
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <p className="text-xs text-gray-400">💡 Drag cards between stages • Click stage name to rename</p>
              <button
                onClick={addStage}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Board */}
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex space-x-4 h-full min-w-max">
            {stages.map(stage => {
              const colors = colorClasses[stage.color];
              
              return (
                <div
                  key={stage.id}
                  className={`w-56 ${colors.bg} rounded-lg p-3 flex flex-col group`}
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between mb-3">
                    {editingStage === stage.id ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        defaultValue={stage.name}
                        className={`font-semibold ${colors.text} bg-white px-2 py-1 rounded border border-gray-300 text-sm w-full mr-2`}
                        onBlur={(e) => saveStageEdit(stage.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveStageEdit(stage.id, e.currentTarget.value);
                          if (e.key === 'Escape') setEditingStage(null);
                        }}
                      />
                    ) : (
                      <h3
                        className={`stage-name font-semibold ${colors.text} cursor-pointer ${colors.hoverBg} px-2 py-1 -mx-2 -my-1 rounded`}
                        onClick={() => startEditingStage(stage.id)}
                        title="Click to rename"
                      >
                        {stage.name}
                      </h3>
                    )}
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs ${colors.badge} px-2 py-0.5 rounded-full`}>
                        {stage.cards.length}
                      </span>
                      <button
                        onClick={() => deleteStage(stage.id)}
                        className={`p-1 ${colors.hoverBg} rounded opacity-0 group-hover:opacity-100 transition-opacity`}
                        title="Delete stage"
                      >
                        <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Drop Zone */}
                  <div
                    className={`space-y-2 flex-1 overflow-auto min-h-[100px] rounded-lg transition-colors ${
                      dragOverStage === stage.id ? 'bg-blue-100 border-2 border-dashed border-blue-400' : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, stage.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    {stage.cards.map(card => (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card, stage.id)}
                        onDragEnd={handleDragEnd}
                        className={`bg-white rounded-lg p-3 border ${colors.border} cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
                          draggedCard?.card.id === card.id ? 'opacity-50' : ''
                        }`}
                      >
                        <p className="font-medium text-sm">{card.address}</p>
                        <p className="text-xs text-gray-500">{card.suburb}</p>
                        <p className="text-xs text-green-600 mt-2 font-medium">{card.price}</p>
                        {card.soldPrice && (
                          <p className="text-xs text-amber-600 mt-1">✓ Sold for {card.soldPrice}</p>
                        )}
                      </div>
                    ))}

                    {stage.cards.length === 0 && !dragOverStage && (
                      <div className="text-center py-8 text-gray-400 text-xs">
                        Drop cards here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
