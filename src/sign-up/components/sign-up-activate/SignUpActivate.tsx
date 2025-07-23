import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { thunkActivateUser } from '../../store/actions/SignUpThunkActions'

// LCS: Importa la función - Wave 3
import { sendGAEvent, getBrowsing_type, getGAClientId, removeEmails } from '../../../core/utils/gtm';

const SignUpActivate = (props: any) => {
  const dispatch = useDispatch()
  
  useEffect(() => {    
    // LCS: Enviar evento de GdC a GA - Wave 3
    getBrowsing_type()
    getGAClientId()
    sendGAEvent({
      event: 'view',
      content_group: 'registro',
      page_url: removeEmails(window.location.href),
      user_id: 'no aplica',
      previous_path: document.referrer ? document.referrer : removeEmails(sessionStorage.getItem("previousPage")),
      user_type: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  useEffect(() => {
    const fetchData = async () => {
        try{
          await dispatch(thunkActivateUser(props.match.params.hash, props.match.params.email.toLowerCase(), () => {
            props.history.push('/signup/activate/success')
            console.log('102 no entra al catch')
      
          }))

        }catch(e){
          if((e as any).result.codResult == '2022'){
            console.log('102 codResult en signup->',(e as any).result.codResult)

            props.history.push('/signup/activate/timeout')
          }

        }
      }
      fetchData();
  },[])

  return null
}

export default SignUpActivate
