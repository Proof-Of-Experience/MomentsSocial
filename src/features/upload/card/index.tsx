import React from 'react'
import { UploadCardProps } from '@/model/card'

const UploadCard = ({ icon, title, ...rest }: UploadCardProps) => {
    return (
        <button
            className="flex flex-col justify-center items-center cursor-pointer shadow-xl h-[220px] text-center border rounded-lg hover:bg-gray-200 focus:bg-gray-200"
            {...rest}>
            {icon}
            <span className="block mt-4 text-[28px] font-medium">{title}</span>
        </button>
    )
}

export default UploadCard