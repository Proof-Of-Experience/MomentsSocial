import { tags } from './mockData';

const Tags = ({ onClick }: any) => {

  return (
    <div>
      {
        tags.map((item: any, index: number) => {
          return (
            <button
              key={`tag-${index}`}
              className="bg-gray-200 text-black py-1 px-5 rounded-md mr-4 focus:bg-gray-600 focus:text-white"
              title={item.name}
              onClick={() => onClick(item.value.toLowerCase())}>
              {item.name}
            </button>
          )
        })
      }
    </div>
  )
}

export default Tags

