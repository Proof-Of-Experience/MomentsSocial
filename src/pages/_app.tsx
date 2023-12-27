import { wrapper } from '@/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react';
import { SidebarProvider } from '@/utils/contexts/sidebarContext';
import { GlobalStateProvider } from '@/utils/contexts/globalStateContext';

export default function App({ Component, ...rest }: AppProps) {
	const { store, props } = wrapper.useWrappedStore(rest);
	const { pageProps } = props;

	const livepeerClient = createReactClient({
		provider: studioProvider({
			apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY || '',
		}),
	});

	return (
		<Provider store={store}>
			<GlobalStateProvider>
				<LivepeerConfig client={livepeerClient}>
					<SidebarProvider>
						<Component {...pageProps} />
					</SidebarProvider>
				</LivepeerConfig>
			</GlobalStateProvider>
		</Provider>
	);
}
