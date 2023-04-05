import React from 'react'
import { PrimaryButtonProps } from '@/model/core'

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text = 'text', loader, className = '', ...rest }) => {
  return (
    <button
      {...rest}
      disabled={loader ? true : false}
      className={
        `bg-blue-500 text-white transition-all rounded-lg px-10 py-2 font-poppins font-bold hover:bg-blue-400 disabled:bg-gray-400
          ${className}
        `}>
      <span className={`${loader ? 'mr-3' : ''}`}>{text}</span>

      {
        loader &&
        <div
          className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]" />
        </div>
      }
    </button>
  )
}

export { PrimaryButton }