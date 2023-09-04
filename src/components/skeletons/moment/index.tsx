import React from 'react';

interface SkeletonProps {

}

const MomentSkeleton: React.FC<SkeletonProps> = () => (
    <div className="animate-pulse mr-5">
        <div className="bg-gray-200 rounded-xl w-full h-[280px]"></div>
        <div className="mt-3 h-8 bg-gray-200 rounded w-full"></div>
        <div className="flex">
            <div className="mt-2 h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
            <div className="mt-2 h-5 w-10 bg-gray-200 rounded"></div>
        </div>
    </div>
);

export default MomentSkeleton;
