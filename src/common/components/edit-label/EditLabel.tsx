import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import TextButton from '../text-button/TextButton'
import EditIcon from '../../../assets/icons/editar.svg'

import useStyles from './EditLabel.styles'

const EditLabel = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <Grid
      container
      item
      direction='row'
      justifyContent='space-between'
      xs={12}
      sm={12}
      md={props.large ? 9 : 6}
      lg={props.large ? 8 : 5}
      className={`${classes.editLabel} ${props.disabled && 'disabled'}`}
    >
      <Grid item>{props.label}</Grid>

      <Grid item>
        <TextButton onClick={props.onClick} className={classes.textButton}>
          <img src={EditIcon} className={classes.editIcon} alt='' />

          <Typography className={classes.editText}>{t('profile.editLabel.edit')}</Typography>
        </TextButton>
      </Grid>
    </Grid>
  )
}

export default EditLabel
