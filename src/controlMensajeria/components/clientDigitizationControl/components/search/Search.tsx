import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Select from '../../../../../common/components/select/Select'
import Button from '../../../../../common/components/button/Button'
import DatepickerV3 from '../../../../../common/components/datepickerV3/DatepickerV3'
import EmailIcon from '../../../../../assets/icons/Interfaz_90_sobre_mail_correo_postal.svg'
import MobileIcon from '../../../../../assets/icons/Icon_sms.svg'
import UpdateIcon from '../../../../../assets/icons/actualizar.svg'

import ClientDigitizationResumeGraph from './client-digitization-resume-graph/ClientDigitizationResumeGraph'

import { thunkGetMasterData, thunkGetUrlMessagesData } from '../../../../../common/components/send-url/store/actions/SendUrlThunkActions'

import useStyles from './Search.styles'

export const Search = (props: any) => {
  const { t } = useTranslation()
  const styles = useStyles({})
  const dispatch = useDispatch()
  
  const {
    setIsLoading,
    selectedCategory,
    setSelectedCategory,
    selectedDetail,
    setSelectedDetail,
    datepickerDate1,
    setDatepickerDate1,
    datepickerDate2,
    setDatepickerDate2,
    executingNewSearch,
    setExecutingNewSearch,
    setCurrentPage,
    listItems,
    setListItems,
    tabValue,
    setTabValue,
    startDateSearched,
    setStartDateSearched,
    endDateSearched,
    setEndDateSearched,
    emailPercentage,
    setEmailPercentage,
    smsPercentage,
    setSmsPercentage,
    counters,
    setCounters,
    listItemsFiltered,
    setListItemsFiltered,
    tempSelectedState,
    setTempSelectedState,
    mobileRes,
    tabletRes,
    setCategoryTitle,
    setDetailTitle
  } = props 

  const [loadingMasterData, setLoadingMasterData] = useState(false)
  const [categoriesList, setCategoriesList] = useState([] as any)
  const [detailsList, setDetailsList] = useState([] as any)
  const [masterCategoryAndDetail, setMasterCategoryAndDetail] = useState([] as any)
  const [resultHeader, setResultHeader] = useState<string>('')
  const [totalRegisters, setTotalRegisters] = useState(0)

  const diaAnterior: Date = new Date()
  let auxListItemsFiltered = []

  const addCero = (str: number) => {
    if (str.toString().length === 1) {
      return '0' + str
    } else {
      return str
    }
  }

  const formatDate = (date) => {
    const dateFormat = date.getTime()
    let auxDate = new Date()
    auxDate.setTime(dateFormat)
    return addCero(auxDate.getDate()) + '/' + addCero((auxDate.getMonth() + 1)) + '/' + auxDate.getFullYear()
  }

  const doCounters = (data, auxList?) => {
    let auxTotalCounter = 0
    let auxSentEmailsCounter = 0
    let auxSentSMSCounter = 0
    let auxOpenedURLsCounter = 0

    data.map((item) => {
      auxTotalCounter++
      item.channel === '0' ? auxSentEmailsCounter++ : auxSentSMSCounter++
      item.openUrl === '1' && auxOpenedURLsCounter++
    })

    setCounters({
      ...counters,
      totalCounter: auxTotalCounter,
      sentEmailsCounter: auxSentEmailsCounter,
      sentSMSCounter: auxSentSMSCounter,
      openedURLsCounter: auxOpenedURLsCounter
    })

    setTotalRegisters(auxTotalCounter)
  }

  const handelGetData = () => {
    setIsLoading(true)
    const serviceCategory = getCategoryCode(selectedCategory)
    const serviceDetail = getDetailCode(selectedDetail)
    const serviceDateFrom = formatDate(datepickerDate1)
    setStartDateSearched(serviceDateFrom)
    const serviceDateTo = formatDate(datepickerDate2)
    setEndDateSearched(serviceDateTo)
    let listItemsAux = []

    dispatch(thunkGetUrlMessagesData(serviceCategory, serviceDetail, serviceDateFrom, serviceDateTo, (response) => {
      if (response) {
        doCounters(response, listItemsAux)
        setListItems(response)
      }
      setIsLoading(false)
    }))
    // setListItems(listItemsAux)
  }

  const newSearch = () => {
    tabValue !== 0 && setTabValue(0)  //  Cuando lanzamos una nueva consulta, volvemos a la pestaña de resultados de la consulta si nos encontramos en la pestaña de la gráfica
    setExecutingNewSearch(executingNewSearch ? false : true)
    setCategoryTitle(selectedCategory)
    setDetailTitle(selectedDetail)
    setTempSelectedState(3)

    setCounters({
      totalCounter: 0,
      sentEmailsCounter: 0,
      sentSMSCounter: 0,
      openedURLsCounter: 0
    })

    setCurrentPage(0)
    setEmailPercentage(0)
    setSmsPercentage(0)
    setHeader()
    handelGetData()
  }

  // Devuelve el código de una categoría a partir del literal asociado a ésta
  const getCategoryCode = (category) => {
    if (category === t('sendUrl.dialogSendUrl.dropDownCategories.SUPPLIES')) {
      return 'SUPPLIES'
    }
    else if (category === t('sendUrl.dialogSendUrl.dropDownCategories.BILLS')) {
      return 'BILLS'
    }
    else if (category === t('sendUrl.dialogSendUrl.dropDownCategories.PROVISIONS')) {
      return 'PROVISIONS'
    }
    else if (category === t('sendUrl.dialogSendUrl.dropDownCategories.REQUESTS')) {
      return 'REQUESTS'
    }
    else {
      return ''
    }
  }

  // Devuelve el código de un detalle a partir del literal asociado a éste
  const getDetailCode = (detail) => {
    let detailCode = ''
    if (masterCategoryAndDetail.length > 0) {
      masterCategoryAndDetail.map((masterItem) => {
        if (detail === t(`sendUrl.dialogSendUrl.dropDownDetails.${masterItem.value}`)) {
          detailCode = masterItem.value
        }
      })
    }
    return detailCode
  }

  const setHeader = () => {
    const auxCategory = (selectedCategory !== '' && selectedCategory !== t('clientDigitizationControl.search.searchParameters.allCategories')) ? selectedCategory : t('clientDigitizationControl.search.resumeParameters.allCategories')
    const auxDetail = (selectedDetail !== '' && selectedDetail !== t('clientDigitizationControl.search.searchParameters.allDetails')) ? selectedDetail : t('clientDigitizationControl.search.resumeParameters.allDetails')
    const auxString = auxCategory + ' - ' + auxDetail
    setResultHeader(auxString)
  }

  const handleChangeChannel = (temp: number) => {
    setCurrentPage(0)
    auxListItemsFiltered = []
    setExecutingNewSearch(executingNewSearch ? false : true)
    // Filtramos por envíos hechos por email
    if (temp === 1) {
      listItems.map((item) => {
        item.channel === '0' && auxListItemsFiltered.push(item)
      })
      setListItemsFiltered(auxListItemsFiltered)
      doCounters(auxListItemsFiltered)
    }
    // Filtramos por envíos hechos por SMS
    else if (temp === 2) {
      listItems.map((item) => {
        item.channel === '1' && auxListItemsFiltered.push(item)
      })
      setListItemsFiltered(auxListItemsFiltered)
      doCounters(auxListItemsFiltered)
    }
    // Filtramos por todos los tipos de envío (email y SMS)
    else if (temp === 3) {
      setListItemsFiltered(listItems)
      doCounters(listItems)
    }

    setTempSelectedState(temp)
  }

  const resetFilters = () => {
    setTempSelectedState(3)
    setCurrentPage(0)
    setListItemsFiltered(listItems)
    doCounters(listItems)
    setExecutingNewSearch(executingNewSearch ? false : true)
  }

  // Según la categoría seleccionada, mostramos la lista de detalles correspondientes a dicha categoría en el desplegable de detalle
  useEffect(() => {
    if (selectedCategory && masterCategoryAndDetail.length > 0) {
      setSelectedDetail('')
      const categoryCode = selectedCategory === '' ? selectedCategory : getCategoryCode(selectedCategory)
      const auxDetailsList = []

      masterCategoryAndDetail.map((masterItem) => {
        if (masterItem.key === categoryCode) {
          auxDetailsList.push(t(`sendUrl.dialogSendUrl.dropDownDetails.${masterItem.value}`))
        }
      })

      if (auxDetailsList.length > 0) {
        auxDetailsList.unshift(t('clientDigitizationControl.search.searchParameters.allDetails'))
      }

      setDetailsList(auxDetailsList)
    }
  }, [selectedCategory])

  // Recuperamos la lista de categorías y detalles de la master data
  useEffect(() => {
    setLoadingMasterData(true)
    const auxCategoriesList = [t('clientDigitizationControl.search.searchParameters.allCategories')]
    const auxDetailsList = [t('clientDigitizationControl.search.searchParameters.allDetails')]

    dispatch(thunkGetMasterData('SEND_URL', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), '', (response) => {
      if (response && response.length > 0) {
        setMasterCategoryAndDetail(response)        
        response.map((item) => {
          if (!auxCategoriesList.includes(t(`sendUrl.dialogSendUrl.dropDownCategories.${item.key}`))) {
            auxCategoriesList.push(t(`sendUrl.dialogSendUrl.dropDownCategories.${item.key}`))
          }
          if (!auxDetailsList.includes(t(`sendUrl.dialogSendUrl.dropDownDetails.${item.value}`))) {
            auxDetailsList.push(t(`sendUrl.dialogSendUrl.dropDownDetails.${item.value}`))
          }
        })

        setCategoriesList(auxCategoriesList)
        setDetailsList(auxDetailsList)
      }
      setLoadingMasterData(false)
    }))

    newSearch() // Ejecutar una búsqueda por defecto al acceder a la pantalla
  }, [])

  useEffect(() => {
    if (counters.totalCounter > 0) {
      const auxEmailPercentage = (counters.sentEmailsCounter * 100) / counters.totalCounter
      setEmailPercentage(auxEmailPercentage.toFixed(0))
      const auxSmsPercentage = (counters.sentSMSCounter * 100) / counters.totalCounter
      setSmsPercentage(auxSmsPercentage.toFixed(0))
    }
  }, [counters])

  useEffect(() => {
    setListItemsFiltered(listItems)
  }, [listItems])
     
  return (
    <Grid container className={styles.searchContainer}>
      <Grid container className={styles.flexContainerOne}>
        <Grid container md={6} sm={10} xs={12} className={styles.searchCont}>
          <Grid item sm={12} className={styles.blueTitle}>{t('clientDigitizationControl.search.searchParameters.title')}</Grid>
          <Grid container direction='column'>
            <Grid item className={styles.inputTitle}>{t('clientDigitizationControl.search.searchParameters.selector1')}</Grid>
            <Select
              className={styles.inputV2}
              label={selectedCategory === '' ? t('clientDigitizationControl.search.searchParameters.select') : ''}
              values={categoriesList}
              value={selectedCategory}
              onChange={(e) => {setSelectedCategory(e.target.value)}}
              disabled={loadingMasterData || categoriesList.length === 0}
              isLoading={loadingMasterData}
            />
          </Grid>
          <Grid container direction='column'>
            <Grid item className={styles.inputTitle}>{t('clientDigitizationControl.search.searchParameters.selector2')}</Grid>            
            <Select
              className={styles.inputV2}
              label={selectedDetail === '' ? t('clientDigitizationControl.search.searchParameters.select') : ''}
              values={detailsList}
              value={selectedDetail}
              onChange={(e) => {setSelectedDetail(e.target.value)}}
              disabled={selectedCategory === '' || loadingMasterData || detailsList.length === 0}
              isLoading={loadingMasterData}
            />
          </Grid>
          <Grid container md={12} spacing={2}>
            <Grid item md={4}>
              <Grid className={styles.inputTitle}>{t('clientDigitizationControl.search.searchParameters.dateFrom')}</Grid>
              <DatepickerV3 selectedDate={datepickerDate1} handleChange={setDatepickerDate1} size='m' maxDate={datepickerDate2} dateFormat={'dd/MM/yyyy'} popperPlacement={mobileRes ? 'bottom-start' : 'right-center'} />
            </Grid>
            <Grid item md={4}>
              <Grid className={styles.inputTitle}>{t('clientDigitizationControl.search.searchParameters.dateTo')}</Grid>
              <DatepickerV3 selectedDate={datepickerDate2} handleChange={setDatepickerDate2} size='m' minDate={datepickerDate1} maxDate={diaAnterior} dateFormat={'dd/MM/yyyy'} popperPlacement={mobileRes ? 'bottom-start' : 'right-center'} />
            </Grid>
          </Grid>
          <Grid container className={styles.consultCont}>
            <Button
              text={t('clientDigitizationControl.search.searchParameters.searchButton')}
              color='primary'
              variant='contained'
              onClick={() => newSearch()}
            />
          </Grid>

          <Grid item sm={12} className={`${styles.blueTitle} marginTop`}>{t('clientDigitizationControl.search.searchParameters.filterBy') + ':'}</Grid>
          <Grid container md={12} spacing={2}>
            <Grid item md={4}>
              <Grid className={styles.smallTitle}>{t('clientDigitizationControl.search.searchParameters.channel') + ':'}</Grid>
            </Grid>
            <Grid container md={7} className={styles.buttonsContainer} spacing={1}>
              <Grid item>
                <div className={`radioButton ${styles.radioButton} ${tempSelectedState === 1 && 'active'}`} onClick={() => {tempSelectedState !== 1 && handleChangeChannel(1)}} />
                <div className={styles.radioButtonText}><img className={styles.icon} src={EmailIcon} alt='' />{t('clientDigitizationControl.search.searchParameters.mail')}</div>
              </Grid>
              <Grid item>
                <div className={`radioButton ${styles.radioButton} ${tempSelectedState === 2 && 'active'}`} onClick={() => {tempSelectedState !== 2 && handleChangeChannel(2)}} />
                <div className={styles.radioButtonText}><img className={styles.icon} src={MobileIcon} alt='' />{t('clientDigitizationControl.search.searchParameters.sms')}</div>
              </Grid>
              <Grid item>
                <div className={`radioButton ${styles.radioButton} ${tempSelectedState === 3 && 'active'}`} onClick={() => {tempSelectedState !== 3 && handleChangeChannel(3)}} />
                <div className={styles.radioButtonText}>{t('clientDigitizationControl.search.searchParameters.allChannels')}</div>
              </Grid>
            </Grid>
            <Grid container md={12} spacing={2} className={styles.resetContainer}>
              <Grid item md={4}>
                <Grid container className={styles.searchButton} onClick={() => resetFilters()}>
                  <img className={styles.updateIcon} src={UpdateIcon} alt='' />
                  <span className={styles.updateText}>{t('clientDigitizationControl.search.searchParameters.resetFilters')}</span>              
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container md={6} sm={10} xs={12} className={styles.stadisticsCont}>
          <Grid container className={styles.box} md={11} direction='column'>
            <Grid item className={styles.resultHeader} >
              {resultHeader}
            </Grid>
            <Grid item className={styles.dateRange} >
              {startDateSearched + t('common.conjunctions.to') + endDateSearched}
            </Grid>

            <ClientDigitizationResumeGraph
              counters={counters} 
              totalRegisters={totalRegisters}
              tabletRes={tabletRes}
              mobileRes={mobileRes}
            />

            <Grid item className={styles.separator} />

            <Grid container className={styles.ratioContainer} direction='row'>
              <Grid container className={styles.textAndValueCont}>
                <Grid item>{'% ' + t('clientDigitizationControl.search.resumeParameters.emailPercentage')}</Grid>
                <Grid item>{emailPercentage + '%'}</Grid>
              </Grid>

              <Grid item className={styles.separator} />

              <Grid container className={`${styles.textAndValueCont} margin`}>
                <Grid item>{'% ' + t('clientDigitizationControl.search.resumeParameters.SMSPercentage')}</Grid>
                <Grid item>{smsPercentage + '%'}</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}