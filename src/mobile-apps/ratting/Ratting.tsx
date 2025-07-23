import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { DialogRattingProps } from './interfaces'
import { Dialog, DialogActions, DialogContent } from '@material-ui/core'
import Button from '../../common/components/button/Button'

import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import useStyles from './DialogRatting.styles'
import Grid from '@material-ui/core/Grid'
import ico_tick_validar from '../../assets/icons/Interfaz_22_check_tick_validar_completo.svg'
import {
  APPLE_APP_STORE_LINK,
  GOOGLE_PLAY_STORE_LINK,
  RATTING_DAYS_TO_SHOW,
  RATTING_EMAIL_DEST_LIST,
  RATTING_EMAIL_SERVICE_ID,
  RATTING_EMAIL_TEMPLATE_ID,
  RATTING_EMAIL_USER_ID,
} from '../common/configAndConstants'
import { isIos, isWeb } from '../common/detectPlatform'
import Input from '../../common/components/input/Input'
import { useSelector } from 'react-redux'

const Ratting = () => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [step, setStep] = useState<'initial' | 'ratting_form' | 'thanks' | 'done'>('initial')
  const [selectedStar, setSelectedStar] = React.useState(0)
  const [dialogRattingProps, setDialogProps] = useState<DialogRattingProps>({
    isOpen: false,
  })
  const [dialogFormProps, setDialogFormProps] = useState<DialogRattingProps>({
    isOpen: false,
  })
  const [inputValue, setInputValue] = useState('')
  const user = useSelector((state: any) => state.user.profile)
  const admin = useSelector((state: any) => state.admin.profile)
  const [delay] = useState(20000) // 20 seconds after app is loaded. Will be shown in any page


  // Show dialog when RATTING_DAYS_TO_SHOW days passed since firstAccess or last shown
  useEffect(() => {
    if (isWeb()) return

    const dateLastRattingDialogShown = localStorage.getItem('dateLastRattingDialogShown')
    const today = new Date()
    const todayTimestamp = today.getTime()
    const firstAccessTimestamp = new Date(dateLastRattingDialogShown).getTime()

    const daysPassed = Math.floor((todayTimestamp - firstAccessTimestamp) / (1000 * 60 * 60 * 24))

    if (daysPassed >= RATTING_DAYS_TO_SHOW && !localStorage.getItem('hasRated')) {
      if (dialogRattingProps.isOpen || dialogFormProps.isOpen) return
      // Show dialog after timeout, to avoid showing it immediately
      setTimeout(() => {
        // Save date last ratting dialog shown
        localStorage.setItem('dateLastRattingDialogShown', new Date().toString())
        setSelectedStar(0)
        setStep('initial')
        setDialogProps({
          isOpen: true,
          title: t('mobile-apps.ratting-dialog.title'),
        } as DialogRattingProps)
      }, delay)

    }
  }, [])


  const finalizeRatting = () => {
    // Save in localstorage
    localStorage.setItem('hasRated', 'true')
    // Close dialog
    setDialogProps({
      isOpen: false,
    })
    setDialogFormProps({
      isOpen: false,
    })
  }

  const handleInputChange = ({ target }) => {
    setInputValue(target.value)
  }

  /**
   * Change final step to 'thanks' and send form email.
   */
  const handleSendForm = () => {
    setStep('thanks')

    if (selectedStar > 4) {
      redirectToStore()
      return
    }

    const from_name = admin.name ? admin.name : user.name ? `${user.name} ${user.surName}` : user.surName

    // Send form
    const templateParams = {
      to_name: 'Reviewer',
      to_email: RATTING_EMAIL_DEST_LIST.join(', '),
      from_name,
      from_message: inputValue,
      from_selected_stars: selectedStar,
    }
  }

  /**
   * When user click on star, set selected star and increase step.
   * If user select 4 or 5 stars, redirect to store and finalize ratting
   * @param star
   */
  const clickStar = (star: any) => {
    setSelectedStar(star)
    if (step === 'ratting_form') return
    setTimeout(() => {
      if (star > 4) {
        setStep('thanks')
        finalizeRatting()
        redirectToStore()
        return
      }
      // Show ratting form
      setStep('ratting_form')
      setDialogFormProps({
        isOpen: true,
      } as DialogRattingProps)
      setDialogProps({
        isOpen: false,
      })
    }, 200)
  }

  /**
   * Close dialog process and reset timer
   */
  const closeRattingDialog = () => {
    if (step === 'thanks') {
      finalizeRatting()
    }
    // Ensure dialogs are closed
    setDialogProps({
      isOpen: false,
    } as DialogRattingProps)
    setDialogFormProps({
      isOpen: false,
    } as DialogRattingProps)
  }

  const redirectToStore = () => {
    window.open(isIos() ? APPLE_APP_STORE_LINK : GOOGLE_PLAY_STORE_LINK, '_blank')
  }

  // Null if web
  if (isWeb()) return null

  // Render first step
  if (step === 'initial') {
    return (
      <Dialog className={classes.dialog} open={dialogRattingProps.isOpen}>
        <DialogContent>
          <h2>{dialogRattingProps.title}</h2>
          <IconButton onClick={closeRattingDialog} className={'closeButton'}>
            <CloseIcon />
          </IconButton>
          {/* Display starts to be set*/}
          <div className={classes.stars}>
            <div
              className={`${classes.star} ${selectedStar >= 1 ? 'filled' : ''}`}
              onClick={() => clickStar(1)}
              role={'button'}
            />
            <div
              className={`${classes.star} ${selectedStar >= 2 ? 'filled' : ''}`}
              onClick={() => clickStar(2)}
              role={'button'}
            />
            <div
              className={`${classes.star} ${selectedStar >= 3 ? 'filled' : ''}`}
              onClick={() => clickStar(3)}
              role={'button'}
            />
            <div
              className={`${classes.star} ${selectedStar >= 4 ? 'filled' : ''}`}
              onClick={() => clickStar(4)}
              role={'button'}
            />
            <div
              className={`${classes.star} ${selectedStar >= 5 ? 'filled' : ''}`}
              onClick={() => clickStar(5)}
              role={'button'}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }


  // Render second and third step
  return (
    <Dialog className={`${classes.dialog} fullscreen`} open={dialogFormProps.isOpen}>
      <DialogContent>
        <IconButton onClick={closeRattingDialog} className={'closeButton'}>
          <CloseIcon />
        </IconButton>
        {
          step === 'ratting_form' &&
          <form name='login_form' className={classes['h-100']}>

            <Grid
              container
              direction='column'
              justifyContent='space-between'
              alignItems='center'
              className={classes['h-100']}
            >
              <div>
                <div className={classes.stars}>
                  <div
                    className={`${classes.star} ${selectedStar >= 1 ? 'filled' : ''}`}
                    onClick={() => clickStar(1)}
                    role={'img'}
                  />
                  <div
                    className={`${classes.star} ${selectedStar >= 2 ? 'filled' : ''}`}
                    onClick={() => clickStar(2)}
                    role={'img'}
                  />
                  <div
                    className={`${classes.star} ${selectedStar >= 3 ? 'filled' : ''}`}
                    onClick={() => clickStar(3)}
                    role={'img'}
                  />
                  <div
                    className={`${classes.star} ${selectedStar >= 4 ? 'filled' : ''}`}
                    onClick={() => clickStar(4)}
                    role={'img'}
                  />
                  <div
                    className={`${classes.star} ${selectedStar >= 5 ? 'filled' : ''}`}
                    onClick={() => clickStar(5)}
                    role={'img'}
                  />
                </div>
                <h2><Trans i18nKey='mobile-apps.ratting-dialog.more-details' values={{ number: selectedStar }} /></h2>
                <Input
                  name='ratting-description'
                  className={classes.textField}
                  onChange={handleInputChange}
                  value={inputValue}
                />
              </div>
              <DialogActions>
                <Button
                  name='submit'
                  text={t('mobile-apps.ratting-dialog.buttons.send')}
                  color={'primary'}
                  size={'large'}
                  variant={'contained'}
                  onClick={handleSendForm}
                  disabled={inputValue === ''}
                />
              </DialogActions>
            </Grid>
          </form>
        }
        {
          step === 'thanks' &&
          <Grid container direction='column' justifyContent='center' alignItems='center' className={classes['h-100']}>
            <img src={ico_tick_validar} alt='Icon success' />
            <p>{t('mobile-apps.ratting-dialog.thanks')}</p>
            <DialogActions>
              <Button
                text={t('mobile-apps.ratting-dialog.buttons.close')}
                color={'primary'}
                size={'large'}
                variant={'contained'}
                onClick={closeRattingDialog}
              />
            </DialogActions>
          </Grid>}
      </DialogContent>
    </Dialog>
  )
}
export default Ratting
