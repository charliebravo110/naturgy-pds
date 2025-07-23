import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import Dialog from '../dialog/Dialog'
import Spinner from '../../../../common/components/spinner/Spinner'
import ButtonToTop from '../../../../common/components/button-to-top/ButtonToTop'
import Input from '../../../../common/components/input/Input'
import Button from '../../../../common/components/button/Button'
// import AddIcon from '../../../../assets/icons/mas.svg'

import { validateCupsNumber } from '../../../../common/lib/ValidationLib'
import { SecurityHOC } from '../../../../common/HOC/SecurityHOC'

import { setUserRole } from '../../../../common/store/actions/UserActions'
import { thunkPutSupply } from '../../store/actions/SuppliesVinculationThunkActions'

import useStyles from './SuppliesVinculation.styles'
import { useEasterEggPhotosPocPage } from '../../../../mobile-apps/photos/useEasterEggPhotosPocPage'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm';

const SuppliesVinculation = (props: any) => {
  const{ shouldTriggerEasterEgg, redirectToPhotosPocPage } = useEasterEggPhotosPocPage()

  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user.profile)
  const adminToken = useSelector((state: any) => state.admin.token)

  const [ cupsValue, setCupsValue ] = useState('')
  const [ cupsValidity, setCupsValidity ] = useState(false)

  const [ bindingSupply, setBindingSupply ] = useState(false)

  const [ showingDialog, setShowingDialog ] = useState(false)

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'mis suministros',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  const handleKeyDown = (e) => {
    if (cupsValidity && (e.key === 'Enter')) {
      handleBindSupply()
    }
  }

  const handleClickButton = () => {
    if (cupsValue !== '' && cupsValidity) {
      handleBindSupply()
    }
  }

  const handleBindSupply = () => {
    setBindingSupply(true)
    //Añadimos 1P al cups introducido

    let valorcups = cupsValue.substring(0,20)+ '1P'
    setCupsValue(valorcups)

    dispatch(thunkPutSupply(user.documentNumber, valorcups, '', setBindingSupply, (response) => {
      if (response && response.result.codResult === '0000') {
        sessionStorage.setItem('userRoles', sessionStorage.getItem('userRoles') + ',US_SUPPLYPOINT_CLIENT,US_DOSSIER_CLIENT')

        dispatch(setUserRole(user.roles + ',US_SUPPLYPOINT_CLIENT,US_DOSSIER_CLIENT'))

        props.history.push('/supplies')
      }
    }))
  }

  const handleOpenDialog = () => {
    setShowingDialog(true)
  }

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }

  if (adminToken) {
    return <Redirect to='/supplies' />
  }

  return(
    <>
      {
        bindingSupply &&
          <Spinner fixed={true} />
      }

      <Dialog
        showingDialog={showingDialog}
        closeDialog={handleCloseDialog}
      />

      <ButtonToTop />

      <Grid container justifyContent='center' alignItems='center' className={classes.container}>
        <Grid item xs={12} sm={12} md={12}>
          <div className={classes.headerTitle}>{t('supplies.suppliesVinculation.components.suppliesVinculation.mySupplies')}</div>
        </Grid>

        <Grid container justifyContent='center'>
          {
            /*
            <Grid
              container
              className={classes.newProvisionLink}
              item
              xs={11}
              sm={8}
              md={8}
            >
              <Grid item className={classes.newProvisionLinkIcon}>
                <img src={AddIcon} alt='' />
              </Grid>

              <Grid item className='marginLeft'>{t('supplies.suppliesVinculation.components.suppliesVinculation.newServiceProvision')}</Grid>
            </Grid>
            */
          }

          <Grid container item xs={11} sm={10} md={10} className={classes.formBlock}>
            <Grid container spacing={3} direction='column'>
              <Grid item>
                <Grid container spacing={2} direction='column' justifyContent='center' alignItems='center'>
                  <Grid item className={classes.subtitle}>{t('supplies.suppliesVinculation.components.suppliesVinculation.start')}</Grid>

                  <Grid item className={classes.text} xs={8} sm={7} md={6}>{t('supplies.suppliesVinculation.components.suppliesVinculation.introduceCups')}</Grid>
                </Grid>
              </Grid>

                <Grid container justifyContent='center' alignItems='center' item >
                  <Grid container item xs={12} sm={7} md={5} direction='column'>
                    <Typography className={classes.label}>{t('supplies.suppliesVinculation.components.suppliesVinculation.cupsNumber')} <span className={classes.link} onClick={handleOpenDialog}>{t('supplies.suppliesVinculation.components.suppliesVinculation.where')}</span></Typography>

                    <Input
                      placeholder='ES0000000000000000AA'
                      label=''
                      width='100'
                      error={cupsValue !== '' && !cupsValidity}
                      showValidationIcon
                      onChange={({ target }) => {
                        const value = target.value

                        setCupsValidity(validateCupsNumber(value))

                        setCupsValue(value)

                        if (shouldTriggerEasterEgg(target.value)) redirectToPhotosPocPage()
                      }}
                      onKeyDown={handleKeyDown}
                      value={cupsValue}
                    />

                    <Button
                      text={t('common.buttons.continue')}
                      color='primary'
                      size='large'
                      variant='contained'
                      className={classes.button}
                      onClick={handleClickButton}
                      disabled={!cupsValidity || adminToken}
                    />
                  </Grid>
                </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default SecurityHOC(SuppliesVinculation)
