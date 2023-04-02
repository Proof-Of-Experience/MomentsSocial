import Moment from '@/components/snippets/moment';

const Moments = ({ imageData }: any) => {

    return (
        <div className='grid lg:grid-cols-7 md:grid-cols-6 gap-4'>
            {
                imageData.slice(0, 7).map((item: any, index: any) => {
                    return (
                        <div key={`moment-${index}`} className="overflow-hidden">
                            <Moment item={item} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Moments
