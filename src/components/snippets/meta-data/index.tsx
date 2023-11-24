import React from 'react';
import Head from 'next/head';
import { MetaDataProps } from '@/model/meta';

const MetaData = ({ title = 'Moments' }: MetaDataProps) => {
	return (
		<Head>
			<title>{title}</title>
			<meta charSet="utf-8" />
		</Head>
	);
};

export default MetaData;
