import React, { useState } from 'react';
import { Save, X, Move, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import type { SiteSection } from '../../types/navigation';

interface SectionEditorProps {
  section?: SiteSection;
  onClose: () => void;
}

export default function SectionEditor({ section, onClose }: SectionEditorProps) {
  const [formData, setFormData] = useState<Partial<SiteSection>>(section || {
    title: '',
    path: '',
    content: {
      title: '',
      description: ''
    },
    order: 0,
    isVisible: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addSection, updateSection } = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.path) {
      setError('Le titre et le chemin sont requis');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (section) {
        await updateSection({ ...section, ...formData } as SiteSection);
      } else {
        await addSection(formData as Omit<SiteSection, 'id'>);
      }
      
      onClose();
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {section ? 'Modifier la section' : 'Nouvelle section'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre de la section
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chemin URL
          </label>
          <input
            type="text"
            name="path"
            value={formData.path || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenu
          </label>
          <textarea
            name="content.description"
            value={formData.content?.description || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            name="content.image.url"
            value={formData.content?.image?.url || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Visible dans le menu</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </form>
  );
}