import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KoIcon from '../.././assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'
import CloseIcon from '../.././assets/icons/cerrar.svg'
import { sendGAEvent, removeEmails } from '../../core/utils/gtm';

const ContractsAdvice = (props) => {

  const {contractsError,setContractsError} = props

  // LCS: Carga de componente - Wave GdC
  useEffect(() => {
    sendGAEvent({
      event: 'component_loaded',
      info: {
        reactComponent: 'contractsAdvice.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  return (
    <div>
      {
        (contractsError) &&
        <Grid container style={{color: 'rgba(0, 69, 113, 1)',backgroundColor: '#f8dedf',padding: '12px',marginTop:'15px'}}>
          <Grid item style={{textAlign:'center'}}>
            <img src={KoIcon} alt='' width={38}/>
          </Grid>

          <Grid item style={{marginLeft:'10px'}}>
            <div>
              {'Por motivos técnicos, no podemos mostrarte la información de tus suministros.'}
            </div>
            <div>
              {'Por favor, intentalo más tarde.'}
            </div>
          </Grid>

          <img src={CloseIcon} style={{ width:'12px',position: 'absolute',top: 82,right: 20, cursor: 'pointer'}} alt='' onClick={() => {setContractsError(false)}} />

        </Grid>
      }
    </div>
  );
};

export default ContractsAdvice;