import React from 'react'
import { PlaceholderProps } from '@/model/core'

const Placeholder: React.FC<PlaceholderProps> = ({
  className,
  text = "No data available",
}) => {
  return (
    <div className={`${className} text-center`}>
      <img
        className="w-[200px] h-[200px] mx-auto"
        src="/data-placeholder.svg"
        alt="No data"
      />
      <p className="text-xl">{text}</p>
    </div>
  )
}

export { Placeholder }