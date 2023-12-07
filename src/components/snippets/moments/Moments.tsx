import Moment from '@/components/snippets/moment';

const Moments = ({ imageData, isLoading }: any) => {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-5 gap-7">
			{imageData.map((item: any, index: any) => {
				return (
					<div
						key={`moment-${index}`}
						className="overflow-hidden"
					>
						<Moment
							item={item}
							isLoading={isLoading}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default Moments;
