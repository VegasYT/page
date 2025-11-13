import React, { useState } from 'react';
import { X } from 'lucide-react';

// Модальное окно настроек блока
export default function BlockSettingsModal({ block, template, onClose, onSave }) {
  const [settings, setSettings] = useState(block.settings || {});
  const [activeTab, setActiveTab] = useState('content');

  const handleStyleChange = (key, value) => {
    setSettings({
      ...settings,
      styles: {
        ...settings.styles,
        [key]: value
      }
    });
  };

  const handleDataChange = (key, value) => {
    setSettings({
      ...settings,
      data: {
        ...settings.data,
        [key]: value
      }
    });
  };

  // Отдельная обработка для Zero Block
  if (block.type === 'zeroblock') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">Zero Block</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">Для редактирования Zero Block используйте редактор</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Открыть редактор
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">{template?.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'content'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Контент
          </button>
          <button
            onClick={() => setActiveTab('styles')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'styles'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Стили
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Редактирование контента</h3>
              {template?.settings.editableElements.map(element => (
                <div key={element}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {element}
                  </label>
                  <textarea
                    value={settings.data?.[element] || ''}
                    onChange={(e) => handleDataChange(element, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'styles' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Настройка стилей</h3>
              {template && Object.entries(template.settings.editableStyles).map(([key, config]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {config.label}
                  </label>

                  {/* Тип: color - выбор цвета */}
                  {config.type === 'color' && (
                    <div className="flex gap-4 items-center">
                      <input
                        type="color"
                        value={settings.styles?.[key] || config.default}
                        onChange={(e) => handleStyleChange(key, e.target.value)}
                        className="h-10 w-20 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.styles?.[key] || config.default}
                        onChange={(e) => handleStyleChange(key, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#000000"
                      />
                    </div>
                  )}

                  {/* Тип: text - текстовое поле */}
                  {config.type === 'text' && (
                    <input
                      type="text"
                      value={settings.styles?.[key] || config.default}
                      onChange={(e) => handleStyleChange(key, e.target.value)}
                      placeholder={config.placeholder || config.default}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}

                  {/* Тип: number - числовое поле */}
                  {config.type === 'number' && (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={settings.styles?.[key] || config.default}
                        onChange={(e) => handleStyleChange(key, e.target.value)}
                        min={config.min}
                        max={config.max}
                        step={config.step || 1}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {config.unit && (
                        <span className="text-sm text-gray-600 font-medium">{config.unit}</span>
                      )}
                    </div>
                  )}

                  {/* Тип: select - выпадающий список */}
                  {config.type === 'select' && (
                    <select
                      value={settings.styles?.[key] || config.default}
                      onChange={(e) => handleStyleChange(key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {config.options.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Тип: range - слайдер */}
                  {config.type === 'range' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          value={settings.styles?.[key] || config.default}
                          onChange={(e) => handleStyleChange(key, e.target.value)}
                          min={config.min}
                          max={config.max}
                          step={config.step || 0.1}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
                          {settings.styles?.[key] || config.default}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave(settings)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
