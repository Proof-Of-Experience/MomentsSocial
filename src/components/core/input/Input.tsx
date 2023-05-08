import React from 'react'
import { PrimaryInputProps } from '@/model/core'

const PrimaryInput: React.FC<PrimaryInputProps> = ({ label, className, ...rest }) => {
  return (
    <>
      {label &&
        <label className="block mb-1">{label}</label>
      }
      <input
        {...rest}
        className={`${className ? className : ''} border border-[#5798fb] py-3 px-4 text-md rounded-md focus:outline-none`}
      />
    </>
  )
}

export { PrimaryInput }