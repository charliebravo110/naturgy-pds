import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'

import Grid from '@material-ui/core/Grid'
import Button from '../../../../../../common/components/button/Button'
import Spinner from '../../../../../../common/components/spinner/Spinner'

import Dialog from '../../../../../../supplies/supplies-vinculation/components/dialog/Dialog'

import Ilustracion from '../../../../../../assets/icons/ten_a_mano.svg'

import { resetCadastreData } from '../../../../../store/actions/ProvisionsActions'
import { thunkGetMasterData } from '../../../../../store/actions/ProvisionsThunkActions'

import useStyles from './Documentation.styles'
// LCS: Importa la función - Wave 3
import { sendGAEvent, removeAccents, removeEmails } from '../../../../../../core/utils/gtm'

const Documentation = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    activeComponent,
    setActiveComponent
  } = props

  const provisions = useSelector((state: any) => state.provisions)

  const [ cupsDialogIsVisible, setCupsDialogIsVisible ] = useState(false)
  const [ requiredDocumentationList, setRequiredDocumentationList ] = useState([] as any)
  const [ isLoadingDocumentation, setIsLoadingDocumentation ] = useState(true)

  const handleCloseCupsDialog = () => {
    setCupsDialogIsVisible(false)
  }

  const handleClickReturn = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let use_type = sessionStorage.getItem('use_type')
    let housing_type = sessionStorage.getItem('housing_type')
    if (use_type && use_type.length > 0 && housing_type && housing_type.length > 0){
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'alta nuevo punto de suministro',
        click_text: 'volver',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        use_type: removeAccents(use_type),
        housing_type: removeAccents(housing_type)
      })
    } else if (use_type && use_type.length > 0) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'alta nuevo punto de suministro',
        click_text: 'volver',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        use_type: removeAccents(use_type),
        housing_type: 'no aplica'
      })
    }
    setActiveComponent(activeComponent - 1)
  }

  const handleClickContinue = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let use_type = sessionStorage.getItem('use_type')
    let housing_type = sessionStorage.getItem('housing_type')
    if (use_type && use_type.length > 0 && housing_type && housing_type.length > 0){
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'alta nuevo punto de suministro',
        click_text: 'continuar',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        use_type: removeAccents(use_type),
        housing_type: removeAccents(housing_type)
      })
    } else if (use_type && use_type.length > 0) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'alta nuevo punto de suministro',
        click_text: 'continuar',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        use_type: removeAccents(use_type),
        housing_type: 'no aplica'
      })
    }
    dispatch(resetCadastreData())

    setActiveComponent(activeComponent + 1)
  }

  useEffect(() => {
    if (provisions.selectedSupplySubtype === '') {
      setIsLoadingDocumentation(false)
    } else {
      const key = provisions.selectedSupplySubtype ? (provisions.selectedSupplyType + '_' + provisions.selectedSupplySubtype) : provisions.selectedSupplyType

      dispatch(thunkGetMasterData('Documentacion', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), key, (response) => {
        if (response) {
          setRequiredDocumentationList(response)
        }

        setIsLoadingDocumentation(false)
      }))
    }
  // eslint-disable-next-line
  }, [])

  return (
    <>
      <Dialog
        showingDialog={cupsDialogIsVisible}
        closeDialog={handleCloseCupsDialog}
      />

      <Grid container className={classes.container} justifyContent='center'>

        <Grid item xs={11} sm={11} md={7} justifyContent='center'>
          <div className={classes.title}>{t('provisions.newProvision.requestData.documentation.title')}</div>
          <Grid justifyContent='center'>
            <Grid className={classes.text}>{t('provisions.newProvision.requestData.documentation.text')}</Grid>
          </Grid>
        </Grid>
          <Grid container>
            <Grid className={classes.containerDocumentation} container item md={10} sm={12} xs={12}>
              {
                isLoadingDocumentation &&
                  <Spinner />
              }

              <Grid item md={6} sm={6} xs={12}>
                <img className={classes.img} src={Ilustracion} alt='' />
              </Grid>
              
              <Grid item md={6} sm={6} xs={12}>
                <Typography className={classes.textBlueBold}>{t('provisions.newProvision.requestData.documentation.documentation')}</Typography>

                <Typography className={classes.textOrange}>
                  {
                    provisions.selectedSupplySubtype === '' ?
                      ((provisions.supplyTypes && provisions.supplyTypes.length > 0) && provisions.supplyTypes.filter(item => item.split('|')[0] === provisions.selectedSupplyType)[0].split('|')[1])
                    :
                      ((provisions.supplySubtypes && provisions.supplySubtypes.length > 0) && provisions.supplySubtypes.filter(item => item.split('|')[0] === provisions.selectedSupplySubtype)[0].split('|')[1])
                  }
                </Typography>

                <Typography className={classes.messageInfoExpedientSupply}>
                  <span>
                    {t('provisions.newProvision.requestData.documentation.textExpedientSupply')}
                    <a className={classes.linkDocumentation} href={t('provisions.newProvision.requestData.documentation.textExpedientSupplyUrl')} target='_blank'>
                      {t('provisions.newProvision.requestData.documentation.textExpedientSupplyUrlText')}
                    </a>
                    {t('provisions.newProvision.requestData.documentation.textExpedientSupplyFinish')}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid container className={classes.button}>
            <Button
              text={t('common.buttons.return')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleClickReturn}
            />

            <Button
              text={t('common.buttons.continue')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleClickContinue}
            />

        </Grid>
      </Grid>
    </>
  )
}
export default Documentation
