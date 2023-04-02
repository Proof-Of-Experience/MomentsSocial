import { Real } from '@/components/snippets';

const Reals = ({ imageData }: any) => {

    return (
        <div className='grid lg:grid-cols-7 md:grid-cols-6 gap-4'>
            {
                imageData.slice(0, 7).map((item: any, index: any) => {
                    return (
                        <div key={`real-${index}`} className="overflow-hidden">
                            <Real item={item} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Reals
