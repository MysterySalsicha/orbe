import React from 'react';

const MidiaCardSkeleton = () => {
  return (
    <div className="w-[200px] bg-card rounded-lg overflow-hidden shadow-md">
      {/* Placeholder para o pôster */}
      <div className="w-full h-[300px] bg-gray-700 animate-pulse"></div>
      
      {/* Placeholder para as informações de texto */}
      <div className="p-3 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
  );
};

export default MidiaCardSkeleton;
