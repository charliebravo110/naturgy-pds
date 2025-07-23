import React from 'react';
import errorIcon from '../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'

export default function ErrorSystemMessage() {
  return (
    <div style={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '2rem' }}>
      <img src={errorIcon} height={50} width={50} />
      <p style={{ color: '#D3222A', margin: 0, marginTop: '1rem', fontWeight: 'bold', textAlign: 'center', maxWidth: '60%'}}>
        Lo sentimos, el código CUPS introducido no existe en nuestro sistema
      </p>
    </div>
  )
}