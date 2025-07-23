import React from 'react';
import infoIcon from '../../../../assets/icons/info.svg'
import NaturgyArrowTooltip from '../../../../common/components/tooltip/arrow/ArrowTooltip';
import { createTheme, MuiThemeProvider } from '@material-ui/core';

interface ErrorInterface {
  title: string
}

const theme = createTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '1em',
        backgroundColor: 'white !important',
        color: '#5985a2 !important',
        padding: '15px !important',
        boxShadow: '2px 2px 2px 2px #e2e2e2 !important',
        maxWidth: '300px !important',
        fontFamily: 'FSEmeric',
        textAlign: 'center'
      },
      tooltipArrow: {
        fontSize: '1em',
        backgroundColor: 'white !important',
        color: '#5985a2 !important',
        padding: '15px !important',
        boxShadow: '2px 2px 2px 2px #e2e2e2 !important',
        maxWidth: '300px !important',
        fontFamily: 'FSEmeric',
        textAlign: 'center'
      }
    }
  }
});

export default function CupsNoDisponible(props: ErrorInterface) {
  return (
    <div style={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', backgroundColor: '#F9F8F7' }}>
      <p style={{ color: '#004571', margin: 0, marginTop: '2rem', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.5rem',textAlign: 'center' }}>
        El CUPS facilitado no está disponible para la contratación.
      </p>
      <div style={{ marginLeft: '0.3rem',alignItems: 'center',display: 'inline-flex',marginRight: '1rem' }}>
      <MuiThemeProvider theme={theme}>
        <NaturgyArrowTooltip title={props.title} placement='bottom' style={{ backgroundColor: 'white' }}>
          <img src={infoIcon} height={20} width={20} />
        </NaturgyArrowTooltip>
        </MuiThemeProvider>
      </div>
    </div>
  )
}