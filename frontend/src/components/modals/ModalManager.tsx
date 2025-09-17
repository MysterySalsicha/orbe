'use client';

import { useAppStore } from '@/stores/appStore';
import SearchOverlay from './SearchOverlay';
import SuperModal from './SuperModal';
import NotificationModal from './NotificationModal';
import RatingModal from './RatingModalWrapper'; // Keep the import

import type { Notification } from '@/types'; // Import Notification type

const ModalManager: React.FC = () => {
  const { 
    isSearchOpen, 
    closeSearch, 
    isNotificationModalOpen, 
    closeNotificationModal, 
    notifications, 
    markNotificationAsRead, 
    isRatingModalOpen, 
    ratingModalData, 
    closeRatingModal 
  } = useAppStore();

  const handleSearch = (query: string) => {
    // Implement search logic here or pass it down to SearchOverlay
    console.log('Search query:', query);
  };

  const handleNotificationClick = (notification: Notification) => { // Fixed 'any' type
    // Implement notification click logic here
    console.log('Notification clicked:', notification);
  };

  return (
    <>
      <SearchOverlay /> {/* Removed props */}
      <SuperModal />
      <NotificationModal /> {/* Removed props */}
      {/* Removed RatingModal component */}
    </>
  );
};

export default ModalManager;
