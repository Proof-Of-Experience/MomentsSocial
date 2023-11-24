import { createContext, useState } from 'react';
import { LayoutProps } from '@/model/layout';

const initialState = {
	gridView: 'grid',
	updateLayout: () => {},
};

const VideoLayoutContext = createContext<LayoutProps | null>(initialState);

export const VideoLayoutProvider = ({ children }: any) => {
	const [currentLayout, setCurrentLayout] = useState('');

	const updateLayout = (layout: string) => {
		setCurrentLayout(layout);
	};

	return (
		<VideoLayoutContext.Provider value={{ gridView: currentLayout || 'grid', updateLayout }}>
			{children}
		</VideoLayoutContext.Provider>
	);
};

export default VideoLayoutContext;
