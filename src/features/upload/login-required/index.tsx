import React from 'react'
import { PrimaryButton } from '@/components/ui/button'

const LoginRequired = () => {
  return (
    <div>
      <PrimaryButton
        text='Login'
        onClick={async () => {
          const { identity } = (await import('deso-protocol'))
          identity.login()
        }}
      />
    </div>
  )
}

export default LoginRequired