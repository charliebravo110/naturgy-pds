
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import ButtonToTop from '../../../../common/components/button-to-top/ButtonToTop'

import Box from './box/Box'
import Actions from '../actions/Actions'
import Spinner from '../../../../common/components/spinner/Spinner'
import { SecurityHOC } from '../../../../common/HOC/SecurityHOC'
import DelegationProfile from '../../delegates-in-managers/components/delegation-dialog/delegation-profile/DelegationProfile'
import RemoveDelegation from '../../delegates-in-managers/components/remove-delegation/RemoveDelegation'
//FSP-INI 
import BajaDelegation from '../../delegates-in-me/components/baja-delegation/BajaDelegation'
//FSP-FIN

import {
  setManagedByMeDelegations
} from '../../../store/actions/SuppliesActions'

import {
  thunkListSupplies,
  thunkGetDelegations
} from '../../store/actions/SuppliesListThunkActions'

import {
  resetUrlMessages,
  setUrlMessagesCategory, 
  setUrlMessagesDetail 
} from '../../../../common/components/send-url/store/actions/UrlMessagesActions'
import { adminCheck } from '../../../../common/lib/ValidationLib'

import useStyles from './SuppliesList.styles'
import { ThunkGetUserData } from '../../../../common/store/actions/UserThunkActions'
import { setDestinatario, setFranjaHorarioFin, setFranjaHorarioFinEspecial, setFranjaHorarioInicio, setFranjaHorarioInicioEspecial, setTipoCanal } from '../../../../common/store/actions/UserActions'
import { thunkGetMasterData } from '../../../supplies-details/store/actions/SuppliesDetailsThunkActions'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const SuppliesList = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  let roles = sessionStorage.getItem('userRoles') || ''
  let rolesArray = roles.split(',')

  const origin = props.location.state && props.location.state.origin

  const user = useSelector((state: any) => state.user)
  const supplies = useSelector((state: any) => state.supplies)
  const delegations = useSelector((state: any) => state.delegations)

  const adminToken = useSelector((state: any) => state.admin.token)

  const [ selectedTab, setSelectedTab ] = useState(0)

  const [ suppliesList, setSuppliesList ] = useState([] as any)

  const [ isLoading, setIsLoading ] = useState(false)
  const [ loadingSuppliesList, setLoadingSuppliesList ] = useState(supplies.list.length === 0)
  const [ loadingDelegationsList, setLoadingDelegationsList ] = useState(delegations.managedByMeList.length === 0)
  const [ loadingUserAlertData, setLoadingUserAlertData ] = useState(false);

  const [ delegationProfile, setDelegationProfile ] = useState(false)
  const [ delegationProfileStatus, setDelegationProfileStatus ] = useState(2)
  const [ removeDelegation, setRemoveDelegation ] = useState(false)

  const [ bajaDelegation, setBajaDelegation ] = useState(false)

  const [contractsEnabled, setContractsEnabled] = useState(false)

  // LCS: Carga de componente - Wave GdC
  useEffect(() => {
    sendGAEvent({
      event: 'component_loaded',
      info: {
        reactComponent: 'SuppliesList.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 2
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
  }, [])
  
  useEffect(() => {
    dispatch(thunkGetMasterData('CONTRACT', 'ES', 'SCREENS_ACTIVE', (r) => {
      if (r[0].value === '1') {
        setContractsEnabled(true)
      } else if (r[0].value === '0') {
        setContractsEnabled(false)
      } else {
        setContractsEnabled(false)
      }
    }))
  }, [])

  const redirectToDetails = ({ supplypoints }) => {
    const state = props?.location?.state;
    // Check state because sometimes state is loosed on refresh
    if (state) {
      const {
        supply,
        tabValue,
        menuTabValue,
        consumptionTabValue,
        generationTabValue,
        redirectTo
      } = state

      // PPM 1007560 Controlar si navegamos hacia la pestaña /supplies mediante url (evitamos irnos a /supplies/detail en caso de que response.supplypoints.length === 1)
      const navToSupplies = redirectTo === '/supplies';

      // PPM 1007560 Navegamos al detalle del CUPS pasado vía url a través de email/sms
      // PPM 1007560 Navegamos a /supplies/detail a la ventana concreta que el cliente ha recibido vía email/sms
      if (supply) {
        props.history.push({
          pathname: '/supplies/detail',
          state:{
            tabValue: parseInt(tabValue || 0),
            menuTabValue: parseInt(menuTabValue || 0),
            consumptionTabValue: consumptionTabValue || 0,
            generationTabValue: generationTabValue || 0,
            cups: supply,
          },
        })
      } else if (!origin && supplypoints.length === 1 && !navToSupplies) {
        props.history.push({
          pathname: '/supplies/detail',
          state: {
            selectedTab,
            cups: supplypoints[0].cups,
          },
        })
      }
    }
  }

  useEffect(() => {
    dispatch(ThunkGetUserData((response) => {
        
          setLoadingUserAlertData(true);
        
          if (response.user.franjaInicio) {
            dispatch(setFranjaHorarioInicio(response.user.franjaInicio))
          }
          if (response.user.franjaFin) {
            dispatch(setFranjaHorarioFin(response.user.franjaFin))
          }
          if (response.user.franjaInicioEspecial) {
            dispatch(setFranjaHorarioInicioEspecial(response.user.franjaInicioEspecial))
          }
          if (response.user.franjaFinEspecial) {
            dispatch(setFranjaHorarioFinEspecial(response.user.franjaFinEspecial))
          }
          if (response.user.tipoCanal) {
            dispatch(setTipoCanal(response.user.tipoCanal))
          }
          if (response.user.destinatario) {
            dispatch(setDestinatario(response.user.destinatario))
          }

          setLoadingUserAlertData(false);
          
          

        
    }))
    
  }, []) 
  // Lista de suministros
  useEffect(() => {
    if (user.token !== '' && user.profile.documentNumber) {
      if (
        !adminToken &&
        !rolesArray.includes('US_SUPPLYPOINT_CLIENT') &&
        !rolesArray.includes('US_MANAGER') &&
        !rolesArray.includes('US_CONSULTANT')
      ) {
        props.history.push('/landing')
      } else {
        if (supplies.list.length === 0 && delegations.delegatesInMeList.length === 0) {
          let defaultSupplyName = t('delegations.supplyPointDefaultName')

          // carga inicial de suministros
          dispatch(thunkListSupplies(
            defaultSupplyName,
            //1, // offset
            //15, // limit
            //null, // búsqueda por cups
            //false, // proveniente de cupsSearch para la busqueda
            //0, // offset [delegatePoints]
            //15, // limit [delegatePoints]
            false, // proveniente de cupsSearch para la busqueda [delegatePoints]
            true, // accion contra supplyPoints
            true, // accion contra delegatePoints
            (response) => {
              // callback
              if (response) {
                console.log('response', response);
                
                  const {supplypoints} = response;

                setSuppliesList(supplypoints)

                redirectToDetails({supplypoints})

                setLoadingSuppliesList(false)

                if (supplypoints.length === 0) {
                  setSelectedTab(1)

                  setLoadingDelegationsList(false)
                }
              } else {
                setLoadingSuppliesList(false)

                setLoadingDelegationsList(false)
              }
            }
          ))
        } else {
          setSuppliesList(supplies.list)
          setLoadingDelegationsList(false)

          redirectToDetails({supplypoints: supplies})

          setLoadingSuppliesList(false)
        }
      }
    }
  // eslint-disable-next-line
  }, [ user.token, user.profile.documentNumber, dispatch, origin, props.history, t, props.location ])

  // Lista de delegaciones
  useEffect(() => {
    if (user.token !== '' && selectedTab === 0 && !loadingSuppliesList && supplies.list.length > 0) {
      console.log('selectedTab: ', selectedTab);
      
      if (delegations.managedByMeList.length === 0) {
        dispatch(thunkGetDelegations(setLoadingDelegationsList, (response) => {
          
          let items = response.delegations.items

          if (
            !adminToken &&
            supplies.list.length === 0 &&
            items.length === 0 &&
            delegations.delegatesInMeList.length === 0 &&
            !rolesArray.includes('US_SUPPLYPOINT_CLIENT') &&
            !rolesArray.includes('US_MANAGER') &&
            !rolesArray.includes('US_CONSULTANT')
          ) {
            props.history.push('/landing')
          } else {
            dispatch(setManagedByMeDelegations(items))
          }

          if (supplies.list.length === 0) {
            setSelectedTab(1)
          }

          setLoadingDelegationsList(false)
        }))
      } else {
        if (supplies.list.length === 0) {
          setSelectedTab(1)
        }

        setLoadingDelegationsList(false)
      }
    }

  // eslint-disable-next-line
  }, [ user.token, loadingSuppliesList, delegations.delegatesInMeList.length, delegations.managedByMeList.length, dispatch, origin, props.history, supplies.list.length, adminToken ])

  useEffect(() => {
    dispatch(resetUrlMessages())
    // PPM 1007560 - Seteamos la categoría y el detalle de la pantalla actual para que el usuario Admin pueda mandarle el enlace al cliente vía correo/sms
    if (adminCheck()) {
      dispatch(setUrlMessagesCategory('SUPPLIES'))
      dispatch(setUrlMessagesDetail('SUPPLIES_LIST'))
    }
  }, [])

  return (
    <>
      {
        (loadingSuppliesList || loadingDelegationsList || loadingUserAlertData) ?
          <Spinner fixed={true} />
        :
          <>
            {
              isLoading &&
              <Spinner fixed={true} />
            }

            <DelegationProfile
              popup={delegationProfile}
              setPopup={setDelegationProfile}
              popupStatus={delegationProfileStatus}
              setPopupStatus={setDelegationProfileStatus}
              setIsLoading={setIsLoading}
            />

            <RemoveDelegation
              open={removeDelegation}
              closeFunction={() => setRemoveDelegation(false)}
            />

            <BajaDelegation
              open={bajaDelegation} 
              closeFunction={() => setBajaDelegation(false)}
            /> 

            <div className={classes.block}>
              <ButtonToTop />

              <Grid container className={classes.container}>
                <Grid item xs={11} md={10}>
                  <div className={classes.maxWidthForBigScreens}>
                    <div className={(user && user.profile && user.profile.userId && user.profile.userId > 0) ? classes.title : classes.notRegisteredTitle}>{t('delegations.title')}</div>
                    
                    {
                      !adminToken &&
                        <Actions />
                    }

                    <Box
                      history={props.history}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                      suppliesList={suppliesList}
                      setSuppliesList={setSuppliesList}
                      loadingSuppliesList={loadingSuppliesList}
                      setIsLoading={setIsLoading}
                      loadingDelegationsList={loadingDelegationsList}
                      setLoadingDelegationsList={setLoadingDelegationsList}
                      setDelegationProfile={setDelegationProfile}
                      setDelegationProfileStatus={setDelegationProfileStatus}
                      setRemoveDelegation={setRemoveDelegation}
                      setBajaDelegation={setBajaDelegation}
                      contractsEnabled={contractsEnabled}
                    />
                  </div>
                </Grid>
              </Grid>
            </div>
          </>
      }
    </>
  )
}

export default SecurityHOC(SuppliesList)
