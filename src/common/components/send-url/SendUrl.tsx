import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Cadena from '../../../assets/icons/cadena.svg'

import useStyles from './SendUrl.styles'
import DialogSendUrl from '../dialog-Send-Url/dialogSendUrl'

const SendUrl = (props: any) => {
  const { t } = useTranslation()
  const mobileRes = useMediaQuery('(max-width:576px)')
  const [showingDialog, setShowingDialog] = useState(false)

  const openPopup = () => {
    setShowingDialog(true)
  }

  const classes = useStyles({})

  return (
    <>
      <Grid container direction='column' className={classes.generalCont} onClick={() => {openPopup()}}>
        <Grid item className={classes.iconCont}>
          <img className={classes.icon} src={Cadena} alt='' />
        </Grid>
        {!mobileRes &&
          <Grid item>
            <div>{t('sendUrl.send')}</div>
            <div>{t('sendUrl.url')}</div>
          </Grid>
        }       
      </Grid>

      {showingDialog &&
        <DialogSendUrl 
          showingDialog={showingDialog}
          setShowingDialog={setShowingDialog}
        />
      }
    </>    
  )
}

export default withRouter(SendUrl)
