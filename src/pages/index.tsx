import styles from '@/styles/Home.module.css'
import MainLayout from '@/layouts/MainLayout'
import { getSession, SessionProvider } from 'next-auth/react'

export default function Home({ session }: any) {
  return (
    <SessionProvider session={session} refetchInterval={60}>
      <MainLayout title='Moments'>
        Home page
      </MainLayout>
    </SessionProvider>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  return {
    props: { session: session }
  };
}
