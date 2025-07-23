import React from 'react'

import MuiButton from '@material-ui/core/Button'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

import ButtonConfig from '../../interfaces/ButtonConfig'

const theme = createTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 4,
        minHeight: 30,
        padding: '0 1em',
        '&.MuiButton--large': {
          minHeight: '3.15rem',
          minWidth: '12.5rem'
        }
      },
      label: {
        textTransform: 'none',
        fontWeight: 400,
        fontFamily: '"Arial", sans-serif',
        fontStyle: 'normal',
        fontSize: '1.35em',
        lineHeight: 1.5,
        paddingBlock: 5
      },
      outlined: {
        padding: '0 1em'
      },
      outlinedPrimary: {
        borderColor: 'rgb(0, 69, 113)',
        color: 'rgb(0, 69, 113)',
        '&:hover': {
          backgroundColor: 'rgba(0, 69, 113, 0.1)'
        }
      },
      contained: {
        minHeight: 30,
        backgroundColor: 'rgb(255, 255, 255) !important',
        color: 'rgb(0, 69, 113)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.75)'
        },
        '&.Mui-disabled':{
          color: 'rgba(0, 0, 0, 0.26) !important',
          backgroundColor: 'rgba(0, 0, 0, 0.12) !important',
        }
      },
      containedPrimary: {
        backgroundColor: 'rgb(0, 69, 113) !important',
        color: 'white !important',
        '&:hover': {
          backgroundColor: 'rgba(0, 69, 113, 0.75) !important'
        }
      },
      sizeLarge: {
        padding: '0 1em !important'
      }
    },
  }
})

const Button = (props: ButtonConfig) => {
  return (
    <ThemeProvider theme={theme}>
      <MuiButton
        {...props}
        style={props.style}
        className={[props.className, `MuiButton--${props.size}`].join(' ')}
       
      >
        {props.img && (
          <img src={props.img} alt='imagen en el boton'/>
        )}
        {props.text}
      </MuiButton>
    </ThemeProvider>
  )
}

export default Button
