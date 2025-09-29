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
          <label htmlFor="titulo_curado" className="block text-sm font-medium text-muted-foreground">Nome</label>
          <input
            type="text"
            name="titulo_curado"
            id="titulo_curado"
            value={formData.titulo_curado || ''}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="titulo_api" className="block text-sm font-medium text-muted-foreground">Nome Original</label>
          <input
            type="text"
            name="titulo_api"
            id="titulo_api"
            value={formData.titulo_api || ''}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="numero_temporadas" className="block text-sm font-medium text-muted-foreground">Nº de Temporadas</label>
          <input
            type="number"
            name="numero_temporadas"
            id="numero_temporadas"
            value={formData.numero_temporadas || 0}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="numero_episodios" className="block text-sm font-medium text-muted-foreground">Nº Total de Episódios</label>
          <input
            type="number"
            name="numero_episodios"
            id="numero_episodios"
            value={formData.numero_episodios || 0}
            onChange={handleChange}
            className="mt-1 block w-full bg-input border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="sinopse_curada" className="block text-sm font-medium text-muted-foreground">Sinopse</label>
        <textarea
          name="sinopse_curada"
          id="sinopse_curada"
          rows={5}
          value={formData.sinopse_curada || ''}
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
