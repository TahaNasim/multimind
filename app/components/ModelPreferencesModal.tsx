
import React from "react";




const AI_MODELS = [
  { id: "gpt-5", name: "ChatGPT" },
  { id: "claude-4-sonnet", name: "Anthropic" },
  { id: "google", name: "Google Gemini" },
  { id: "deepseek", name: "DeepSeek" },
  { id: "perplexity", name: "Perplexity" },
  { id: "grok", name: "Grok" },
];

export default function ModelPreferencesModal({ open, selected, onChange, onClose, onSave }) {
  if (!open) return null;

  const handleToggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((m) => m !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Choose Your AI Model Preferences</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {AI_MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              className={`px-4 py-2 rounded-lg border transition ${
                selected.includes(model.id)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => handleToggle(model.id)}
            >
              {model.name}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={onSave}
            disabled={selected.length === 0}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
    
  );
}
