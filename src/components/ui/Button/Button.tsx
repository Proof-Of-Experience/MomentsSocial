import React from 'react'

interface PrimaryButtonProps {
  text: string,
  className?: string,
  [rest: string]: any;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text = 'text', className = '', ...rest }) => {
  return (
    <button
      {...rest}
      className={
        `bg-blue-400 text-white transition-all rounded-lg px-10 py-2 font-poppins font-bold hover:opacity-75
          ${className}
        `}>
      {text}
    </button>
  )
}

export { PrimaryButton }