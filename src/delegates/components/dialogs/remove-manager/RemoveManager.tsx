import React from 'react'

import { DialogContent, DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import { useTranslation } from 'react-i18next'

import Dialog from '../../../../common/components/dialog/Dialog'
import TextButton from '../../../../common/components/text-button/TextButton'
import Button from '../../../../common/components/button/Button'
import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../../../assets/icons/cerrar.svg'

import useStyles from './RemoveManager.styles'

// LCS: Importar funciones - Wave 3
import { sendGAEvent } from '../../../../core/utils/gtm'

const RemoveManager = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  
  const { open, closeFunction, state, deleteFunction, managerInfo } = props

 // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventDeleteManager = ():any => {
    sendGAEvent({
      event: 'delete_manager',
      section_name: 'mis suministros',
      subsection_name: (managerInfo === 'US_MANAGER' ? 'mis gestores' : 'mis asesores'),
      click_text: 'dar de baja',
      element_type: 'conversion de accion',
      page_url:window.location.href,
      module_name: 'modificar datos del gestor',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  return (
    <Dialog open={open} onClose={closeFunction}>
      <DialogContent className={classes.modalContainer}>
      {
        state === 1 ?
        <>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={closeFunction}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <Grid className={classes.modalText}>
          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1}>
            <Grid item>
              <img src={AlertIcon} alt='' />
            </Grid>

            <Grid item className={classes.title}>
              {t('delegations.removeManager.title')}
            </Grid>

          </Grid>
        </Grid>

        <DialogActions>
          <Grid container direction='row' justifyContent='center' className={classes.buttons}>
            <Button
              className={classes.button}
              text={t('common.buttons.cancel')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={closeFunction}
            />
            
            <Button
              className={classes.button}
              text={t('delegations.removeManager.button')}
              color='primary'
              size='large'
              variant='contained'
              onClick={() => {sendGAEventDeleteManager(); deleteFunction()}}
            />
          </Grid>
        </DialogActions>
        </>
        :
        <>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={closeFunction}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <Grid className={classes.modalText}>
          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1}>
            <Grid item>
              <img src={AlertIcon} alt='' />
            </Grid>

            <Grid item className={classes.title}>
              {t('delegations.delegatedSupplies.title')}
            </Grid>

            <Grid item className={classes.subTitle}>
              {t('delegations.delegatedSupplies.subTitle')}
            </Grid>

          </Grid>
        </Grid>

        <DialogActions>
          <Grid container direction='row' justifyContent='center' className={classes.buttons}>
    
            <Button
              className={classes.button}
              text={t('common.buttons.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={closeFunction}
            />
          </Grid>
        </DialogActions>
        </>
        }
      </DialogContent>
    </Dialog>
  )
}

export default RemoveManager
