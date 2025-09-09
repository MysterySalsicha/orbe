'use client';

import RatingModal from './RatingModal';
import { useAppStore } from '@/stores/appStore';

const RatingModalWrapper = () => {
  const { 
    isRatingModalOpen, 
    ratingModalData, 
    closeRatingModal 
  } = useAppStore();

  const handleRating = (rating: 'gostei' | 'amei' | 'nao_gostei', review?: string) => {
    // Aqui você pode implementar a lógica para salvar a avaliação
    // Por exemplo, enviar para o backend
    console.log('Avaliação:', {
      midia: ratingModalData.midia,
      type: ratingModalData.type,
      action: ratingModalData.action,
      rating,
      review
    });

    // Fechar o modal após salvar
    closeRatingModal();
  };

  return (
    <RatingModal
      isOpen={isRatingModalOpen}
      midia={ratingModalData.midia}
      type={ratingModalData.type || ''}
      action={ratingModalData.action || 'ja_assisti'}
      onClose={closeRatingModal}
      onRating={handleRating}
    />
  );
};

export default RatingModalWrapper;

