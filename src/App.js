import React, { useState } from 'react';
import Header from './components/layout/Header';
import BlockPreview from './components/BlockPreview';
import BlockSettingsModal from './components/modals/BlockSettingsModal';
import AddBlockModal from './components/modals/AddBlockModal';
import { mockCategories, mockBlockTemplates, mockBlocks } from './data/mockData';
import { getViewportClass } from './utils/styleUtils';

export default function App() {
  const [blocks, setBlocks] = useState(mockBlocks);
  const [blockTemplates] = useState(mockBlockTemplates);
  const [categories] = useState(mockCategories);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [viewportSize, setViewportSize] = useState('desktop');

  const getBlockTemplate = (blockTemplateId) => {
    return blockTemplates.find(t => t.id === blockTemplateId);
  };

  const openBlockSettings = (block) => {
    setSelectedBlock(block);
    setIsSettingsModalOpen(true);
  };

  const saveBlockSettings = (updatedSettings) => {
    setBlocks(blocks.map(b => 
      b.id === selectedBlock.id ? { ...b, settings: updatedSettings } : b
    ));
    setIsSettingsModalOpen(false);
  };

  const addBlock = (blockTemplate) => {
    const newBlock = {
      id: Date.now(),
      page_id: 1,
      block_template_id: blockTemplate?.id || null,
      type: blockTemplate ? 'template' : 'zeroblock',
      position: blocks.length,
      settings: blockTemplate ? {
        styles: Object.keys(blockTemplate.settings.editableStyles).reduce((acc, key) => {
          acc[key] = blockTemplate.settings.editableStyles[key].default;
          return acc;
        }, {}),
        data: { ...blockTemplate.default_data }
      } : {}
    };
    setBlocks([...blocks, newBlock].map((b, idx) => ({ ...b, position: idx })));
    setIsAddBlockModalOpen(false);
  };

  const deleteBlock = (blockId) => {
    if (window.confirm('Удалить этот блок?')) {
      setBlocks(blocks.filter(b => b.id !== blockId).map((b, idx) => ({ ...b, position: idx })));
    }
  };

  const moveBlock = (blockId, direction) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks.map((b, idx) => ({ ...b, position: idx })));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        viewportSize={viewportSize} 
        onViewportChange={setViewportSize}
        onAddBlockClick={() => setIsAddBlockModalOpen(true)}
      />

      <div className="flex justify-center bg-gray-200 min-h-screen py-8">
        <div className={`${getViewportClass(viewportSize)} bg-white shadow-lg`}>
          {blocks.length === 0 ? (
            <div className={`${getViewportClass(viewportSize)} mx-auto`}>
              <div className="text-center py-32">
                <p className="text-gray-500 text-lg mb-4">Страница пока пуста</p>
                <button 
                  onClick={() => setIsAddBlockModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Добавить первый блок
                </button>
              </div>
            </div>
          ) : (
            blocks.map((block) => (
              <BlockPreview
                key={block.id}
                block={block}
                template={getBlockTemplate(block.block_template_id)}
                isHovered={hoveredBlockId === block.id}
                onHover={() => setHoveredBlockId(block.id)}
                onLeave={() => setHoveredBlockId(null)}
                onOpenSettings={() => openBlockSettings(block)}
                onDelete={() => deleteBlock(block.id)}
                onMoveUp={() => moveBlock(block.id, 'up')}
                onMoveDown={() => moveBlock(block.id, 'down')}
                isFirst={block.position === 0}
                isLast={block.position === blocks.length - 1}
                viewportSize={viewportSize}
              />
            ))
          )}
        </div>
      </div>

      {isSettingsModalOpen && selectedBlock && (
        <BlockSettingsModal
          block={selectedBlock}
          template={getBlockTemplate(selectedBlock.block_template_id)}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={saveBlockSettings}
        />
      )}

      {isAddBlockModalOpen && (
        <AddBlockModal
          categories={categories}
          blockTemplates={blockTemplates}
          onClose={() => setIsAddBlockModalOpen(false)}
          onAddBlock={addBlock}
        />
      )}
    </div>
  );
}