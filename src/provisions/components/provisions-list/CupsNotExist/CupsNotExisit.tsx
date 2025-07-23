import React from 'react';

export default function CupsNotExist() {
  return (
    <div style={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '2rem', backgroundColor: '#F9F8F7' }}>
      <p style={{ color: '#004571', margin: 0, marginTop: '2rem', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.5rem' }}>
        El CUPS informado no existe.
      </p>
    </div>
  )
}