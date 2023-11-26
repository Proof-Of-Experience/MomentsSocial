import { useContext } from 'react';
import { ISidebarContextProps, SidebarContext } from '../contexts/sidebarContext';
import useWindowSize, { IWindowSize } from './useWindowSize';

const useSidebar = (): ISidebarContextProps & { windowSize: IWindowSize } => {
	const context = useContext(SidebarContext);
	const windowSize = useWindowSize();

	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider');
	}
	return {
		...context,
		windowSize,
	};
};

export default useSidebar;
