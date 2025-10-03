import React from 'react';

interface DaySeparatorCardProps {
  dayName: string;
}

const DaySeparatorCard: React.FC<DaySeparatorCardProps> = ({ dayName }) => {
  return (
    <div className="w-[200px] h-[300px] bg-gray-800 rounded-lg shadow-md flex items-center justify-center p-4">
      <h2 className="text-4xl font-bold text-white text-center leading-tight">{dayName}</h2>
    </div>
  );
};

export default DaySeparatorCard;
