import React from 'react'

const Info = ({ userDetails }: any) => {

  return (
    <>
      <div className="flex flex-wrap justify-center">
        <div className="w-full lg:w-4/12 px-4 lg:order-1">
          {/* <div className="flex justify-center py-4 lg:pt-4 pt-8">
            <div className="mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">22</span>
              <span className="text-sm text-blueGray-400">Videos</span>
            </div>
            <div className="mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">10</span>
              <span className="text-sm text-blueGray-400">Moments</span>
            </div>
            <div className="lg:mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">89</span>
              <span className="text-sm text-blueGray-400">Comments</span>
            </div>
          </div> */}
        </div>

        <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
          <div className="relative -mt-[80px]">
            <img alt="..."
              src={userDetails?.Avatar}
              className=" shadow-xl rounded-full h-[160px] w-[160px] align-middle border-none mx-auto" />

            <h3 className="text-2xl font-semibold text-center mt-3">
              {userDetails?.Profile?.Username}
            </h3>
          </div>
        </div>

        <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
          {/* <button className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
            Subscribe
          </button> */}
        </div>
      </div>
    </>
  )
}

export default Info