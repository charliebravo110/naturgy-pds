import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import TextButton from '../text-button/TextButton'
import SaveIcon from '../../../assets/icons/guardar.svg'

import useStyles from './SaveLabel.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../../core/utils/gtm'

const EditLabel = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventSaveChanges = ():void => {
    if (window.location.href.includes('/managers/') || window.location.href.includes('/consultants/')) {
      sendGAEvent({
        event: 'add_manager',
        section_name: 'mis suministros',
        subsection_name: (props.delegateOption === 'managers' ? 'mis gestores' : 'mis asesores'),
        click_text: 'guardar cambios',
        element_type: 'consulta de informacion',
        page_url:window.location.href,
        module_name: 'modificar datos del gestor',
        browsing_type: sessionStorage.getItem('browsing_type'),
      })
    }
  }

  return (
    <Grid
      container
      direction='row'
      justifyContent='space-between'
      item
      xs={12} 
      sm={12} 
      md={12}
      className={classes.saveLabel}
    >
      <Grid item>
        {props.label}
      </Grid>

      <TextButton
        onClick={() => { sendGAEventSaveChanges(); props.onClick()}}
        className={classes.textButton}
        disabled={props.disabled}
      >
        <img src={SaveIcon} className={classes.saveIcon} alt='' />

        <Typography className={classes.editText}>{t('profile.saveLabel.saveChanges')}</Typography>
      </TextButton>
    </Grid>
  )
}

export default EditLabel
