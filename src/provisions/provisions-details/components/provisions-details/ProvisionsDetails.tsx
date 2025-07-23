import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SwipeableViews from 'react-swipeable-views'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import ButtonToTop from '../../../../common/components/button-to-top/ButtonToTop'
import Spinner from '../../../../common/components/spinner/Spinner'
import ValidateForm from '../../../../common/components/validation/Form'
import Summary from '../summary/Summary'
import Navigation from '../navigation/Navigation'
import ActivitiesList from '../activities-list/ActivitiesList'
import Messaging from '../messaging/Messaging'
import Requests from '../requests/Requests'

import NewProvisionSteps from '../../../components/new-provision/steps/Steps'
import EditProvisionSteps from '../../../components/edit-provision/steps/Steps'
import NewGenerationSteps from '../../../components/new-generation/steps/Steps'

import {
  setSelectedSupplyType,
  setSupplySubtypes,
  setSelectedSupplySubtype,
  setNewGeneration
} from '../../../store/actions/ProvisionsActions'
import { thunkGetMasterData } from '../../../store/actions/ProvisionsThunkActions'
import { resetUrlMessages, setUrlMessagesCategory } from '../../../../common/components/send-url/store/actions/UrlMessagesActions'
import { adminCheck } from '../../../../common/lib/ValidationLib'

import {
  setRequestsListDossier
} from '../../../../requests/store/actions/RequestsActions'

import { SecurityHOC } from '../../../../common/HOC/SecurityHOC'

import useStyles from './ProvisionsDetails.styles'
import Bills from '../bills/Bills'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const ProvisionsDetails = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { location } = props

  const user = useSelector((state: any) => state.user)
  const provisions = useSelector((state: any) => state.provisions)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const typologies = [
    'DOSSUB016|' + t('provisions.newGeneration.type.typologies.hydraulics'),
    'DOSSUB017|' + t('provisions.newGeneration.type.typologies.photovoltaic'),
    'DOSSUB028|' + t('provisions.newGeneration.type.typologies.accumulation'),    
    'DOSSUB018|' + t('provisions.newGeneration.type.typologies.wind'),
    'DOSSUB019|' + t('provisions.newGeneration.type.typologies.solarThermal'),
    'DOSSUB020|' + t('provisions.newGeneration.type.typologies.congeneration'),
    'DOSSUB021|' + t('provisions.newGeneration.type.typologies.biomass'),
    'DOSSUB022|' + t('provisions.newGeneration.type.typologies.biogas'),
    'DOSSUB023|' + t('provisions.newGeneration.type.typologies.waste'),
    'DOSSUB024|' + t('provisions.newGeneration.type.typologies.other')
  ]

  const connections = [
    {
      key: 'UFD_NETWORK',
      value: t('provisions.newGeneration.type.connections.ufdNetwork')
    },
    {
      key: 'INTERNAL_CUSTOMER_NETWORK',
      value: t('provisions.newGeneration.type.connections.internalCustomerNetwork')
    }
  ]

  const [tabValue, setTabValue] = useState(0)
  const [masterDataResponse, setMasterDataResponse] = useState<any>()

  const [isLoading, setIsLoading] = useState(provisions.currentProvision && !provisions.currentProvision.dossierCod)
  const [loading, setLoading] = useState(false)

  const [propPrev, setPropPrev] = useState(true);

  const padlock = useSelector((state: any) => state.user.padlock)

  const [certificateON, setCertificateON] = useState('')

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'view',
      content_group: 'datos de la conexion a la red',
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
  }, [])

  useEffect(() => {    
    if (provisions.dossierType === 'DOSTYP002') {
      // generacion
      if (
        (
          provisions.newGeneration.typologies &&
          provisions.newGeneration.typologies.length === 0
        ) || (
          provisions.newGeneration.connections &&
          provisions.newGeneration.connections.length === 0
        )
      ) {
        dispatch(setNewGeneration({
          typologies,
          connections
        }))
      }
    }
    // eslint-disable-next-line
  }, [provisions.dossierType])

  useEffect(() => {
    let isBaremo = false

    if ((provisions && provisions.currentProvisionScaleInd != null) &&
      (currentProvision.idDossierTypeId != null)) {
      if ((provisions.currentProvisionScaleInd === '1') &&
        (currentProvision.idDossierTypeId === 'DOSTYP001')) {
        isBaremo = true
      }
    }
    let isBaremoAnticip = false
    let isRetranqueo = false

    if (currentProvision) {
      if (currentProvision.idDossierTypeId != null) {
        isRetranqueo = currentProvision.idDossierTypeId === 'DOSTYP003'
      }
      if (currentProvision.communicationList &&
        currentProvision.communicationList.length > 0) {

        let comTypBaremoAnt = 'COMTYP292'

        currentProvision.communicationList.map((item) => {

          if (item.communicationStatusCod && item.idCommunicationType) {
            const idCommunicationType = (item.idCommunicationType === comTypBaremoAnt)

            let idCommunicationTypeCods = [comTypBaremoAnt]

            if (idCommunicationType && idCommunicationTypeCods.includes(item.idCommunicationType)) {
              isBaremoAnticip = true
            }
          }

        })
      }
    }

    if (isBaremo || isBaremoAnticip || isRetranqueo) {
      setPropPrev(false)
    }
    // eslint-disable-next-line  
  }, [currentProvision])

  useEffect(() => {
    if (provisions.supplySubtypes.length === 0 && provisions.selectedSupplySubtype === '') {
      setIsLoading(true)

      dispatch(thunkGetMasterData('ID_DOSSIER_SUBTYPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'DOSSUB', (response) => {
        if (response) {
          setMasterDataResponse(response)
        }

        setIsLoading(false)
      }))
    }
    // eslint-disable-next-line
  }, [provisions.dossierSubtype])

  useEffect(() => {
    if (provisions && provisions.dossierSubtype && masterDataResponse) {
      let filteredType
      let filteredSubtype

      if (provisions.dossierType === 'DOSTYP002') {
        // generacion
        filteredType = 'DOSTYP002'

        filteredSubtype = typologies.filter(item => item.split('|')[0] === provisions.dossierSubtype)[0] && typologies.filter(item => item.split('|')[0] === provisions.dossierSubtype)[0].split('|')[1]
      } else if (provisions.dossierType === 'DOSTYP003') {
        filteredType = 'DOSTYP003'

        filteredSubtype = typologies.filter(item => item.split('|')[0] === provisions.dossierSubtype)[0] && typologies.filter(item => item.split('|')[0] === provisions.dossierSubtype)[0].split('|')[1]
      } else {
        filteredType = masterDataResponse.filter(item => item.value.split('|')[0] === provisions.dossierSubtype)[0] &&
          masterDataResponse.filter(item => item.value.split('|')[0] === provisions.dossierSubtype)[0].key &&
          masterDataResponse.filter(item => item.value.split('|')[0] === provisions.dossierSubtype)[0].key.split('_')[1]

        filteredSubtype = masterDataResponse.filter(item => item.value.split('|')[0] === provisions.dossierSubtype)[0] &&
          masterDataResponse.filter(item => item.value.split('|')[0] === provisions.dossierSubtype)[0].key
      }

      let auxMasterDataResponse = [] as any

      masterDataResponse.map((item, index) => {
        return auxMasterDataResponse.push(item.key + '|' + item.value)
      })

      dispatch(setSupplySubtypes(auxMasterDataResponse))
      dispatch(setSelectedSupplyType(filteredType))
      if (provisions.dossierType === 'DOSTYP002' || provisions.dossierType === 'DOSTYP003') {
        dispatch(setSelectedSupplySubtype(filteredSubtype))
      } else {
        dispatch(setSelectedSupplySubtype(auxMasterDataResponse && auxMasterDataResponse.length > 0 && auxMasterDataResponse.filter(item => item.split('|')[0] === provisions.dossierSubtype)[0].split('|')[0]))
      }
    }
    // eslint-disable-next-line
  }, [masterDataResponse])

  useEffect(() => {
    if (!isLoading && (!currentProvision.dossierCod || currentProvision.dossierCod === '')) {
      props.history.push('/provisions')
    }
    // eslint-disable-next-line
  }, [isLoading])

  useEffect(() => {
    dispatch(setRequestsListDossier([]))

    dispatch(thunkGetMasterData('CERTIFICATE', 'ES', 'ACTIVE', (response) => {
      if (response) {
        setCertificateON(response[0].value)
      } 
    }))
    // eslint-disable-next-line
  }, [])

  const getStepsTab = () => {
    let component = null

    if (currentProvision && currentProvision.idDossierTypeId && currentProvision.idDossierSubtype) {
      if (currentProvision.idDossierTypeId === 'DOSTYP001' || currentProvision.idDossierTypeId === 'DOSTYP003') {
        if (currentProvision.idDossierSubtype !== 'DOSSUB015') {
          component = <NewProvisionSteps viewsTabValue={tabValue}/>
        } else {
          component = <EditProvisionSteps viewsTabValue={tabValue}/>
        }
      } else if (currentProvision.idDossierTypeId === 'DOSTYP002') {
        component = <NewGenerationSteps viewsTabValue={tabValue}/>
      }
    }

    return component
  }


  const finPreType = () => {
    setStatusErrorCertificado('0')
  }
  const initialPage = () => {
    props.history.push('/provisions')
  }
  const previousPage = () => {
    props.history.push('/provisions')
  }
  const [statusErrorCertificado, setStatusErrorCertificado] = useState('0')

  // PPM 1007560 - Como Admin, cuando no estemos en la pestaña de "Mi conexión a la red", restablecemos los valores de urlMessages de redux
  useEffect(() => {
    if (adminCheck()) {
      if (tabValue !== 0) {
        dispatch(resetUrlMessages())
      }
      else if (tabValue === 0 && currentProvision) {
        dispatch(setUrlMessagesCategory('PROVISIONS'))
      }
    }
  }, [tabValue, currentProvision])

  return (
    <div className={classes.block}>
      {
        (isLoading || loading) &&
        <Spinner fixed={true} />
      }

      <Spinner id='spinner' visible={false} fixed={true} />

      {
        (!isLoading && currentProvision.dossierCod) &&
        <>
          <ButtonToTop />

          <>
            <Grid
              container
              justifyContent='center'
              className={classes.container}
            >
              {
                currentProvision.esFehaciente ==='1' && padlock !== '1' && certificateON === '1' ?
                  <ValidateForm
                    setStatusErrorCertificado={setStatusErrorCertificado}
                    previousPage={previousPage}
                    initialPage={initialPage}
                    finPreType={finPreType}
                  />
                :
                  statusErrorCertificado === '0' &&
                  <Grid container justifyContent='center'>
                    <Summary
                      selectedTab={location.state ? location.state.selectedTab : 0}
                      typologies={typologies}
                    />

                    <Navigation
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                      propPrev={propPrev}
                      currentProvision={currentProvision}
                    />

                    <Grid container item xs={11} md={12} className={(user && user.profile && user.profile.userId && user.profile.userId > 0) ? classes.viewsContainer : classes.notRegisteredViewsContainer}>
                      {/* El listado de actividades (ActivitiesList) se muestra sólo cuando el tipo de expediente no es baremo consumo, anticipado ni retranqueo */}
                      {
                          <SwipeableViews
                            index={tabValue}
                            className={classes.views}
                            onChangeIndex={setTabValue}
                          >
                            {/* Muestra la ventana cuando tabValue === 0 */}
                            {getStepsTab()}

                            {/* Muestra la ventana cuando tabValue === 1 */}
                            <ActivitiesList setLoading={setLoading} />

                            {/* Muestra la ventana cuando tabValue === 2 */}
                            <Messaging setLoading={setLoading} />

                            {/* Muestra la ventana cuando tabValue === 3 */}
                            <Bills location={location} dossierCod={currentProvision.dossierCod} provision={currentProvision}/>

                            {/* Muestra la ventana cuando tabValue === 4 */}
                            <Requests isLoading={loading} setIsLoading={setLoading} />
                          </SwipeableViews>
                      }
                    </Grid>
                  </Grid>
              }
              
            </Grid>
          </>
        </>
      }
    </div>
  )
}
export default SecurityHOC(ProvisionsDetails)
