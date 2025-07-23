import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'

import CloseIcon from '../../../assets/icons/cerrar.svg'

import Dialog from '../../../common/components/dialog/Dialog'
import TextButton from '../../../common/components/text-button/TextButton'

import Content from './content/Content'
import ContentNewGeneration from './content-new-generation/ContentNewGeneration'

import useStyles from './LegalDeadlinesDialog.styles'

const LegalDeadlinesDialog = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { popup, setPopup, showConsumption } = props

  return (
    <Dialog open={popup} onClose={() => setPopup(false)}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={() => setPopup(false)}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>
        <Grid className={classes.modalText}>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid item className={classes.title}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.title')}
            </Grid>
          </Grid>
          {showConsumption ?          
            //Consumos
            <Content />
          :
            //Generación && Autoconsumos
            <ContentNewGeneration />
          }
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default LegalDeadlinesDialog
