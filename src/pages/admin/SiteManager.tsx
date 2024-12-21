import React, { useState } from 'react';
import { Plus, Move, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import SectionEditor from '../../components/admin/SectionEditor';
import type { SiteSection } from '../../types/navigation';

export default function SiteManager() {
  const { sections, isLoading, error, deleteSection, reorderSections } = useNavigation();
  const [editingSection, setEditingSection] = useState<SiteSection | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleDelete = async (sectionId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      try {
        await deleteSection(sectionId);
      } catch (error) {
        console.error('Failed to delete section:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (editingSection || isCreating) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <SectionEditor
          section={editingSection || undefined}
          onClose={() => {
            setEditingSection(null);
            setIsCreating(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestion du Site
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez les sections et le contenu de votre site
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16">
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle section
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ordre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chemin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visibilité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.map((section) => (
              <tr key={section.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Move className="h-5 w-5 text-gray-400 cursor-move" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {section.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {section.path}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {section.isVisible ? (
                    <Eye className="h-5 w-5 text-green-500" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingSection(section)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}