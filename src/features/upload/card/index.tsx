import React from 'react'

interface UploadCardProps {
    icon?: any,
    [x: string]: any;
}

const UploadCard = ({ icon, ...rest }: UploadCardProps) => {
    return (
        <button
            className="flex flex-col justify-center items-center cursor-pointer shadow-xl h-[220px] text-center border rounded-lg hover:bg-gray-200 focus:bg-gray-200"
            {...rest}>
            {icon}
        </button>
    )
}

export default UploadCard