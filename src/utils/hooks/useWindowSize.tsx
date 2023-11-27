import { useState, useEffect } from 'react';

export interface IWindowSize {
	width: number;
	height: number;
	isSmallDevice: boolean;
}
const useWindowSize = (): IWindowSize => {
	const smallDeviceMaxWidth = 1039;
	const initWindowSize: IWindowSize = {
		width: 0,
		height: 0,
		isSmallDevice: false,
	};
	const [windowSize, setWindowSize] = useState<IWindowSize | undefined>(undefined);

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window?.innerWidth || 0,
				height: window?.innerHeight || 0,
				isSmallDevice: window?.innerWidth <= smallDeviceMaxWidth ? true : false,
			});
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	if (!windowSize) return initWindowSize;
	return windowSize;
};

export default useWindowSize;
