'use client';

import { Droppable, Draggable } from '@hello-pangea/dnd';
import { PipelineStage, Deal } from '@/types/pipeline';
import { DealCard } from './DealCard';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PipelineColumnProps {
  stage: PipelineStage;
  onAddDeal: (stageId: string) => void;
  onEditDeal: (deal: Deal) => void;
}

export function PipelineColumn({ stage, onAddDeal, onEditDeal }: PipelineColumnProps) {
  const totalValue = stage.deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex-shrink-0 w-72 flex flex-col bg-slate-100 rounded-xl">
      {/* Column header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">{stage.name}</h3>
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
            {stage.deals.length}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{formatCurrency(totalValue)}</p>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-24 p-3 space-y-2 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-indigo-50' : ''}`}
          >
            {stage.deals.map((deal, index) => (
              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    style={{
                      ...dragProvided.draggableProps.style,
                      opacity: dragSnapshot.isDragging ? 0.85 : 1,
                    }}
                  >
                    <DealCard deal={deal} onClick={() => onEditDeal(deal)} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add deal button */}
      <button
        onClick={() => onAddDeal(stage.id)}
        className="flex items-center gap-1.5 w-full px-4 py-3 text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-b-xl border-t border-slate-200"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Deal
      </button>
    </div>
  );
}
