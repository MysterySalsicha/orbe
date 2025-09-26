'use client';

import { useState } from 'react';
import { realApi } from '@/data/realApi';
import { Button } from '@/components/ui/button';
import type { Anime } from '@/types';

interface AnimeEditFormProps {
  anime: Anime;
  onSave: (updatedAnime: Anime) => void;
  onCancel: () => void;
}

const AnimeEditForm: React.FC<AnimeEditFormProps> = ({ anime, onSave, onCancel }) => {
  const [formData, setFormData] = useState(anime);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseInt(value, 10) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedAnime = await realApi.updateAnime(formData.id, formData);
      onSave(updatedAnime);
    } catch (error) {
      console.error('Erro ao salvar as alterações do anime:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border-t border-border">
      <h3 className="text-lg font-semibold orbe-text-secondary">Modo de Edição - Anime</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="titleRomaji" className="block text-sm font-medium text-muted-foreground">Título Romaji</label>
          <input
            type="text"
            name="titleRomaji"
            id="titleRomaji"
            value={formData.titleRomaji || ''}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="titleEnglish" className="block text-sm font-medium text-muted-foreground">Título Inglês</label>
          <input
            type="text"
            name="titleEnglish"
            id="titleEnglish"
            value={formData.titleEnglish || ''}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="episodes" className="block text-sm font-medium text-muted-foreground">Episódios</label>
          <input
            type="number"
            name="episodes"
            id="episodes"
            value={formData.episodes || 0}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-muted-foreground">Fonte</label>
          <input
            type="text"
            name="source"
            id="source"
            value={formData.source || ''}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">Descrição</label>
        <textarea
          name="description"
          id="description"
          rows={5}
          value={formData.description || ''}
          onChange={handleChange}
          className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
};

export default AnimeEditForm;
