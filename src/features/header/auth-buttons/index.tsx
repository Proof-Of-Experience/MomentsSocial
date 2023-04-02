import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from '@/components/core/button'
import { selectAuthUser, setAuthUser } from '@/slices/authSlice';

const AuthButtons = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);

  return (
    <div className="flex justify-end">
      {
        authUser?.currentUser ?
          <PrimaryButton
            text='Logout'
            className="ml-3"
            onClick={async () => {
              const { identity } = (await import('deso-protocol'))
              await identity.logout()
              dispatch(setAuthUser({}));
            }} /> :
          <div className="flex items-center">
            <PrimaryButton
              text='Login'
              onClick={async () => {
                const { identity } = (await import('deso-protocol'))
                identity.login()
              }}
            />
            <PrimaryButton
              text='Signup'
              className="ml-3"
            />
          </div>
      }
    </div>
  )
}

export default AuthButtons