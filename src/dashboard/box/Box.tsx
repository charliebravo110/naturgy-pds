import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ArrowRightIcon from '../../assets/icons/flecha_derecha_blue.svg'
import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import useStyles from './Box.styles'
import Summary from './summary/Summary'
import ListSupply from '../listSupply/ListSupply'
import { thunkListSupplies } from '../../supplies/supplies-list/store/actions/SuppliesListThunkActions'
import EstimatedMaximumPower from '../power/estimated-maximum-power/EstimatedMaximumPower'
import Consumption from '../consumption/consumption/Consumption'
import { formatDate } from '../../common/lib/FormatLib'
import { thunkGetMaxPotencyDemanded, thunkGetCurrentSupplyConsumptions, thunkGetMasterData } from '../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'
import Spinner from '../../common/components/spinner/Spinner'
import Requests from './requests/Requests'
import MaxConsumptionIcon from '../../assets/icons/consumo_maximo.svg'
import MaxPotIcon from '../../assets/icons/Potencia_maxima.svg'
import requestRoleFilter from '../../requests/components/request-filter/RequestFilter'
import { push } from 'connected-react-router'
import AlertIcon from '../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../assets/icons/cerrar.svg'
import Modales from '../../supplies/supplies-details/components/consumption/charts/filters/error-message/Modales'
import useModal from '../../supplies/supplies-details/components/consumption/charts/filters/error-message/UseModal'
import useStyles_ from '../../supplies/supplies-details/components/consumption/charts/filters/error-message/SessionTimeout.styles'
import Button from '../../common/components/button/Button'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../core/utils/gtm';

const Box = (props: any) => {

  const classes = useStyles({})
  const { t } = useTranslation()
  const theme = useTheme()

  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [BoxVisible, setIsBoxVisible] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)

  const [potContratada, setPotContratada] = useState('0,0')
  const [maxPowerString, setMaxPowerString] = useState('0,0')
  const [DayMaxConsumption, setDayMaxConsumption] = useState(0)
  const [MonthMaxConsumption, setMonthMaxConsumption] = useState(0)
  const [YearMaxConsumption, setYearMaxConsumption] = useState(0)
  let dateTo = new Date()
  let dateFrom = new Date(dateTo.getFullYear(), dateTo.getMonth() - 6, 1)
  let dateinipot
  let dateendpot
  if (dateTo.getDate() > 4){
    dateinipot= new Date(dateTo.getFullYear(), dateTo.getMonth()-1, 1) 
    dateendpot = new Date(dateTo.getFullYear(), dateTo.getMonth(), 0) 
  } else {
    dateinipot = new Date(dateTo.getFullYear(), dateTo.getMonth()-2, 1)
    dateendpot = new Date(dateTo.getFullYear(), dateTo.getMonth()-1, 0)
  }

  const [consumptionsFilters, setConsumptionsFilters] = useState({
    granularity: 'M',
    startDate: formatDate(dateFrom),
    endDate: formatDate(dateTo)
  })

  const [selectedItemsList, setSelectedItemsList] = useState([] as any)
  const supplies = useSelector((state: any) => state.supplies)
  const [suppliesList, setSuppliesList] = useState([] as any)
  
  // JAG - 20230109 - ppm_1008179 - Solo mostramos los suministros Activos Contratados
  const onlySupplyActives = suppliesList.filter(item => item.descStatus == 'ACTIVO CONTRATADO');
  
  const handleChangeBoxVisible = () => {
    setIsBoxVisible(!BoxVisible)
  }
  const [totalGeneration, setTotalGeneration] = useState('0,0')
  const [startDateEg, setStartDateEg] = useState('')
  const [endDateEg, setEndDateEg] = useState('')
  const [totalexportgeneration, setTotalexportgeneration] = useState('0,0')

  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)

  const requests = useSelector((state: any) => state.requests)
  const [viewconsumptions, setViewconsumptions] = useState(false)
  const [viewpower, setViewpower] = useState(false)

  const [supplyBck, setSupplyBck] = useState('')
  const [mdmout, setMdmout] = useState('')

  const [filterList, setFilterList] = useState([])

  useEffect(() => {
    try {
      dispatch(thunkGetMasterData(
        'SERVICE_REQUEST_FILTERS',
        'ES',
        'FILTERS',
        (response) => {
          if (response && response.length > 0) {
            setFilterList(response[0].value.split(';'))
          }
        }
      ))
    } catch (error) {
      // LCS: Enviar evento a GA - Wave 2
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: 'Error al obtener filtros de servicio',
          error: error,
          reactComponent: 'Box.tsx - useEffect',
        }
      });
    }
  }, [])
  
  const loadConsumption = (supply: any) => {
    if (supply.tipoDeLectura !== '') {
      setViewconsumptions(true)
      setIsLoading(true)
      try {
        dispatch(thunkGetCurrentSupplyConsumptions(
          true,
          supply.holderDocumentNumber,
          supply.cups,
          consumptionsFilters.granularity,
          consumptionsFilters.startDate,
          consumptionsFilters.endDate,
          setIsLoading,
          supply.isGenerator,
          false,
          supply.isDelegate,
          null,
          supply.isSelfConsumption ? '1' : '0',
          supply.measurementSystem, (responseConsumptions) => {
            if (responseConsumptions !== 'showModalError1007') {
              if (responseConsumptions[0] && responseConsumptions[0].totalConsumption && responseConsumptions[0].totalConsumption !== '') {
                if (startDateEg === '') {
                  setTotalGeneration(responseConsumptions[0].totalConsumption)
                  setStartDateEg(responseConsumptions[0].periodStartDate)
                  setEndDateEg(responseConsumptions[0].periodEndDate)
                  let exportedgeneration = 0
                  responseConsumptions[0].consumptions.items.forEach((element) => {
                    exportedgeneration = exportedgeneration + parseFloat(element.consumptionValue.replace(',', '.'))
                  })
                  setTotalexportgeneration(exportedgeneration.toFixed(3).toString().replace('.', ','))
                }
              }
              setIsLoading(false)
            } else {
              setModalMessage('errors.autoconsumo.1007')
              setModalSecondMessage('')
              toggle();
            }
          }))
      } catch (error) {
        // LCS: Enviar evento a GA - Wave 2
        sendGAEvent({
          event: 'api_error',
          info: {
            error_message: 'Error al cargar consumos',
            error: error,
            reactComponent: 'Box.tsx - loadConsumption',
          }
        });
        setIsLoading(false)
        setViewconsumptions(false)
      }
    } else {
      setIsLoading(false)
      setViewconsumptions(false)
    }
  };
  
  const loadPower = (supply: any) => {
    let contratadaString = '0,0'
    contratadaString = supply.power1 ? supply.power1 : contratadaString
  
    setPotContratada(contratadaString.replace('.', ','))
    setIsLoading(true)
  
    if (supply.tipoDeLectura !=='') {
      setViewpower(true)
      try {
        dispatch(thunkGetMaxPotencyDemanded(
          supply.cups,
          formatDate(dateinipot),
          formatDate(dateendpot),
          setIsLoading,
          '0', //isGenerator
          false, //supplantedUser,
          false, // isDelegate
          supply.measurementSystem,
          (responseMaxPot) => {
            if (responseMaxPot && responseMaxPot.months && responseMaxPot.months.items && responseMaxPot.months.items.length > 0) {
              if (responseMaxPot.months.items[0]) {
                responseMaxPot.months.items.map(item => {
                  setMaxPowerString(item.maxPotencyDemandedP0.toString().replace('.', ','))
                  setDayMaxConsumption(item.dayP0)
                  setMonthMaxConsumption(item.month)
                  setYearMaxConsumption(item.year)
                });
              }
            }
          }
        ))
      } catch (error) {
        // LCS: Enviar evento a GA - Wave 2
        sendGAEvent({
          event: 'api_error',
          info: {
            error_message: 'Error al cargar potencia',
            error: error,
            reactComponent: 'Box.tsx - loadPower',
          }
        });
      }
    } else {
      setIsLoading(false)
      setViewpower(false)
    }
  }

  {/*FUNCIÓN PARA CARGAR DATOS DASHBOARD*/}
  const showDataOnDashboard = (supply) => {
    setSupplyBck(supply)
    setSelectedItemsList(supply)
    //esta llamada se encarga de comprobar si mdm no funciona, de no funcionar no carga ni consumos ni pootencias
    dispatch(thunkGetMasterData('MDM_OUT', 'ES', 'MDMOUT', (response) => {
      if (response !== undefined && response.length > 0 && response[0].value === 'false') {
        setMdmout(response[0].value)
        loadConsumption(supply)
        loadPower(supply)
      } 
      if (response !== undefined && response.length > 0 && response[0].value === 'true') {
        setMdmout(response[0].value)
      }
		}));
    setIsLoading(false)
  }

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      if (user.token !== '' && user.profile.documentNumber) {
        if (suppliesList.length === 0) {
          if (supplies.list.length === 0) {
            let existeFav = false;
            const supplyPointDefaultName = t('delegations.supplyPointDefaultName')
            setIsLoading(true)
    
              dispatch(thunkListSupplies(
                supplyPointDefaultName,
                //1,
                //15,
                //null,
                //false,
                //0, // offset [delegatePoints]
                //15, // limit [delegatePoints]
                false, // proveniente de cupsSearch para la busqueda [delegatePoints]
                true, // accion contra supplyPoints
                true, // accion contra delegatePoints
                (response) => {
                  if (!isCancelled) {
                    if (response && response.supplypoints) {
                      setSuppliesList(response.supplypoints)
                      if ((response.supplypoints.length > 0 && response.supplypoints.length < 6)) {
                        let favSupplyIndex = 0;
                        response.supplypoints.forEach((supply, index) => {
                          if (supply.icon !== undefined && supply.icon.includes('fav') && supply.descStatus == 'ACTIVO CONTRATADO') {
                            existeFav = true;
                            favSupplyIndex = index;
                          
                          } else if (supply.descStatus == 'ACTIVO CONTRATADO' && !existeFav) {
                            favSupplyIndex = index;
                          }
                        })
                        showDataOnDashboard(response.supplypoints[favSupplyIndex]);
                      } else if ((response.supplypoints.length >= 6) || (response.supplypoints.length === 0 && response.delegatepoints.length > 0)) {
                        dispatch(push('/supplies'))
                      }
                    } else {
                      dispatch(push('/provisions'))
                    }
                    setIsLoading(false)
                  }
                }
              ))
            
          } else {
            setSuppliesList(supplies.list)
            let existeFav = false;
            let favSupplyIndex = 0;
            supplies.list.forEach((supply, index) => {
              if (supply.icon !== undefined && supply.icon.includes('fav') && supply.descStatus == 'ACTIVO CONTRATADO' ) {
                favSupplyIndex = index;
                existeFav = true;
              } else if (supply.descStatus == 'ACTIVO CONTRATADO' && !existeFav) {
                favSupplyIndex = index;
              }
            })
            showDataOnDashboard(supplies.list[favSupplyIndex])
          }
        }
      }
    }
  
    return () => {
      isCancelled = true;
    };
  
  }, [user])


  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      if(supplyBck) 
      {
        loadConsumption(supplyBck)
      }
    }
    return () => {
      isCancelled = true;
    };
  
  }, [consumptionsFilters])
  
  const showSupplyData = (supply) => {
    showDataOnDashboard(supply);
  }

  const {isOpen, toggle} = useModal()
  const classes_ = useStyles_({});
  const [ModalMessage, setModalMessage] = useState('')
  const [ModalSecondMessage, setModalSecondMessage] = useState('')

  const handleClickSeeConsumption = () => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'browsing',
      section_name: 'inicio',
      click_text: 'ver consumo',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.origin + '/dashboard'),
      module_name: 'consumo',
      cups: selectedItemsList.cups,
      click_url: window.location.href,
      supply_type: selectedItemsList.isGenerator ? (selectedItemsList.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  const handleClickShowPower = () => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'browsing',
      section_name: 'inicio',
      click_text: 'ver potencia',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.origin + '/dashboard'),
      module_name: 'potencia',
      cups: selectedItemsList.cups,
      click_url: window.location.href,
      supply_type: selectedItemsList.isGenerator ? (selectedItemsList.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  const handleClickShowErnergyGenerate = () => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'browsing',
      section_name: 'inicio',
      click_text: 'ver energia generada',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.origin + '/dashboard'),
      module_name: 'energia generada',
      cups: selectedItemsList.cups,
      click_url: window.location.href,
      supply_type: selectedItemsList.isGenerator ? (selectedItemsList.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  const handleClickShowRequests = () => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'browsing',
      section_name: 'inicio',
      click_text: 'ver todas las peticiones',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.origin + '/dashboard'),
      module_name: 'peticiones',
      cups: selectedItemsList.cups,
      click_url: window.location.href,
      supply_type: selectedItemsList.isGenerator ? (selectedItemsList.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  return (
    <>
    <Modales isOpne={isOpen} toggle={toggle}>
        <img src={CloseIcon} className={classes_.closeButton} alt='close' onClick={toggle} />
        <img src={AlertIcon}/>
        <div className={classes_.title}>
          {t(ModalMessage)}
        </div>
        <div className={classes_.body}>
          {t(ModalSecondMessage)}
        </div>
        <Grid item>
          <Grid container justifyContent='center'>
            <Button
              className={classes_.button}
              text={t('errors.date.button.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={toggle}
            />
          </Grid>
        </Grid>
      </Modales>
    <Grid container className={classes.container}>
      
      {/*SPINNER*/}
      {(isLoading) &&
        <Spinner fixed={true} />
      }

      {/*CABECERA*/}
      {(supplies.list && supplies.list.length > 0) &&
        <Summary
          //aquí se estaba pasando el suppliList vacio siempre
          supplyData={supplies.list}
          selectedItemsList={selectedItemsList}
        />
      }

      {/*SUPPLIES LIST*/}
      {(onlySupplyActives.list && onlySupplyActives.list.length > 1) && /* JAG - 20230109 - ppm_1008179 - Solo mostramos los suministros Activos Contratados */
        <Grid container item xs={12} md={12} sm={12}>
          <div className={classes.boxSuppliesList}>
            <Grid container xs={12} md={12} sm={12} className={classes.suppliesList} onClick={handleChangeBoxVisible}>
              {t('dashboard.puntossuministro.linkcups')}
              <Grid item className={classes.arrowIcon}>
                {BoxVisible ?
                  <img className={classes.arrowUp} src={ArrowRightIcon} alt='' />
                  :
                  <img src={ArrowRightIcon} alt='' />
                }
              </Grid>
            </Grid>
            {BoxVisible &&
              <Grid container xs={12} md={12} sm={12} className={classes.table}>
                <ListSupply listItems={suppliesList} handleShowSupplyData={showSupplyData} />
              </Grid>
            }
          </div>
        </Grid>
      }

      {/*CONSUMO*/}
      <Grid container className={classes.options} spacing={2}>
        {(supplies.list && supplies.list.length > 0 && viewconsumptions) &&
          <Grid item md={2} sm={6} xs={12} >
            <div className={classes.boxconsumption}>
              <Grid item md={12} className={classes.title}>{selectedItemsList.isSelfConsumption ? t('dashboard.Autoconsumo') : t('dashboard.Consumo')}</Grid>
              <Consumption
                setIsLoading={setIsLoading}
                consumptionsFilters={consumptionsFilters}
                setConsumptionsFilters={setConsumptionsFilters}
                isGeneration={selectedItemsList.isGenerator === '1' ? true : false}
                isSelfConsumption={selectedItemsList.isSelfConsumption ? true : false}
              />
              <Grid container className={classes.userInfo}>
                <div onClick={handleClickSeeConsumption}>
                  <Link
                    to={{
                      pathname: '/supplies/detail',
                      state: {
                        cups: selectedItemsList.cups,
                        dashboard: selectedItemsList.isSelfConsumption ? 'linkSelfConsumptions' : 'linkConsumptions'
                      }
                    }}
                    className={classes.Link}
                  >
                    <Grid container className={classes.Link}>
                      {selectedItemsList.isSelfConsumption ? t('dashboard.verautoconsumo') : t('dashboard.verconsumo')}
                      <Grid item className={classes.arrowIcon2}>
                        <img src={ArrowRightIcon} alt='' />
                      </Grid>
                    </Grid>
                  </Link>
                </div>
              </Grid>
            </div>
          </Grid>
        }

        {/*POTENCIA*/}
        {(viewpower) &&
          <Grid item md={2} sm={6} xs={12}>
            <div className={classes.boxpower}>
              <Grid container className={classes.title}>{t('dashboard.Potencia')}</Grid>
              <Grid container className={classes.Potinfo}>
                <Grid item xs={6}>
                  <span className={classes.potencia}>{maxPowerString}</span>
                  <span className={classes.Watt}>{t('dashboard.Power')}</span>
                </Grid>
                <Grid item xs={6}>
                  <span className={classes.potencia}>{potContratada.replace('.', ',')}</span>
                  <span className={classes.Watt}>{t('dashboard.Power')}</span>
                </Grid>
              </Grid>
              <Grid container className={classes.info}>
                <Grid className={classes.Wattinfo} item xs={6} sm={6}>
                  <img src={MaxPotIcon} alt='' />
                  {t(' ')}
                  {t('dashboard.PotMax')}
                </Grid>
                <Grid className={classes.Wattinfo} item xs={6} sm={6}>
                  <img src={MaxConsumptionIcon} alt='' />
                  {t(' ')}
                  {t('dashboard.Potcont')}
                </Grid>
              </Grid>
              <Grid container className={classes.info}>
                <Grid className={classes.Infopot} item xs={6} sm={6}>
                  {
                    (YearMaxConsumption !== 0) &&
                    <span>{DayMaxConsumption}/{MonthMaxConsumption}/{YearMaxConsumption}</span>                   
                  }
                </Grid>
                <Grid className={classes.Infopot}item xs={6} sm={6}>{t('dashboard.Potinfocont')}</Grid>
              </Grid>
              <EstimatedMaximumPower
                potContratada={potContratada}
                potMaxDemanda={maxPowerString}
              />
              <Grid container className={classes.userInfo}>
                {
                  mobile ?
                    <Grid item className={classes.infoPower}>{t('dashboard.powerInfo')}</Grid>
                  :
                    <Grid item className={classes.infoPower} xs={9}>{t('dashboard.powerInfo')}</Grid>
                }
                <Grid item>
                  <div onClick={handleClickShowPower}>
                    <Link
                      to={{
                        pathname: '/supplies/detail',
                        state: {
                          cups: selectedItemsList.cups,
                          dashboard: 'linkpotencia'
                        }
                      }}
                      className={classes.Link}
                    >
                      <Grid container className={classes.Link}>{t('dashboard.verPotencia')}
                        <Grid item className={classes.arrowIcon2}>
                          <img src={ArrowRightIcon} alt='' />
                        </Grid>
                      </Grid>
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        }
      </Grid>
      <Grid container className={classes.options} spacing={1}>
        {(mdmout === 'true') &&
          <Grid item md={12} sm={12} xs={12} >
            <div className={classes.dossierDateAdviseTitle}>
              <img src={AlertIcon} className={classes.infoIcon} alt='' />
              <Grid item md={12} className={classes.text}>{t('dashboard.courtesy')}</Grid>
            </div>  
          </Grid>
        }
      </Grid>
      {/*ENERGIA GENERADA*/}
      {(selectedItemsList.isGenerator === '1') &&
        <Grid item md={12} sm={12} xs={12}>
          <div className={classes.boxgenerator}>
            <Grid container xs={12}>
              <Grid item className={classes.title}>{t('dashboard.Energia')}</Grid>
              <Grid item className={classes.infoEnergy}>{t('dashboard.energyInfo')}</Grid>
            </Grid>
            <Grid container className={classes.potencia1}>
              <Grid item xs={12} md={3}>
                <span>{totalGeneration}</span>
                <span className={classes.Watt1}>{t('dashboard.Power')}</span>
              </Grid>
              <Grid item className={classes.energyText} xs={12} md={3}>
                <Grid container>{t('dashboard.generator')}</Grid>
                {
                  (startDateEg !== '') &&
                  <Grid container className={classes.Infopot}>{t('dashboard.from') + t(startDateEg) + t('dashboard.to') + t(endDateEg)}</Grid>
                }
              </Grid>
              <Grid item xs={12} md={2}>
                <span>{totalexportgeneration}</span>
                <span className={classes.Watt1}>{t('dashboard.Power')}</span>
              </Grid>
              <Grid item className={classes.energyText} xs={12} md={3}>
                <Grid container>{t('dashboard.consumption')}</Grid>
                {
                  (startDateEg !== '') &&
                  <Grid container className={classes.Infopot}>{t('dashboard.from') + t(startDateEg) + t('dashboard.to') + t(endDateEg)}</Grid>
                }
              </Grid>
              <Grid container className={classes.userInfo}>
                <div onClick={handleClickShowErnergyGenerate}>
                  <Link
                    to={{
                      pathname: '/supplies/detail',
                      state: {
                        cups: selectedItemsList.cups,
                        dashboard: 'linkEnergiaGenerada'
                      }
                    }}
                    className={classes.Link}
                  >
                    <Grid container className={classes.Link}>{t('dashboard.ernergygenerate')}
                      <Grid item className={classes.arrowIcon2}>
                        <img src={ArrowRightIcon} alt='' />
                      </Grid>
                    </Grid>
                  </Link>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
      }

      {/*PETICIONES*/}
      {(supplies.list && supplies.list.length > 0) &&
        <Grid item md={12} sm={12} xs={12}>
          <div className={classes.boxpeticiones}>
            <Grid container direction='row' justifyContent='flex-start' className={classes.options}>
              <Grid item className={classes.title}>{t('dashboard.Peticiones')}</Grid>
              <Grid item className={classes.peticiones}>
                {'('}
                {requestRoleFilter(requests.list.filter(item => item.indRead === 0), filterList).length}
                {t('dashboard.pendientesLectura')}
              </Grid>
            </Grid>
            {mobile ?
              <div style={{ marginTop: 15, marginBottom: 15}}>
                <Requests requests={requests} />
              </div>
              :
              <div style={{ marginLeft: 50, marginTop: 15}}>
                <Requests requests={requests} />
              </div>
            }
            <Grid container className={classes.userInfo}>
              <div onClick={handleClickShowRequests}>
                <Link
                  to={{
                    pathname: '/requests',
                    state: {
                      cups: selectedItemsList.cups,
                      dashboard: 'linkpeticiones'
                    }
                  }}
                  className={classes.Link}
                >
                  <Grid container className={classes.Link}>{t('dashboard.verPeticiones')}
                    <Grid item className={classes.arrowIcon2}>
                      <img src={ArrowRightIcon} alt='' />
                    </Grid>
                  </Grid>
                </Link>
              </div>
            </Grid>
          </div>
        </Grid>
      }
    </Grid>
    </>
  )
}

export default Box
