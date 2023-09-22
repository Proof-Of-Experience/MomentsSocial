import Moment from '@/components/snippets/moment';

const Moments = ({ imageData, isLoading }: any) => {

    return (
        <div className='grid lg:grid-cols-7 md:grid-cols-6 gap-4'>
            {
                imageData.map((item: any, index: any) => {
                    return (
                        <div key={`moment-${index}`} className="overflow-hidden">
                            <Moment item={item} isLoading={isLoading} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Moments
