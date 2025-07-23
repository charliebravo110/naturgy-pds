import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import NoItemsIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import InfoIcon from '../../../../assets/icons/info.svg'

import useStyles from './NoItemsAlert.styles'
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const NoItemsAlert = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const error = useSelector((state: any) => state.error)

  const [ isError ] = useState(error.code)

  const {
    searchingItems,
    defaultMessage,
    searchMessage,
  } = props

  // LCS: Carga de componente - Wave GdC
  useEffect(() => {
    sendGAEvent({
      event: 'component_loaded',
      info: {
        reactComponent: 'NoItemsAlert.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  return (
    <Grid container className={classes.noItems}>
      <Grid item>
        <img src={NoItemsIcon} alt='' />

        {
          isError || props.isErrorBol ?
            isError === 'TS01000004' || props.isErrorBol ?
              // Pantalla a mostrar cuando el usuario no tiene suministros asociados
              <Grid container className={classes.errorContainer}>
                <Grid item className={classes.infoIconCont}>
                  <img className={classes.infoIcon} src={InfoIcon} alt='' />
                </Grid>              
                <Grid item className={classes.text3}>
                  {t('delegations.suppliesList.noSupplies')}
                </Grid>
              </Grid>
            :
              // Pantalla a mostrar debido a otro tipo de error al hacer la consulta de suministros
              <Grid className={classes.text2}>{t('delegations.suppliesList.someError')}</Grid>
          :
            <Grid className={classes.text}>
              {
                searchingItems ?
                  <span>{searchMessage}</span>
                :
                  <span>{defaultMessage}</span>
              }
            </Grid>
        }
      </Grid>
    </Grid>
  )
}

export default NoItemsAlert
