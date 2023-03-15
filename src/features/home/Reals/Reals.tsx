import { Real } from '@/components/snippets';

const Reals = () => {
    const mockData = [
        'https://www.w3schools.com/tags/img_girl.jpg',
        'https://www.w3schools.com/tags/img_girl.jpg',
        'https://www.w3schools.com/tags/img_girl.jpg',
        'https://www.w3schools.com/tags/img_girl.jpg',
        'https://www.w3schools.com/tags/img_girl.jpg',
        'https://www.w3schools.com/tags/img_girl.jpg',
        'https://www.w3schools.com/tags/img_girl.jpg',
        'https://www.w3schools.com/tags/img_girl.jpg',
    ]

    return (
        <div className='grid lg:grid-cols-8 md:grid-cols-6 gap-4'>
            {
                mockData.slice(0, 8).map((item, index) => {
                    return (
                        <div key={`real-${index}`} className="overflow-hidden">
                            <Real imgUrl={item} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Reals

export async function getServerSideProps(context: any) {
    return {
        props: {}
    };
}
