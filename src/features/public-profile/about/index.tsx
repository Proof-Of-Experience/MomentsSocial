import React from 'react'

const About = ({ userDetails }: any) => {

	return (
		<div>
			{
				userDetails?.Profile?.Description ?
					<p>{userDetails?.Profile?.Description}</p> :
					<p>No description available</p>
			}
		</div>
	)
}

export default About