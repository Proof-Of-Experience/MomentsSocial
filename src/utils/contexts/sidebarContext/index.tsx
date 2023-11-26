import { useWindowSize } from '@/utils/hooks';
import { Dispatch, SetStateAction, createContext, useState, ReactNode } from 'react';

export interface ISidebarContextProps {
	collapseSidebar: boolean;
	setCollapseSidebar: Dispatch<SetStateAction<boolean>>;
}

export const SidebarContext = createContext<ISidebarContextProps | undefined>(undefined);

interface ISidebarProviderProps {
	children: ReactNode;
}

export const SidebarProvider = ({ children }: ISidebarProviderProps) => {
	const { width: windowWidth } = useWindowSize();
	const initCollapse = windowWidth <= 991 ? true : false;
	const [collapseSidebar, setCollapseSidebar] = useState<boolean>(initCollapse);

	return (
		<SidebarContext.Provider
			value={{
				collapseSidebar,
				setCollapseSidebar,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
};
