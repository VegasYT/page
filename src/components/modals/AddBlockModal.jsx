import React, { useState } from 'react';
import { X } from 'lucide-react';

// Модальное окно для добавления нового блока
export default function AddBlockModal({ categories, blockTemplates, onClose, onAddBlock }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredTemplates = selectedCategory
    ? blockTemplates.filter(t => t.category_id === selectedCategory)
    : blockTemplates;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Добавить блок</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Zero Block секция */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Специальные блоки</h3>
            <div
              onClick={() => onAddBlock(null)}
              className="border-2 border-dashed border-purple-300 rounded-lg p-6 hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center text-white font-bold text-2xl">
                  Z
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Zero Block</h4>
                  <p className="text-gray-600">Создайте кастомный блок с нуля</p>
                </div>
              </div>
            </div>
          </div>

          {/* Готовые шаблоны блоков */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Готовые блоки</h3>

            {/* Фильтр категорий */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Все
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Сетка шаблонов */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => onAddBlock(template)}
                  className="border rounded-lg overflow-hidden hover:shadow-lg cursor-pointer transition"
                >
                  <img
                    src={template.preview_url}
                    alt={template.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-gray-500">{template.template_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
