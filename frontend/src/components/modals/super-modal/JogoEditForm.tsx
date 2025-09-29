'use client';

import { useState } from 'react';
import { realApi } from '@/data/realApi';
import { Button } from '@/components/ui/button';
import type { Jogo } from '@/types';

interface JogoEditFormProps {
  jogo: Jogo;
  onSave: (updatedJogo: Jogo) => void;
  onCancel: () => void;
}

const JogoEditForm: React.FC<JogoEditFormProps> = ({ jogo, onSave, onCancel }) => {
  const [formData, setFormData] = useState(jogo);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedJogo = await realApi.updateJogo(formData.id, formData);
      onSave(updatedJogo);
    } catch (error) {
      console.error('Erro ao salvar as alterações do jogo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border-t border-border">
      <h3 className="text-lg font-semibold orbe-text-secondary">Modo de Edição - Jogo</h3>
      
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
        <label htmlFor="sinopse_curada" className="block text-sm font-medium text-muted-foreground">Sinopse</label>
        <textarea
          name="sinopse_curada"
          id="sinopse_curada"
          rows={10}
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

export default JogoEditForm;
