import React from 'react'
import { PrimaryInputProps } from '@/model/core'

const PrimaryTextArea: React.FC<PrimaryInputProps> = ({ className, ...rest }) => {
  return (
    <textarea
      {...rest}
      className={`${className ? className : ''} border border-[#5798fb] py-3 px-5 text-md rounded-md focus:outline-none`}
    />
  )
}

export { PrimaryTextArea }