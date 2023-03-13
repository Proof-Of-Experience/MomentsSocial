import React from 'react'

interface RealProps {
  imgUrl?: string
}

const Real = ({ imgUrl, ...rest }: RealProps) => {
  return (
    <div>
      <img src={imgUrl} className="rounded-xl w-full h-[300px]" />
      <h4 className="mt-2 text-sm font-bold">Debugging useEffect Issues Made Simple</h4>
      <p className="text-sm"><small>1133 likes</small></p>
    </div>
  )
}

export default Real