import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import HomeIcon from '../../../../../assets/icons/ico_casa_playa_gris.svg'

import { setNewRequestSteps, resetNewRequestSupply } from '../../../../store/actions/RequestsActions'

import useStyles from './SupplyData.styles'

const SupplyData = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    selectedItem,
    setSelectedItem,
    setCurrentCups,
    setSelected
  } = props

  const handleClickClose = () => {
    dispatch(setNewRequestSteps({
      step2: '',
      step3: ''
    }))

    dispatch(resetNewRequestSupply())

    setSelectedItem({})

    setCurrentCups('')

    setSelected(false)
  }

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.data} md={8} sm={12} xs={12}>
        <img className={classes.closeIcon} src={CloseIcon} alt='' onClick={handleClickClose} />

        <Grid container spacing={3} justifyContent='space-between'>
          <Grid item md={3} sm={12} xs={12}>
            {t('requests.newRequest.suppliesOrDossiersList.supplyData.description')}
          </Grid>

          <Grid item md={8} sm={12} xs={12}>
            <div className={classes.section}>
              <div>CUPS:</div>

              <div><b>{selectedItem.cups}</b></div>
            </div>

            <Grid container className={`${classes.section} gray`} spacing={2}>
              <Grid item>
                <img src={HomeIcon} className={classes.supplyIcon} alt='' />
              </Grid>

              <Grid item className={classes.supplyName}>{selectedItem.name}</Grid>
            </Grid>

            <div className={`${classes.section} gray`}>
              <div>{t('requests.newRequest.suppliesOrDossiersList.supplyData.address')}</div>

              <div><b>{selectedItem.address}</b></div>
            </div>

            <div className={`${classes.section} gray`}>
              <div>{t('requests.newRequest.suppliesOrDossiersList.supplyData.type')}</div>

              <div><b>{selectedItem.isGenerator === '1' ? t('supplies.suppliesDetails.components.summary.generator') : t('supplies.suppliesDetails.components.summary.consumptiom')}</b></div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SupplyData
