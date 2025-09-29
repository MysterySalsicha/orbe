'use client';

import { useState } from 'react';
import { realApi } from '@/data/realApi';
import { Button } from '@/components/ui/button';
import type { Filme } from '@/types';

interface FilmeEditFormProps {
  filme: Filme;
  onSave: (updatedFilme: Filme) => void;
  onCancel: () => void;
}

const FilmeEditForm: React.FC<FilmeEditFormProps> = ({ filme, onSave, onCancel }) => {
  const [formData, setFormData] = useState(filme);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // O backend espera o ID do TMDB, que está no campo 'id' do nosso objeto
      const updatedFilme = await realApi.updateFilme(formData.id, formData);
      onSave(updatedFilme);
    } catch (error) {
      console.error('Erro ao salvar as alterações do filme:', error);
      // Adicionar feedback de erro para o usuário aqui
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border-t border-border">
      <h3 className="text-lg font-semibold orbe-text-secondary">Modo de Edição</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="titulo_curado" className="block text-sm font-medium text-muted-foreground">Título</label>
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
          <label htmlFor="titulo_api" className="block text-sm font-medium text-muted-foreground">Título Original</label>
          <input
            type="text"
            name="titulo_api"
            id="titulo_api"
            value={formData.titulo_api || ''}
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

      <div>
        <label htmlFor="poster_curado" className="block text-sm font-medium text-muted-foreground">URL do Pôster</label>
        <input
          type="text"
          name="poster_curado"
          id="poster_curado"
          value={formData.poster_curado || ''}
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

export default FilmeEditForm;
