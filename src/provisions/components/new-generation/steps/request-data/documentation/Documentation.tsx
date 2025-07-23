import React, { useState, useEffect } from 'react'
import { pdf } from '@react-pdf/renderer'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../../../common/components/spinner/Spinner'
import Button from '../../../../../../common/components/button/Button'
import Illustration from '../../../../../../assets/icons/ten_a_mano.svg'
import HtmlTooltip from '../../../../../../common/components/tooltip/tooltipHtml/HtmlTooltip';

import icon_dni from '../../../../../../assets/icons/ico_dni.svg';
import icon_aval from '../../../../../../assets/icons/ico_aval.svg';
import icon_cups from '../../../../../../assets/icons/ico_cups.svg';
import icon_anexo from '../../../../../../assets/icons/ico_anexo.svg';
import icon_plano from '../../../../../../assets/icons/ico_plano_situacion.svg';
import icon_esquema from '../../../../../../assets/icons/ico_esquema.svg';
import icon_memoria from '../../../../../../assets/icons/ico_memoria.svg';
import icon_punto from '../../../../../../assets/icons/ico_punto_propuesto.svg';
import icon_propietario from '../../../../../../assets/icons/ico_propietario.svg';
import icon_autorizacion from '../../../../../../assets/icons/ico_autorizacion.svg';
import icon_documentacion from '../../../../../../assets/icons/ico_documentacion.png';

import HoldersAgreementPDF from '../holders-agreement-pdf/HoldersAgreementPDF'

import { thunkGetMasterData } from '../../../../../store/actions/ProvisionsThunkActions'

import useStyles from './Documentation.styles';
import { isMobileApp, isWeb } from '../../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeAccents, removeEmails } from '../../../../../../core/utils/gtm'

const Documentation = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const provisions = useSelector((state: any) => state.provisions)
  const [maxUploadFileSize, setMaxUploadFileSize] = useState<number>(2000000)
  const [descriptionText, setDescriptionText] = useState<string>('')


  const {
    setActiveComponent,
    autoconsumo,
    generaCogen
  } = props

  const [ requiredDocumentationForGeneralProcedure, setRequiredDocumentationForGeneralProcedure ] = useState([] as any)
  const [ requiredDocumentationForAbreviatedProcedure, setRequiredDocumentationForAbreviatedProcedure ] = useState([] as any)
  const [ isLoadingDocumentation, setIsLoadingDocumentation ] = useState(true)

  const [ documentIsReady, setDocumentIsReady ] = useState(false)

  const getTypologyValue = () => {
    const item = provisions.newGeneration.typologies.find(item => item.split('|')[0] === provisions.dossierSubtype)

    return item && item.split('|')[1] &&  item.split('|')[1].toLowerCase()
  }

  const getConnectionValue = () => {
    const item = provisions.newGeneration.connections.find(item => item.key === provisions.newGeneration.selectedConnection)

    return item?.value ? item?.value : []
  }

  const handleClickReturn = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let request_type = sessionStorage.getItem('request_type')
    if (request_type === 'quiero una nueva conexion de generacion'){
      let auxTypology = getTypologyValue()
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'conexion punto de generacion',
        click_text: 'volver',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: request_type,
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        request_subtype: removeAccents(auxTypology)
      })
    }
    //setActiveComponent(1)
    if (autoconsumo) {
      setActiveComponent(1)
    } else {
      setActiveComponent(0)
    }
  }

  const handleClickContinue = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let request_type = sessionStorage.getItem('request_type')
    if (request_type === 'quiero una nueva conexion de generacion'){
      let auxTypology = getTypologyValue()
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'conexion punto de generacion',
        click_text: 'continuar',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: request_type,
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        request_subtype: removeAccents(auxTypology)
      })
    }
    setActiveComponent(3)
  }

  const getValueData = (index, item) => {
    if (item.value !== undefined && item.value.includes('#')) {
      const itemValue = item.value.split('#');
      if (itemValue[index] !== undefined) {
        return itemValue[index];
      } else {
        return '';
      }
    } else {
      if (index === 0) {
        return item.value;
      } else {
        return '';
      }
    }
  }

  const getIcon = (name) => {
    switch (name) {
      case 'icon_dni':
        return icon_dni;
      
      case 'icon_aval':
        return icon_aval;

      case 'icon_cups':
        return icon_cups;

      case 'icon_esquema':
        return icon_esquema;

      case 'icon_anexo':
        return icon_anexo;
      
      case 'icon_memoria':
        return icon_memoria;

      case 'icon_plano':
        return icon_plano;
        
      case 'icon_propietario':
        return icon_propietario;

      case 'icon_punto':
          return icon_punto;

      case 'icon_autorizacion':
        return icon_autorizacion;

      case 'icon_documentacion':
        return icon_documentacion;
      
      default:
        return icon_anexo;
    }
  }


  const downloadDocument = async () => {
    const blob = await pdf(
      <HoldersAgreementPDF
        // user={user}
        // actualDate={actualDate}
        // data={filteredActivitiesList}
        // currentProvision={currentProvision}
        // rowsPerPage={6}
      />
    ).toBlob()

    const pdfUrl = window.URL.createObjectURL(blob)    
    const fileName = 'Acuerdo entre titulares.pdf'
    if (isWeb()) {
      const tempLink = document.createElement('a')
      tempLink.href = pdfUrl
      tempLink.setAttribute('download', fileName)
      tempLink.click()
    } else {
      // downloadLink.click() will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      createFileAndOpenIt({ fileName, contentAsBlob: blob })
    }

    setDocumentIsReady(false)
  }

  useEffect(() => {
    dispatch(thunkGetMasterData('Documentacion_Generacion', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), null, (response) => {
      if (response) {
        const requiredDocsGeneral = response.filter(item => item.key === 'DOC_GEN_MAYOR10');
        const requiredDocsAbreviated = response.filter(item => item.key === 'DOC_GEN_MENOR10');

        if (requiredDocsGeneral.length > 0) {
          let auxDocsGeneral = [];
          requiredDocsGeneral.forEach(e => {
            
            if (e.value.includes(t('provisions.newGeneration.requestData.technicalData.signedDocApplicantOwner').trimEnd())){
              if (autoconsumo || generaCogen){
                auxDocsGeneral[getValueData(0, e)] = e;
              } else {
                //
              }
            } else {
              auxDocsGeneral[getValueData(0, e)] = e;
            }
            //auxDocsGeneral[getValueData(0, e)] = e;
          });

          setRequiredDocumentationForGeneralProcedure(auxDocsGeneral);
        }

        if (requiredDocsAbreviated.length > 0) {
          let auxDocsAbreviated = [];
          requiredDocsAbreviated.forEach(e => {
            if (e.value.includes(t('provisions.newGeneration.requestData.technicalData.signedDocApplicantOwner').trimEnd())){
              if (autoconsumo || generaCogen){
                auxDocsAbreviated[getValueData(0, e)] = e;
              } else {
                //
              }
            } else {
              auxDocsAbreviated[getValueData(0, e)] = e;
            }
            //auxDocsAbreviated[getValueData(0, e)] = e;
          });

          setRequiredDocumentationForAbreviatedProcedure(auxDocsAbreviated);
        }
      }

      setIsLoadingDocumentation(false)
    }))
    
    dispatch(thunkGetMasterData('DOCUMENT_SIZE', 'ES', '', (response) => {
      if (response) {
        setMaxUploadFileSize(parseInt(response[0].value))
      }
    }))
  // eslint-disable-next-line
  }, [])
  useEffect(() => {
    let description = t('provisions.newGeneration.documentation.description')
    let textinfo = description.replace('#', (maxUploadFileSize/1000000).toString())
    setDescriptionText(textinfo)
  }, [maxUploadFileSize])

  useEffect(() => {
    if (documentIsReady) {
      downloadDocument()
    }
  }, [ documentIsReady ])

  return (
    <Grid container className={classes.container}>
      {
        isLoadingDocumentation &&
          <Spinner fixed={true} />
      }

      <Grid item md={7} sm={11} xs={11} justifyContent='center'>
        <div className={classes.title}>{t('provisions.newGeneration.documentation.title')}</div>

        <div className={classes.description}>{descriptionText}</div>

        <Grid container item className={classes.innerContainer} md={12} sm={12} xs={12}>
          <Grid item md={4} sm={6} xs={12}>
            <img className={classes.img} src={Illustration} alt='' />
          </Grid>

          <Grid item md='auto' sm={6} xs={12}>
            <div className={classes.typologyAndNetwork}>
              {t('provisions.newGeneration.documentation.generation')} {getTypologyValue()} / {getConnectionValue()}
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className={classes.innerBox} spacing={2} md={10} sm={12} xs={12}>
        <Grid item md={6} sm={6} xs={12}>
          <div className={classes.innerItem}>
            <div className={classes.documentationFor}>{t('provisions.newGeneration.documentation.documentationFor')}</div>

            <div className={classes.procedure}>{t('provisions.newGeneration.documentation.generalProcedure')}</div>

            <div className={classes.documentationList}>
              {!isLoadingDocumentation &&
                (requiredDocumentationForGeneralProcedure && requiredDocumentationForGeneralProcedure.length > 0) &&
                  requiredDocumentationForGeneralProcedure.map(
                    (item, index) => (
                      <div key={index} className={classes.documentationItem}>
                        <img src={getIcon(getValueData(2, item))} alt='' />
                        {' '}
                        {(getValueData(3, item) !== '') ?
                          <HtmlTooltip title={t('provisions.newGeneration.documentation.tooltip.' + getValueData(3, item))} placement='top' interactive>
                            <u>{getValueData(1, item)}</u>
                          </HtmlTooltip>
                        :
                          <span>{getValueData(1, item)}</span>
                        }
                        {(getValueData(2, item) === 'icon_documentacion') &&
                          <a href='https://www.ufd.es/nueva-conexion-de-generacion/documentacion-necesaria/' target='_blank' rel='noopener'>
                            {' '}
                            {t('provisions.newGeneration.documentation.checkNecessaryDoc')}
                          </a>
                        }
                        {/* Sólo para el subtipo Acumulación (DOSSUB028) */}
                        {(getValueData(0, item) === '5' && provisions.dossierSubtype === 'DOSSUB028') &&
                          <div className={classes.accumulationNote}>
                            <span>{t('provisions.newGeneration.documentation.accumulationNote')}</span>
                          </div>
                        }
                        {(getValueData(0, item) === '6') &&
                          <span>
                            <br/>
                            {t('provisions.newGeneration.documentation.noteEIA')}
                            <br/>
                            {t('provisions.newGeneration.documentation.noteEIA1')}
                            <br/>
                            {t('provisions.newGeneration.documentation.noteEIA2')}
                          </span>
                        }
                      </div>
                    )
                  )
              }
            </div>
          </div>
        </Grid>

        <Grid item md={6} sm={6} xs={12}>
          <div className={classes.innerItem}>
            <div className={classes.documentationFor}>{t('provisions.newGeneration.documentation.documentationFor')}</div>

            <div className={classes.procedure}>
              {t('provisions.newGeneration.documentation.abreviatedProcedure')}
              <br/>
              {t('provisions.newGeneration.documentation.tensionLess15')}
            </div>

            <div className={classes.text}>{t('provisions.newGeneration.documentation.abreviatedProcedureText')}</div>

            <div className={classes.documentationList}>
              {
                !isLoadingDocumentation &&
                  (requiredDocumentationForAbreviatedProcedure && requiredDocumentationForAbreviatedProcedure.length > 0) &&
                    requiredDocumentationForAbreviatedProcedure.map(
                      (item, index) => (
                        <div key={index} className={classes.documentationItem}>
                          <img src={getIcon(getValueData(2, item))} alt='' />
                          {' '}
                        {(getValueData(3, item) !== '') ?
                          <HtmlTooltip title={t('provisions.newGeneration.documentation.tooltip.' + getValueData(3, item))} placement='top'>
                            <u>{getValueData(1, item)}</u>
                          </HtmlTooltip>
                        :
                          <span>{getValueData(1, item)}</span>
                        }
                        </div>
                      )
                    )
              }
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid item md={9} sm={9} xs={9} justifyContent='center'>
        <span>
          {t('provisions.newGeneration.documentation.checkDeadlinesInfo')}
          {' '}
          <a href={t('provisions.newGeneration.documentation.checkDeadlinesInfoUrl')} target='_blank'>
            {t('provisions.newGeneration.documentation.checkDeadlinesInfoUrl')}
          </a>
        </span>
      </Grid>

      <Grid container className={classes.buttons}>
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
  )
}

export default Documentation
