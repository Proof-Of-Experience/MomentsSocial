import { useWindowSize } from '@/utils/hooks';
import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect } from 'react';

export interface ISidebarContextProps {
	collapseSidebar: boolean;
	setCollapseSidebar: Dispatch<SetStateAction<boolean>>;
}

export const SidebarContext = createContext<ISidebarContextProps | undefined>(undefined);

interface ISidebarProviderProps {
	children: ReactNode;
}

export const SidebarProvider = ({ children }: ISidebarProviderProps) => {
	const { isSmallDevice } = useWindowSize();
	const [collapseSidebar, setCollapseSidebar] = useState<boolean>(false);

	useEffect(() => {
		setCollapseSidebar(isSmallDevice ? true : false);
	}, [isSmallDevice]);

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
