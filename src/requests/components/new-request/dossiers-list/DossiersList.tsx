import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import reactStringReplace from 'react-string-replace'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Grid from '@material-ui/core/Grid'
import SearchIcon from '@material-ui/icons/Search'
import BackIcon from '@material-ui/icons/ChevronLeft'

import Spinner from '../../../../common/components/spinner/Spinner'
import Input from '../../../../common/components/input/Input'
import Button from '../../../../common/components/button/Button'

import Breadcrumbs from '../common/breadcrumbs/Breadcrumbs'
import List from './list/List'
import Mosaic from './mosaic/Mosaic'
import DossierData from './dossier-data/DossierData'

import { validateDossierCode } from '../../../../common/lib/ValidationLib'

import {
  setNewRequestSteps,
  setNewRequestDossier,
  resetNewRequestDossier
} from '../../../store/actions/RequestsActions'
import { thunkListDossiers } from '../../../../provisions/store/actions/ProvisionsThunkActions'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './DossiersList.styles'

import { sendGAEvent } from '../../../../core/utils/gtm'

const DossiersList = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const ref = useRef(null)
  const bottomRef = useRef(null)

  const { setCurrentStep } = props

  const [ cups, setCups ] = useState({} as any)
  const [ cupsList, setCupsList ] = useState([] as any)
  const [ searchCupsList, setSearchCupsList ] = useState([] as any)
  const [ currentSearchValue, setCurrentSearchValue ] = useState('')
  const [ selected, setSelected ] = useState(true)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ openBox, setOpenBox ] = useState(false)
  const [ totalPages, setTotalPages ] = useState(0)
  const [ currentPage, setCurrentPage ] = useState(0)

  const user = useSelector((state: any) => state.user)
  const provisions = useSelector((state: any) => state.provisions)

  const rowsPerPage = 15

  useEffect(() => {
    setTotalPages(provisions.count === 0 ? 1 : Math.ceil(provisions.count / rowsPerPage))

    setCupsList(provisions.provisionsList)
  // eslint-disable-next-line
  }, [ provisions.provisionsList ])

  useEffect(() => {
    if (user.token !== '' && user.profile.documentNumber) {
      if (cupsList.length === 0) {
        if (provisions.provisionsList.length === 0) {
          const supplyPointDefaultName = t('provisions.defaultName')
          setIsLoading(true)
          dispatch(thunkListDossiers(supplyPointDefaultName, 1, 900, null, false, (response) => {
            if (response && response.length > 0) {
              setCupsList(response)
            }
            setIsLoading(false)
          }))
        } else {
          setCupsList(provisions.provisionsList)
        }
      }
    }
  // eslint-disable-next-line
  }, [ user ])

  const handleClickBack = () => {
    setCurrentStep(1)
  }

  const handleScrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current && bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleSearchCups = (e) => {
    const cups = e.target.value.toUpperCase()

    if (cups !== '' && validateDossierCode(cups)) {
      setIsLoading(true)

      const defaultSupplyName = t('provisions.defaultName')

      // llamada al servicio listSupplies
      dispatch(thunkListDossiers(
        defaultSupplyName,
        1, // offset
        1, // limit
        cups, // búsqueda por cups
        true, // proveniente de cupsSearch para la busqueda
        (response) => {
          // callback

          const searchedCups = response.filter(item => item.dossierCod === cups)

          // se setea la nueva lista si se ha encontrado el CUPS del usuario
          if (searchedCups && searchedCups.length > 0) {
            setCurrentSearchValue(cups)
            setSearchCupsList(searchedCups)
          }

          setIsLoading(false)
        }
      ))
    } else {
      setSearchCupsList([] as any)
    }
  }

  const handleClickItem = (item) => {
    setOpenBox(false)

    const object = {
      dossierCod: item.dossierCod && item.dossierCod,
      name: item.name && item.name,
      address: item.addressDescription && item.addressDescription,
      idDossierType: item.idDossierType
    }

    dispatch(setNewRequestSteps({
      step2: object.dossierCod
    }))

    dispatch(setNewRequestDossier(object))

    setCups(object)

    setSelected(true)

    handleScrollToBottom()
  }

  const handleClickContinue = () => {
    setCurrentStep(3)
  }

  const handleClickOutside = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpenBox(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  useEffect(() => {
    // resetear datos de este paso (2)
    // resetear paso 3 (reason)
    dispatch(setNewRequestSteps({
      step2: '',
      step3: ''
    }))

    // resetear datos del expediente seleccionado
    dispatch(resetNewRequestDossier())
  // eslint-disable-next-line
  }, [])

  const sendGAEventExitRequest = ():void => {
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: 'salir de la petición',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      request_type: 'mis solicitudes de conexión a la red',
      request_step: '1',
      request_step_name: 'selecciona el numero de solicitud sobre el que quieres hacer la peticion',
      cups: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  const sendGAEventContinueRequest = ():void => {
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: 'continuar',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      request_type: 'mis solicitudes de conexion a la red',
      request_step: '1',
      request_step_name: 'selecciona el numero de solicitud sobre el que quieres hacer la peticion',
      request_number: cups.dossierCod,
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  return (
    <div className={`${classes.block} ${window.location.pathname === '/supplies/detail' && 'without-margin'} ${window.location.pathname === '/provisions/detail' && 'with-margin'}`}>
      <Grid container className={classes.container}>
        <Grid item md={10} sm={11} xs={11}>
          <div className={classes.goBackContainer}>
            <Grid container className={classes.goBack} onClick={handleClickBack}>
              <Grid item className={classes.goBackIcon}>
                <BackIcon />
              </Grid>

              <Grid item>
                {t('requests.newRequest.goBack')}
              </Grid>
            </Grid>
          </div>

          <div className={`${classes.title} ${window.location.pathname === '/provisions/detail' && 'without-margin'}`}>{t('requests.newRequest.suppliesOrDossiersList.title')}</div>

          <Breadcrumbs currentStep={2} />

          <div className={classes.description}>
            {t('requests.newRequest.suppliesOrDossiersList.descriptions.dossiers')}
          </div>

          <Grid container className={classes.list}>
            <Grid item md={8} sm={12} xs={12}>
              <ExpansionPanel defaultExpanded={isLoading && cupsList.length === 0}>
                <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
                  {
                    cupsList.length === 0 && isLoading &&
                      <Spinner />
                  }

                  <span className={classes.panelTitle}>
                    {t('requests.newRequest.suppliesOrDossiersList.lists.dossiers.title')}
                  </span>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                  {
                    isLoading &&
                      <Spinner />
                  }

                  <Grid container>
                    <Grid container md={12} className={classes.searchContainer}>
                      <Grid item md={6} xs={12} className={classes.inputContainer}>
                        <Input
                          className={classes.input}
                          fullWidth
                          placeholder={t('provisions.editProvision.requestData.dossierSearch.placeholder')}
                          onBlur={handleSearchCups}
                          onClick={() => setOpenBox(true)}
                          InputProps={{
                            endAdornment: (
                              <div className={classes.iconColor}>
                                <SearchIcon />
                              </div>
                            )
                          }}
                        />

                        {
                          openBox && searchCupsList.length > 0 &&
                              <div className={classes.searchBox} ref={ref}>
                                {
                                  searchCupsList.map(
                                    (item, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className={classes.searchItem}
                                          onClick={() => handleClickItem(item)}
                                        >
                                          {
                                            reactStringReplace(item.dossierCod, currentSearchValue, (match) => (
                                              <b>{match}</b>
                                            ))
                                          }
                                        </div>
                                      )
                                    }
                                  )
                                }
                              </div>
                        }
                      </Grid>
                    </Grid>

                    <Grid container md={12}>
                      {
                        mobile ?
                          <Mosaic
                            cupsList={cupsList}
                            searchedItems={searchCupsList}
                            setCups={setCups}
                            setSelected={setSelected}
                            handleScrollToBottom={handleScrollToBottom}
                            totalPages={totalPages}
                            rowsPerPage={rowsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setIsLoading={setIsLoading}
                          />
                        :
                          <List
                            cupsList={cupsList}
                            searchedItems={searchCupsList}
                            setCups={setCups}
                            setSelected={setSelected}
                            handleScrollToBottom={handleScrollToBottom}
                            totalPages={totalPages}
                            rowsPerPage={rowsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setIsLoading={setIsLoading}
                          />
                      }
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>

          {
            Object.entries(cups).length > 0 &&
              <DossierData
                selectedItem={cups}
                setSelectedItem={setCups}
                setSelected={setSelected}
                setNewRequestDossier={setNewRequestDossier}
              />
          }

          <Grid container className={classes.buttons} spacing={4}>
            {
              Object.entries(cups).length > 0 &&
                <Grid item md='auto' sm={12} xs={12}>
                  <Button
                    text={t('common.buttons.continue')}
                    color='primary'
                    size='large'
                    variant='contained'
                    disabled={false/*!selected*/}
                    onClick={() => { sendGAEventContinueRequest(); handleClickContinue()}}
                  />
                </Grid>
            }

            <Grid item md='auto' sm={12} xs={12}>
              <div className={classes.exit}>
                <Link to='/requests' onClick={() => {sendGAEventExitRequest()}}>{t('requests.newRequest.exit')}</Link>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <div ref={bottomRef} />
    </div>
  )
}

export default DossiersList
