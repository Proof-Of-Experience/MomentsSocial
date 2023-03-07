import Head from 'next/head'
import React from 'react'

interface MetaDataProps {
  title?: string
}

const MetaData = ({
  title = "DTube Club"
}: MetaDataProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
    </Head>
  )
}

export default MetaData