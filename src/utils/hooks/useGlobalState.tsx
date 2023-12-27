import { useContext } from 'react';
import { GlobalStateContext, IGlobalStateContextProps } from '../contexts/globalStateContext';

const useGlobalState = (): IGlobalStateContextProps => {
	const context = useContext(GlobalStateContext);

	if (!context) {
		throw new Error('useGlobalState must be used within a SidebarProvider');
	}
	return {
		...context,
	};
};

export default useGlobalState;
