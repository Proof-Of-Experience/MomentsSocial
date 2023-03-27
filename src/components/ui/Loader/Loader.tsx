import React from "react";

interface LoadingSpinnerProps {
    isLoading?: boolean
}

const LoadingSpinner = ({ isLoading }: LoadingSpinnerProps) => {
    return (
        <div className={`spinner-container ${isLoading ? 'bg-gray-200/75' : 'hidden'} z-10 fixed grid justify-center items-center w-[calc(100%_-_80px)] h-[calc(100vh_-_80px)]`}>
            <div className="loading-spinner animate-spin w-[50px] h-[50px] border-[10px] border-gray-300 border-t-[10px] border-t-blue-400 rounded-[50%]">
            </div>
        </div>
    );
}

export { LoadingSpinner }