import React, {createContext, ReactNode, useEffect, useState} from 'react';
import { useLocation, useHistory } from 'react-router'
import { thunkGetMasterData } from '../common/components/send-url/store/actions/SendUrlThunkActions';
import { useDispatch } from 'react-redux';

interface OfflinePaymentContextProps {
}

const OfflinePaymentContext = createContext<OfflinePaymentContextProps | undefined>(undefined);

export const OfflinePaymentProvider = ({ children }: {children: ReactNode}) => {
  const history = useHistory()
  const location = useLocation() as any
  const dispatch = useDispatch()
  const [userOffline, setUserOffline] = useState('null' as string)
  const [passwordOffline, setPasswordOffline] = useState('null' as string)

  useEffect(() => {
    
  },[])

  useEffect(() => {
    const documentLogin = sessionStorage.getItem('userDocumentLogin')
    const offlineFlag = sessionStorage.getItem('OfflinePaymentFlag')

    if (userOffline === 'null' && documentLogin) {
      console.log('mao entra')
      dispatch(thunkGetMasterData(
        'CARD_PAYMENT',
        'ES',
        'OFFLINE',
        (response) => {
          if (response && response.length > 0) {
            const parts = response[0].value?.split('-')
            const user = parts[0]
            const password = parts[1]
            setUserOffline(user)
            setPasswordOffline(password)

            if (user === documentLogin) {
              sessionStorage.clear()
              history.push('/')
              window.location.reload()
            }
          }
        }
      ))
    }

    if (((offlineFlag && offlineFlag === '1') || 
    (documentLogin && documentLogin === userOffline)) && 
    location.pathname !== '/offlinepayment') {
      sessionStorage.clear()
      history.push('/')
      window.location.reload()
    }
  },[location.pathname])

  return (
      <OfflinePaymentContext.Provider
      value={({

      })}>
          {children}
      </OfflinePaymentContext.Provider>
  );
};

