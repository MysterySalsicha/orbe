'use client';

import { useState } from 'react';
import { realApi } from '@/data/realApi';
import { Button } from '@/components/ui/button';
import type { Serie } from '@/types';

interface SerieEditFormProps {
  serie: Serie;
  onSave: (updatedSerie: Serie) => void;
  onCancel: () => void;
}

const SerieEditForm: React.FC<SerieEditFormProps> = ({ serie, onSave, onCancel }) => {
  const [formData, setFormData] = useState(serie);
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
      const updatedSerie = await realApi.updateSerie(formData.id, formData);
      onSave(updatedSerie);
    } catch (error) {
      console.error('Erro ao salvar as alterações da série:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border-t border-border">
      <h3 className="text-lg font-semibold orbe-text-secondary">Modo de Edição - Série</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Nome</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="originalName" className="block text-sm font-medium text-muted-foreground">Nome Original</label>
          <input
            type="text"
            name="originalName"
            id="originalName"
            value={formData.originalName || ''}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="numberOfSeasons" className="block text-sm font-medium text-muted-foreground">Nº de Temporadas</label>
          <input
            type="number"
            name="numberOfSeasons"
            id="numberOfSeasons"
            value={formData.numberOfSeasons || 0}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="numberOfEpisodes" className="block text-sm font-medium text-muted-foreground">Nº Total de Episódios</label>
          <input
            type="number"
            name="numberOfEpisodes"
            id="numberOfEpisodes"
            value={formData.numberOfEpisodes || 0}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="overview" className="block text-sm font-medium text-muted-foreground">Sinopse</label>
        <textarea
          name="overview"
          id="overview"
          rows={5}
          value={formData.overview || ''}
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

export default SerieEditForm;
