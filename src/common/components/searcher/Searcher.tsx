import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'

import Input from '../input/Input'
import MagnifyingGlassIcon from '../../../assets/icons/lupa_buscador_blanca.svg'

import useStyles from './Searcher.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm';

const Searcher = (props: any) => {
  const classes = useStyles({})

  const {
    label,
    handleChangeSearch,
    searchWhenClick,
    setSearchValue,
    readyToSearch
  } = props

  const [ inputValue, setInputValue ] = useState('')
  const [ lastInputValue, setLastInputValue ] = useState('')

  const handleInput = (value) => {
    setSearchValue && setSearchValue(value)

    if (!searchWhenClick) {
      handleChangeSearch(value)
      // LCS: Enviar evento de GdC a GA - Wave 3
      if (window.location.pathname === '/supplies') {
        sendGAEvent({
          event: 'search',
          section_name: 'mis suministros',
          search_term: value,
          element_type: 'consulta de informacion',
          page_url: removeEmails(window.location.href),
          tab_name: 'delegados en gestor o asesor',
          browsing_type: sessionStorage.getItem('browsing_type')
        });
      }
    }

    setInputValue(value)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleClick()
    }
  }

  const handleClick = () => {    
    if (searchWhenClick && (inputValue !== lastInputValue || inputValue === '')) {
      setLastInputValue(inputValue)

      handleChangeSearch(inputValue)
    }
  }

  const {handleChangeSearch:handleChangeSearch1,handleSearch,fromSupplies, ...restProps}=props;

  return (
    <Grid item className={classes.container}>
      <Input
        className={classes.input}
        label={label}
        onChange={(e) => handleInput(e.target.value)}
        onKeyPress={handleKeyPress}
        {...restProps}
      />

      <span className={`${classes.button} ${readyToSearch ? 'filled' : ''}`} onClick={handleClick}>
        <img
          src={MagnifyingGlassIcon}
          alt=''
        />
      </span>
    </Grid>
  )
}

export default Searcher
