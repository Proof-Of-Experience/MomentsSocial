import React from 'react';

interface SkeletonProps {
    width?: string;
    height?: string;
    className?: string;
}

const MomentSkeleton: React.FC<SkeletonProps> = ({ width = 'w-full', height = 'h-4', className = '' }) => (
    <div className={`${width} ${height} bg-gray-300 animate-pulse rounded ${className}`}></div>
);

export default MomentSkeleton;
