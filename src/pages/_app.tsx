import { wrapper } from '@/store'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'

export default function App({ Component, ...rest}: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  return (
    <Provider store={store}>
      <SessionProvider refetchInterval={60}>
        <Component {...pageProps} />
      </SessionProvider>
    </Provider>
  )
}
