import React from 'react'
import { PrimaryInputProps } from '@/model/core'

const PrimaryInput: React.FC<PrimaryInputProps> = ({ id, label, className, hasLeftDropdown, dropdownOptions = [], ...rest }) => {
  return (
    <>
      {label &&
        <label htmlFor={id} className="block mb-1">{label}</label>
      }

      <div className={`flex items-center ${hasLeftDropdown ? '' : 'flex-col'}`}>
        {
          hasLeftDropdown &&
          <select
            id={id}
            {...rest}
            className={`border border-[#5798fb] py-3 px-4 text-md rounded-md focus:outline-none bg-transparent pr-2`}
          >
            {dropdownOptions.map((option: any) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        }

        <input
          {...rest}
          id={id}
          className={`${className ? className : ''} border border-[#5798fb] py-3 px-4 text-md rounded-md focus:outline-none ${hasLeftDropdown ? 'mb-0' : 'mb-4'}`}
        />
      </div>
    </>
  )
}

export { PrimaryInput }