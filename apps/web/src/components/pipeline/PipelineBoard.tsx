'use client';

import { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { PipelineStage, Deal, CreateDeal } from '@/types/pipeline';
import { PipelineColumn } from './PipelineColumn';
import { Modal } from '@/components/ui/Modal';
import { DealForm } from './DealForm';
import toast from 'react-hot-toast';

interface PipelineBoardProps {
  stages: PipelineStage[];
  onMoveDeal?: (dealId: string, newStageId: string) => Promise<void>;
  onCreateDeal?: (data: { title: string; value: number; stageId: string; expectedCloseDate?: string }) => Promise<void>;
  onUpdateDeal?: (id: string, data: Partial<Deal>) => Promise<void>;
}

export function PipelineBoard({ stages: initialStages, onMoveDeal, onCreateDeal, onUpdateDeal }: PipelineBoardProps) {
  const [stages, setStages] = useState<PipelineStage[]>(initialStages);
  const [addModal, setAddModal] = useState<{ stageId: string } | null>(null);
  const [editModal, setEditModal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceStage = stages.find((s) => s.id === source.droppableId);
    const destStage = stages.find((s) => s.id === destination.droppableId);
    if (!sourceStage || !destStage) return;

    const deal = sourceStage.deals.find((d) => d.id === draggableId);
    if (!deal) return;

    // Optimistic update
    const newStages = stages.map((stage) => {
      if (stage.id === source.droppableId) {
        return { ...stage, deals: stage.deals.filter((d) => d.id !== draggableId) };
      }
      if (stage.id === destination.droppableId) {
        const newDeals = [...stage.deals];
        newDeals.splice(destination.index, 0, { ...deal, stageId: destination.droppableId });
        return { ...stage, deals: newDeals };
      }
      return stage;
    });
    setStages(newStages);

    if (onMoveDeal) {
      try {
        await onMoveDeal(draggableId, destination.droppableId);
      } catch {
        setStages(stages); // revert
        toast.error('Failed to move deal');
      }
    }
  }

  async function handleCreateDeal(data: { title: string; value: number; stageId: string; expectedCloseDate?: string }) {
    if (!onCreateDeal) return;
    setLoading(true);
    try {
      await onCreateDeal(data);
      setAddModal(null);
      toast.success('Deal created');
    } catch {
      toast.error('Failed to create deal');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateDeal(data: Partial<Deal>) {
    if (!editModal || !onUpdateDeal) return;
    setLoading(true);
    try {
      await onUpdateDeal(editModal.id, data);
      setEditModal(null);
      toast.success('Deal updated');
    } catch {
      toast.error('Failed to update deal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              onAddDeal={(stageId) => setAddModal({ stageId })}
              onEditDeal={setEditModal}
            />
          ))}
        </div>
      </DragDropContext>

      <Modal
        isOpen={!!addModal}
        onClose={() => setAddModal(null)}
        title="Add Deal"
        size="md"
      >
        {addModal && (
          <DealForm
            stageId={addModal.stageId}
            onSubmit={(data) => handleCreateDeal(data as CreateDeal)}
            loading={loading}
            onCancel={() => setAddModal(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        title="Edit Deal"
        size="md"
      >
        {editModal && (
          <DealForm
            initialData={editModal}
            stageId={editModal.stageId}
            onSubmit={(data) => handleUpdateDeal(data as Partial<Deal>)}
            loading={loading}
            onCancel={() => setEditModal(null)}
          />
        )}
      </Modal>
    </>
  );
}
