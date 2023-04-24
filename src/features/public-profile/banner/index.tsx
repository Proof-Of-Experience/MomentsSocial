import React from 'react'

const Banner = () => {
  return (
    <section className="relative block h-500-px">
      <div className="absolute top-0 w-full bg-center bg-cover h-[300px]"
        style={{
          backgroundImage: 'url(\'https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80\')'
        }}>
        <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
      </div>
    </section>
  )
}

export default Banner