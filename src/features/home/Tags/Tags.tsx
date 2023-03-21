import { tags } from './mockData';

const Tags = () => {

  return (
    <div>
      {
        tags.map((item: any, index: number) => {
          return (
            <button key={`tag-${index}`} className="bg-gray-200 text-black py-1 px-5 rounded-md mr-4" title={item.name}>
              {item.name}
            </button>
          )
        })
      }
    </div>
  )
}

export default Tags

