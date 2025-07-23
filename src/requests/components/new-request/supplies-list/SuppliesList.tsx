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
import SupplyData from './supply-data/SupplyData'

import { validateCupsNumber } from '../../../../common/lib/ValidationLib'

import {
  setNewRequestSteps,
  setNewRequestSupply,
  resetNewRequestSupply
} from '../../../store/actions/RequestsActions'
import { thunkListSupplies } from '../../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './SuppliesList.styles'
import { sendGAEvent } from '../../../../core/utils/gtm'

const SuppliesList = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const ref = useRef(null)
  const bottomRef = useRef(null)

  const { setCurrentStep, setCurrentCups } = props

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
  const supplies = useSelector((state: any) => state.supplies)

  const rowsPerPage = 15

  useEffect(() => {
    setTotalPages(supplies.list.length === 0 ? 1 : Math.ceil(supplies.list.length / rowsPerPage))

    setCupsList(supplies.list)
  // eslint-disable-next-line
  }, [ supplies.list ])

  useEffect(() => {
    if (user.token !== '' && user.profile.documentNumber) {
      if (cupsList.length === 0) {
        if (supplies.list.length === 0) {
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
              if (response && response.supplypoints && response.supplypoints.length > 0) {
                setCupsList(response.supplypoints)
              }
              setIsLoading(false)
            }
          ))
        } else {
          setCupsList(supplies.list)
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

  const handleSearchCups = () => {
    const cups = currentSearchValue.toUpperCase()

    setOpenBox(false)

    if (cups !== '' && validateCupsNumber(cups)) {
      setIsLoading(true)

      const defaultSupplyName = t('delegations.supplyPointDefaultName')

      // llamada al servicio listSupplies
      dispatch(thunkListSupplies(
        defaultSupplyName,
        //1, // offset
        //1, // limit
        //cups, // búsqueda por cups
        //true, // proveniente de cupsSearch para la busqueda
        //0, // offset [delegatePoints]
        //15, // limit [delegatePoints]
        true, // proveniente de cupsSearch para la busqueda [delegatePoints]
        true, // accion contra supplyPoints
        true, // accion contra delegatePoints
        (response) => {
          // callback
          if (response) {
            const searchedCups = response.supplypoints && response.supplypoints.filter(item => item.cups === cups)

            const delegatesInMeCups = response.delegatepoints && response.delegatepoints.filter(item => item.cups === cups && item.role === 'US_MANAGER')

            // se setea la nueva lista si se ha encontrado el CUPS del usuario
            if ((searchedCups && searchedCups.length > 0) || (delegatesInMeCups && delegatesInMeCups.length > 0)) {
              setCurrentSearchValue(cups)

              const mix = [
                ...searchedCups,
                ...delegatesInMeCups
              ] as any

              if (mix.length > 0) {
                setSearchCupsList(mix)
              }
            }
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
      cups: item.cups && item.cups,
      name: item.name && item.name,
      address: item.address && `${item.address.street ? item.address.street+' ' : ''}${item.address.name ? item.address.name+' ' : ''}${item.address.number ? item.address.number+', ' : ''}${item.address.street ? item.address.street+' ' : ''}${item.address.complement2 ? item.address.complement2+', ' : ''}${item.address.municipality ? item.address.municipality+', ' : ''}${item.address.province ? item.address.province : ''}`
    }

    dispatch(setNewRequestSteps({
      step2: object.cups
    }))

    dispatch(setNewRequestSupply(object))

    setCups(object)

    setCurrentCups(object && object.cups)

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

    // resetear datos del suministro seleccionado
    dispatch(resetNewRequestSupply())
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
      request_type: 'mis suministros',
      request_step: '1',
      request_step_name: 'selecciona el cups del suministros sobre el que quieres hacer la peticion',
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
      request_type: 'mis suministros',
      request_step: '1',
      request_step_name: 'selecciona el cups del suministros sobre el que quieres hacer la peticion',
      cups: cups.cups,
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  return (
    <div className={`${classes.block} ${window.location.pathname === '/supplies/detail' && 'without-margin'} ${window.location.pathname === '/provisions/detail' && 'with-margin'}`}>
      <Grid container className={classes.container}>
        <Grid item md={10} sm={11} xs={11}>
          <div className={`${classes.goBackContainer} ${window.location.pathname === '/provisions/detail' && 'onDossier'} ${window.location.pathname === '/supplies/detail' && 'onSupply'}`}>
            <Grid container className={classes.goBack} onClick={handleClickBack}>
              <Grid item className={classes.goBackIcon}>
                <BackIcon />
              </Grid>

              <Grid item>
                {t('requests.newRequest.goBack')}
              </Grid>
            </Grid>
          </div>

          <div className={`${classes.title} ${window.location.pathname === '/provisions/detail' && 'without-margin'} ${window.location.pathname === '/supplies/detail' && 'onSupply'}`}>{t('requests.newRequest.suppliesOrDossiersList.title')}</div>

          <Breadcrumbs currentStep={2} />

          <div className={classes.description}>
            {t('requests.newRequest.suppliesOrDossiersList.descriptions.supplies')}
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
                    {t('requests.newRequest.suppliesOrDossiersList.lists.supplies.title')}
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
                          placeholder={t('provisions.editProvision.requestData.cupsSearch.placeholder')}
                          onClick={() => setOpenBox(true)}
                          onChange={(e) => setCurrentSearchValue(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <div className={classes.iconColor} onClick={handleSearchCups}>
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
                                            reactStringReplace(item.cups, currentSearchValue, (match) => (
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
                            setCurrentCups={setCurrentCups}
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
                            setCurrentCups={setCurrentCups}
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
              <SupplyData
                selectedItem={cups}
                setSelectedItem={setCups}
                setCurrentCups={setCurrentCups}
                setSelected={setSelected}
                setNewRequestSupply={setNewRequestSupply}
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
                    disabled={!selected}
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

export default SuppliesList
