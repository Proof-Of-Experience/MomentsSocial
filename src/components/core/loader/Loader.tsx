import React from "react";

interface LoadingSpinnerProps {
    isLoading?: boolean;
    fullHeight?: boolean;
}

const LoadingSpinner = ({ isLoading, fullHeight }: LoadingSpinnerProps) => {
    return (
        <div className={`spinner-container ${isLoading ? '' : 'hidden'} z-10 grid justify-center items-center ${fullHeight ? 'bg-gray-200/75 fixed w-[calc(100%_-_80px)] h-[calc(100vh_-_80px)]' : 'relative mt-10'}`}>
            <div className="loading-spinner animate-spin w-[50px] h-[50px] border-[10px] border-gray-300 border-t-[10px] border-t-blue-400 rounded-[50%]">
            </div>
        </div>
    );
}

export { LoadingSpinner }