import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import HomeIcon from '../../../../../assets/icons/ico_casa_playa_gris.svg'

import { setNewRequestSteps, resetNewRequestDossier } from '../../../../store/actions/RequestsActions'

import useStyles from './DossierData.styles'

const DossierData = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    selectedItem,
    setSelectedItem,
    setSelected
  } = props

  const getDossierTypeString = (code: string) => {
    let type = ''

    if (code === 'DOSTYP001') {
      type = t('provisions.editProvision.requestData.cupsSearch.table.col8.field1')
    } else if (code === 'DOSTYP002') {
      type = t('provisions.editProvision.requestData.cupsSearch.table.col8.field3')
    } else if (code === 'DOSTYP003') {
      type = t('provisions.editProvision.requestData.cupsSearch.table.col8.field2')
    }

    return type
  }

  const handleClickClose = () => {
    dispatch(setNewRequestSteps({
      step2: ''
    }))

    dispatch(resetNewRequestDossier())

    setSelectedItem({})

    setSelected(false)
  }

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.data} md={8} sm={12} xs={12}>
        <img className={classes.closeIcon} src={CloseIcon} alt='' onClick={handleClickClose} />

        <Grid container spacing={3} justifyContent='space-between'>
          <Grid item md={3} sm={12} xs={12}>
            {t('requests.newRequest.suppliesOrDossiersList.dossierData.description')}
          </Grid>

          <Grid item md={8} sm={12} xs={12}>
            <Grid container className={classes.section} spacing={4}>
              <Grid item>
                <div>{t('requests.newRequest.suppliesOrDossiersList.dossierData.requestNumber')}</div>

                <div><b>{selectedItem.dossierCod}</b></div>
              </Grid>

              <Grid item className={classes.requestType}>
                <div>{t('requests.newRequest.suppliesOrDossiersList.dossierData.requestType')}</div>

                <div><b>{getDossierTypeString(selectedItem.idDossierType)}</b></div>
              </Grid>
            </Grid>

            <Grid container className={`${classes.section} gray`} spacing={2}>
              <Grid item>
                <img src={HomeIcon} className={classes.supplyIcon} alt='' />
              </Grid>

              <Grid item className={classes.supplyName}>{selectedItem.name}</Grid>
            </Grid>

            <div className={`${classes.section} gray`}>
              <div>{t('requests.newRequest.suppliesOrDossiersList.dossierData.address')}</div>

              <div><b>{selectedItem.address}</b></div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DossierData
