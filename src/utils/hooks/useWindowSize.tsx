import { useState, useEffect } from 'react';

export interface IWindowSize {
	width: number;
	height: number;
}
const useWindowSize = (): IWindowSize => {
	const initWindowSize: IWindowSize = {
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	};
	const [windowSize, setWindowSize] = useState<IWindowSize>(initWindowSize);

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowSize;
};

export default useWindowSize;
