'use client';

import { useAppStore } from '@/stores/appStore';
import SearchOverlay from './SearchOverlay';
import SuperModal from './SuperModal';
import NotificationModal from './NotificationModal';
import RatingModal from './RatingModalWrapper';

const ModalManager: React.FC = () => {
  const { 
    isSearchOpen, 
    closeSearch, 
    openSearch, 
    isNotificationModalOpen, 
    closeNotificationModal, 
    notifications, 
    markNotificationAsRead, 
    isSuperModalOpen, 
    superModalData, 
    closeSuperModal, 
    isRatingModalOpen, 
    ratingModalData, 
    closeRatingModal 
  } = useAppStore();

  const handleSearch = (query: string) => {
    // Implement search logic here or pass it down to SearchOverlay
    console.log('Search query:', query);
  };

  const handleNotificationClick = (notification: any) => {
    // Implement notification click logic here
    console.log('Notification clicked:', notification);
  };

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onSearch={handleSearch}
      />
      <SuperModal />
      <NotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={closeNotificationModal}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onNotificationClick={handleNotificationClick}
      />
      <RatingModal 
        isOpen={isRatingModalOpen}
        midia={ratingModalData.midia}
        type={ratingModalData.type}
        onClose={closeRatingModal}
        onSubmit={() => {}} // Placeholder, actual logic might be in RatingModalWrapper
      />
    </>
  );
};

export default ModalManager;
