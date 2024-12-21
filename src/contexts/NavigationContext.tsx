import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/database/client';
import type { SiteSection } from '../types/navigation';

interface NavigationContextType {
  sections: SiteSection[];
  isLoading: boolean;
  error: string | null;
  addSection: (section: Omit<SiteSection, 'id'>) => Promise<void>;
  updateSection: (section: SiteSection) => Promise<void>;
  deleteSection: (sectionId: string) => Promise<void>;
  reorderSections: (sectionIds: string[]) => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSections = async () => {
    try {
      const { data, error } = await supabase
        .from('site_sections')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setSections(data || []);
    } catch (err) {
      setError('Erreur lors du chargement des sections');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const addSection = async (section: Omit<SiteSection, 'id'>) => {
    try {
      const { error } = await supabase
        .from('site_sections')
        .insert({
          ...section,
          display_order: sections.length
        });

      if (error) throw error;
      await loadSections();
    } catch (err) {
      setError('Erreur lors de l\'ajout de la section');
      throw err;
    }
  };

  const updateSection = async (section: SiteSection) => {
    try {
      const { error } = await supabase
        .from('site_sections')
        .update({
          ...section,
          display_order: section.displayOrder
        })
        .eq('id', section.id);

      if (error) throw error;
      await loadSections();
    } catch (err) {
      setError('Erreur lors de la mise à jour de la section');
      throw err;
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from('site_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;
      await loadSections();
    } catch (err) {
      setError('Erreur lors de la suppression de la section');
      throw err;
    }
  };

  const reorderSections = async (sectionIds: string[]) => {
    try {
      const updates = sectionIds.map((id, index) => ({
        id,
        display_order: index
      }));

      const { error } = await supabase
        .from('site_sections')
        .upsert(updates);

      if (error) throw error;
      await loadSections();
    } catch (err) {
      setError('Erreur lors de la réorganisation des sections');
      throw err;
    }
  };

  return (
    <NavigationContext.Provider value={{
      sections,
      isLoading,
      error,
      addSection,
      updateSection,
      deleteSection,
      reorderSections
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}