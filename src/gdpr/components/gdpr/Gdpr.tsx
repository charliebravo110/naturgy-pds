import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { push } from 'connected-react-router'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import { SecurityHOC } from '../../../common/HOC/SecurityHOC'
import Spinner from '../../../common/components/spinner/Spinner'
import Button from '../../../common/components/button/Button'
import Checkbox from '../../../common/components/checkbox/Checkbox'
import Dialog from '../../../sign-up/components/dialog/Dialog'

import CloseIcon from '../../../assets/icons/cerrar.svg'
import InfoIcon from '../../../assets/icons/info.svg'

import { checkDocumentType } from '../../../common/lib/ValidationLib'

import { resetToken, resetUserProfile, setUserGdprAccepted } from '../../../common/store/actions/UserActions'
import { resetAdminToken, resetAdminProfile } from '../../../admin/store/actions/AdminActions'
import { resetSupplies, resetDelegations } from '../../../supplies/store/actions/SuppliesActions'
import { resetProvisions } from '../../../provisions/store/actions/ProvisionsActions'
import { thunkGetCustomer, thunkCreateCustomer } from '../../../provisions/store/actions/ProvisionsThunkActions'
import { resetUrlMessages } from '../../../common/components/send-url/store/actions/UrlMessagesActions'

import { thunkUpdateUser } from '../../../common/store/actions/UserThunkActions'

import useStyles from './Gdpr.styles'

const Gdpr = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user.profile)

  const [ loading, setLoading ] = useState(false)

  const [ gdprAccepted, setGdprAccepted ] = useState(false)
  const [ showingDialog, setShowingDialog ] = useState(false)

  const handleClickLogout = () => {
    dispatch(resetToken())
    dispatch(resetUserProfile())
    dispatch(resetSupplies())
    dispatch(resetDelegations())
    dispatch(resetProvisions())
    dispatch(resetUrlMessages())

    dispatch(resetAdminToken())
    dispatch(resetAdminProfile())

    const lang = sessionStorage.getItem('lang') || 'es'

    sessionStorage.clear()

    sessionStorage.setItem('lang', lang)

    dispatch(push('/login'))
  }

  const handleShowDialog = (e) => {
    e.preventDefault()

    setShowingDialog(true)
  }

  const handleClickButton = () => {
    if (gdprAccepted) {
      setLoading(true)

      dispatch(setUserGdprAccepted(true))

      // actualizar usuario en UFD_LOGIN_USER
      dispatch(thunkUpdateUser(null, () => {
        // obtener el CUSTOMER (ZEUS) para el idRelationship
        dispatch(thunkGetCustomer(user.documentNumber, (response) => {
          if (response) {
            let customer = response.customers && response.customers.items && response.customers.items.length > 0 && response.customers.items[0]

            if (customer.idRelationship && user.documentNumber) {
              let data = {
                idRelationship: customer.idRelationship,
                docNumber: user.documentNumber,
                docType: checkDocumentType(user.documentNumber),
                customerName: customer.customerName || '',
                surname1: customer.surname1 || '',
                surname2: customer.surname2 || '',
                birthday: customer.birthday || '',
                state: customer.state || '',
                town: customer.town || '',
                zipcode: customer.zipcode || '',
                streetType: customer.streetType || '',
                streetName: customer.streetName || '',
                addNumber: customer.addNumber || '',
                telephone1: customer.telephone1 || '',
                telephone2: customer.telephone2 || '',
                email: customer.email || '',
                indLegalAccept: '1',
                webPhone: user.phone || '',
                webEmail: user.email || '',
                webStartDate: '',
                webEndDate: '',
                webClientId: user.userId || ''
              } as any

              // actualizar usuario en CUSTOMERS (ZEUS)
              dispatch(thunkCreateCustomer(data, (response) => {
                setLoading(false)

                sessionStorage.setItem('gdprAccepted', '1')

                dispatch(push('/login'))
              }))
            } else {
              setLoading(false)

              sessionStorage.setItem('gdprAccepted', '1')

              dispatch(push('/login'))
            }
          } else {
            setLoading(false)

            sessionStorage.setItem('gdprAccepted', '1')

            dispatch(push('/login'))
          }
        }))


      }, null))
    }
  }

  if (sessionStorage.getItem('gdprAccepted') === '1') {
    return <Redirect to='/' />
  }

  return (
    <div className={classes.block}>
      <Dialog
        showingDialog={showingDialog}
        closeDialog={() => setShowingDialog(false)}
      />

      {
        loading &&
          <Spinner fixed />
      }

      <Grid
        container
        className={classes.container}
      >
        <Grid
          container
          item
          className={classes.box}
          xs={12}
          sm={9}
          lg={6}
        >
          <img className={classes.closeIcon} src={CloseIcon} alt='' onClick={handleClickLogout} />

          <img className={classes.infoIcon} src={InfoIcon} alt='' />

          <Grid container justifyContent='center'>
            <Grid item className={classes.title}>{t('gdpr.title')}</Grid>

            <Grid item className={classes.privacyPolicy}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gdprAccepted}
                    onChange={(e) => setGdprAccepted(e.target.checked)}
                    value='checkedB'
                    color='primary'
                  />
                }
                label={
                  <div className={classes.privacyPolicyLabel}>
                    {t('signUp.privacyPolicy1')}

                    <span className={classes.privacyPolicyLink} onClick={handleShowDialog}>
                      {t('signUp.privacyPolicy2')}
                    </span>
                  </div>
                }
              />
            </Grid>

            <Grid item className={classes.button}>
              <Button
                text={t('common.buttons.continue')}
                color='primary'
                size='large'
                variant='contained'
                disabled={!gdprAccepted}
                onClick={handleClickButton}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default SecurityHOC(Gdpr)
