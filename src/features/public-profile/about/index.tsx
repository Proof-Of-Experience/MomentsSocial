import { parseStringInnerHtml } from '@/utils';
import React from 'react';

const About = ({ userDetails }: any) => {
	return (
		<div>
			{userDetails?.Profile?.Description ? (
				<div
					dangerouslySetInnerHTML={{
						__html: parseStringInnerHtml(userDetails?.Profile?.Description),
					}}
				></div>
			) : (
				<p>No description available</p>
			)}
		</div>
	);
};

export default About;
