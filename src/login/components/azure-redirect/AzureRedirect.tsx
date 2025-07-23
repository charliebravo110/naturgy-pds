import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { thunkCodeLogin } from '../../store/actions/LoginThunkActions';
import ZeusWebData from '../../../common/interfaces/ZeusWebData';
import { thunkZeusSincro } from '../../../common/components/zeus-sincro/ZeusSincroThunkActions';
import { resetLoginState } from '../../store/actions/LoginActions';
import Spinner from '../../../common/components/spinner/Spinner';

// LCS: Importa la función - Wave 3
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm';

const AzureRedirect = (props: any) => {
    const { search } = props.location;
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [ isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      // LCS: Enviar evento de GdC a GA - Wave 3
      sendGAEvent({
        event: 'view',
        content_group: 'login',
        page_url: removeEmails(window.location.href),
        user_id: sessionStorage.getItem('id'),
        previous_path: removeEmails(sessionStorage.getItem("previousPage")),
        user_type: sessionStorage.getItem('user_type'),
        browsing_type: sessionStorage.getItem('browsing_type'),
        element_type: 'medicion de pagina',
        ga_client_id: sessionStorage.getItem('ga_client_id'),
        cups: 'no aplica',
        supply_type: 'no aplica'
      });
    })

    useEffect(() => {
        const values = queryString.parse(search);
        const data = {
            code: values.code,
            state: values.state
        };

        dispatch(thunkCodeLogin(null, data, (response) => {
              let indLegalAccept = '1'
      
              let webData = {
                indLegalAccept: indLegalAccept
              } as ZeusWebData;
      
              const user = response.user;
              dispatch(thunkZeusSincro(webData, null, null));
              dispatch(resetLoginState());
      
              const href = sessionStorage.getItem('href');
              const href3000 = (sessionStorage.href.split(':3000'));
              const hrefcom = (sessionStorage.href.split('.com'));
              const hrefes = (sessionStorage.href.split('.es'));
              let hrefGo
      
              if (href3000[1]){
                hrefGo = (sessionStorage.href.split(':3000'));
              } 
              if (hrefcom[1]){
                hrefGo = (sessionStorage.href.split('.com'));
              } 
              if (hrefes[1]){
                hrefGo = (sessionStorage.href.split('.es'));
              }
      
              sessionStorage.removeItem('href')
      
              if (user === sessionStorage.getItem('nif_factura')) {
                 // handleDownloadDocument(sessionStorage.getItem('factura'))
              }              
              setIsLoading(false);
          }
          ))
     }, [search]);

     return (
      <>
        {
          isLoading ? <Spinner fixed={true} /> : <Redirect to='/login' />
        }
      </>
     )
}

export default AzureRedirect;