import React from 'react';
import errorIcon from '../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'

export default function ErrorMessage() {
  return (
    <div style={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '2rem' }}>
      <img src={errorIcon} height={50} width={50} />
      <p style={{ color: '#D3222A', margin: 0, marginTop: '1rem', fontWeight: 'bold', textAlign: 'center'}}>
        No se ha podido realizar la consulta debido a un error del sistema
      </p>
      <p style={{ color: '#014571', margin: 0, marginTop: '1rem' }}>
        Por favor, inténtalo más tarde.
      </p>
    </div>
  )
}