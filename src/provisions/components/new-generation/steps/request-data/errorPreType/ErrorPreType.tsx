import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import useStyles from './ErrorPreType.styles'

const ErrorPreType = (props: any) => {
  const {
    statusErrorCertificado
  } = props

  const classes = useStyles({})
  const { t } = useTranslation()

  const [litError, setLitError] = useState<string>('')

  const informarLiteralError = () => {
    let literal
    if (statusErrorCertificado === 1) {
      literal = t('PreType.PreTypeRepresentante.errorCert1')
    }
    if (statusErrorCertificado === 2) {
      literal = t('PreType.PreTypeRepresentante.errorCert2')
    }
    setLitError(literal)
  }

  useEffect(() => {
    informarLiteralError()
  }, [])

  return (

    <Grid container justifyContent='center'>

      <Grid container className={classes.gridError} md={8}>
        <Grid item className={classes.buttons2} md={1}>
          <Grid item className={classes.gridItemButtonS1}>
            <img src={AlertIcon} className={classes.lockIconError} alt='' />
          </Grid>
        </Grid>

        <Grid item className={classes.buttons2} md={11}>
          <Grid item className={classes.gridItemButtonS2}>
            {litError}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ErrorPreType
