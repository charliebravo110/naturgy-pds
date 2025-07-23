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
// LCS: Enviar evento de GdC a GA - Wave 3

// LCS: Importa la función - Wave 3
import { getTypologySelfConsumption, sendGAEvent, removeEmails } from '../../../../../../core/utils/gtm'

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

  const typologies = [
    {
      key: 'DOSSUB025',
      value: t('provisions.editInstallations.type.typologies.setback')
    },
    {
      key: 'DOSSUB026',
      value: t('provisions.editInstallations.type.typologies.detour')
    },
    {
      key: 'DOSSUB027',
      value: t('provisions.editInstallations.type.typologies.telecomunication')
    }
  ]

  const handleCloseCupsDialog = () => {
    setCupsDialogIsVisible(false)
  }

  const handleClickReturn = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: 'modificacion de instalaciones',
      click_text: 'volver',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: sessionStorage.getItem('request_type'),
      request_step_name: 'datos de la solicitud',
      browsing_type: sessionStorage.getItem('browsing_type'),
      request_subtype: auxTypology
    })
    setActiveComponent(activeComponent - 1)
  }

  const handleClickContinue = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: 'modificacion de instalaciones',
      click_text: 'continuar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: sessionStorage.getItem('request_type'),
      request_step_name: 'datos de la solicitud',
      browsing_type: sessionStorage.getItem('browsing_type'),
      request_subtype: auxTypology
    })
    dispatch(resetCadastreData())

    setActiveComponent(activeComponent + 1)
  }

  useEffect(() => {
    setIsLoadingDocumentation(true)

    dispatch(thunkGetMasterData('Documentacion_Instalacion', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), provisions.dossierSubtype, (response) => {
      if (response) {
        setRequiredDocumentationList(response)
      }
      setIsLoadingDocumentation(false)
    }))
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
          <div className={classes.title}>{t('provisions.editInstallations.documentation.title')}</div>
          <Grid justifyContent='center'>
            <Grid className={classes.text}>{t('provisions.editInstallations.documentation.text')}</Grid>
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
                  {typologies && provisions && provisions.dossierSubtype && typologies.filter(item => item.key === provisions.dossierSubtype)[0].value}
                </Typography>

                {
                  !isLoadingDocumentation && (
                    (requiredDocumentationList && requiredDocumentationList.length > 0) ?
                      requiredDocumentationList.map(
                        (item, index) => (
                          <Typography key={index} className={classes.textBlue}>
                            <span>·</span> {item.value}
                          </Typography>
                        )
                      )
                    :
                      <Typography className={classes.textBlue}>
                        {t('provisions.editInstallations.documentation.default')}
                      </Typography>
                  )
                }
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
