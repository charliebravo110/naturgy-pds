import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, makeStyles } from '@material-ui/core';
import ArrowDown from '../../../../assets/icons/flecha_down_blue.svg';
import ArrowUp from '../../../../assets/icons/flecha_up_blue.svg'

const useStyles = makeStyles((theme) => ({
  input: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(0, 69, 113, 0.5)'
      },
      '&:hover fieldset': {
        borderColor: 'rgba(0, 69, 113, 0.5)'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(0, 69, 113, 0.5)'
      }
    },
  },
  helperText: {
    marginTop: theme.spacing(1),
  },
  inputAdornment: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  img: {
    width:'20px',
    cursor:'pointer'
  }
}));

const UbiInput = (props) => {
  
  const classes = useStyles();

  const {
   value,
   setValue
  } = props;

  const handleIncrement = () => {
    setValue(prevValue => {
      const numericValue = prevValue === '' ? 0 : parseInt(prevValue, 10);
      //return numericValue + 1;
      return numericValue + 1 >= 0 ? numericValue + 1 : 0;
    });
  };
  
  const handleDecrement = () => {
    setValue(prevValue => {
      const numericValue = prevValue === '' ? 0 : parseInt(prevValue, 10);
      return numericValue - 1 >= 0 ? numericValue - 1 : 0;
    });
  };
  
  const handleChange = (event) => {
    const newValue = event.target.value;
    const numericRegex = /^-?\d*$/; // Regex para permitir solo números (incluye negativo para posibles casos de decremento)
    
    if (newValue === '' || numericRegex.test(newValue)) {
      setValue(newValue === '' ? '' : parseInt(newValue, 10));
    }
  };

  const handleBlur = () => {
    if (value === '') {
      setValue(0);
    }
  };
  
  return (
    <TextField
      fullWidth
      className={classes.input}
      type='number'
      variant='outlined'
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      InputProps={{
        // readOnly: true,
        endAdornment: (
          <InputAdornment position='end' className={classes.inputAdornment}>
            <img 
              style={{position:'relative',bottom:'15px'}} 
              className={classes.img} 
              onClick={handleIncrement} 
              src={ArrowUp} 
              alt='' 
            />
            <img 
              style={{position:'relative',bottom:'7px'}}  
              className={classes.img} 
              onClick={handleDecrement} 
              src={ArrowDown} 
              alt='' 
            />
          </InputAdornment>
        ),
      }}
      helperText={(value === null) ? 'El valor debe ser superior a 0' : ''}
      error={value === null}
    />
  );
  
};

export default UbiInput;
