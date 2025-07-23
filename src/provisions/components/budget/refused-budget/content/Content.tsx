import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { DialogContent } from '@material-ui/core'
import { DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../../common/components/spinner/Spinner'
import TextButton from '../../../../../common/components/text-button/TextButton'
import Button from '../../../../../common/components/button/Button'
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'


import useStyles from './Content.styles'

const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const provisions = useSelector((state: any) => state.provisions)

  const {
    setShowing,
    handleCloseDialog,
    setRefusedBudget,
    propPrev
  } = props

  const [ loading, setLoading ] = useState(false)

  const handleAcceptDialog = () => {
    setShowing(false)
    //setTimeout(() => {}, 100)
    setLoading(true)
    setRefusedBudget(true)
  }

  return (
    <>
      {
        loading &&
          <Spinner fixed />
      }

      <DialogContent className={classes.container}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={handleCloseDialog}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <div className={classes.modalText}>
          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1}>
            <Grid item>
              <img src={AlertIcon} alt='' />
            </Grid>

            <Grid item className={classes.title}>
              {propPrev ? t('provisions.provisionsDetails.dialog.title2') : t('provisions.provisionsDetails.dialog.title2Presup')}
            </Grid>

            {
              (
                provisions.currentProvision.dossierStatusId === 'STATUS0040' ||
                provisions.currentProvision.dossierStatusId === 'STATUS0072' ||
                provisions.currentProvision.dossierStatusId === 'STATUS0078' ||
                provisions.currentProvision.dossierStatusId === 'STATUS0099'
              ) ?
                <>
                  <Grid item className={classes.subTitle}>
                    {t('provisions.provisionsDetails.dialog.descriptions.text2')}
                  </Grid>

                  <Grid item className={classes.subTitle}>
                    {t('provisions.provisionsDetails.dialog.descriptions.text4')}
                  </Grid>
                </>
              :
                <Grid item className={classes.subTitle}>
                  {t('provisions.provisionsDetails.dialog.descriptions.text5')}
                </Grid>
            }
          </Grid>
        </div>

        <DialogActions>
          <Grid container direction='row' justifyContent='center' className={classes.buttons}>
            <Button
              className={classes.button}
              text={t('common.buttons.cancel')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleCloseDialog}
            />

            <Button
              className={classes.button}
              text={t('common.buttons.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleAcceptDialog}
            />
          </Grid>
        </DialogActions>
      </DialogContent>
    </>
  )
}

export default Content
