import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './Dropdown.styles'
import Item from './Item'

import WhiteArrowDownIcon from '../../../assets/icons/flecha_down_blanco.svg'
import WhiteArrowUpIcon from '../../../assets/icons/flecha_up_blanco.svg'

const Dropdown = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const [isBoxOpen, setIsBoxOpen] = useState(false)
  // const [elementSelected, setElementSelected] = useState(null)

  const {
    title,
    menuData,
    selectedItemHandler
  } = props

  const handleOpenBox = () => {
    setIsBoxOpen(!isBoxOpen)
  }

  const selectedItemHandlerInternal = (element) => {
    setIsBoxOpen(!isBoxOpen)
    selectedItemHandler(element)
  }

  return (
    <Grid item className={classes.container}>
      <Grid container justifyContent='space-between' className={classes.button} onClick={handleOpenBox}>
        <Grid item>{title}</Grid>

        <Grid item className={classes.arrowIcon}>
          {
            isBoxOpen ?
              <img src={WhiteArrowUpIcon} alt='' />
              :
              <img src={WhiteArrowDownIcon} alt='' />
          }
        </Grid>
      </Grid>

      {
        isBoxOpen &&

          // eslint-disable-next-line
          <div className={classes.box}>
            {
              // eslint-disable-next-line  
              menuData.map((item,i) => 
                <Item
                  key={i} 
                  element={item} 
                  selectedItemHandler={selectedItemHandlerInternal}
                />
              )
            }
          </div>
      }
    </Grid>
  )
}

export default Dropdown
