export interface LayoutProps {
	gridView: string;
	updateLayout?: (gridView: string) => void;
}

export interface MainLayoutProps {
	mainWrapClass?: string;
	children: JSX.Element | JSX.Element[] | string;
	title?: string;
	isLoading?: boolean;
}
