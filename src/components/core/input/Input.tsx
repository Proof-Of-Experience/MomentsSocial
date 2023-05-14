import React from 'react'
import { PrimaryInputProps } from '@/model/core'

const PrimaryInput: React.FC<PrimaryInputProps> = ({ id, label, className, ...rest }) => {
  return (
    <>
      {label &&
        <label htmlFor={id} className="block mb-1">{label}</label>
      }
      <input
        {...rest}
        id={id}
        className={`${className ? className : ''} border border-[#5798fb] py-3 px-4 text-md rounded-md focus:outline-none`}
      />
    </>
  )
}

export { PrimaryInput }