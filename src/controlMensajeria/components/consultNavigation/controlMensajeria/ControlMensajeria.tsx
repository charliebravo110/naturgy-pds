import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom'

import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './ControlMensajeria.styles';
import Header from './header/Header';
import MensajeriaGraph from '../../mensajeria-graph/MensajeriaGraph'
import HeaderNavigation from '../../header-navigation/HeaderNavigation'
import List from './list/List';
import Spinner from '../../../../common/components/spinner/Spinner';
import { thunkGetListProvinces } from '../../../actions/ControlMensajeriaThunkActions';
import { useDispatch } from 'react-redux';

const ControlMensajeria = (props: any) => {

  const { t } = useTranslation();
  const styles = useStyles({});
  const dispatch = useDispatch()

  const [isLoadingList, setIsLoadingList] = useState<boolean>(false)

  const [statesList, setStatesList] = useState([] as any)
  const [loadingStatesList, setLoadingStatesList] = useState(false)

  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const tabletRes = useMediaQuery('(max-width:768px)')
  const mobileRes = useMediaQuery('(max-width:576px)')

  const [tabValue, setTabValue] = useState(0)

  const [executingNewSearch, setExecutingNewSearch] = useState(false) // Variable para controlar cada vez que se hace una nueva búsqueda
  let token = sessionStorage.getItem('token')
	let userRoles = sessionStorage.getItem('userRoles') || ''
  let userRolesArray = userRoles.split(',')

  // Contadores

  const [counters, setCounters] = useState({
    totalCounter: 0, // TOTAL D15
    totalCounterNoDuplicates: 0,
    registeredCounter: 0, // Usuarios Registrados
    registeredEmailCounter: 0, //
    registeredSMSCounter: 0, //
    notRegisteredCounter: 0, //
    notRegisteredEmailCounter: 0, //
    notRegisteredSMSCounter: 0, //
    correctlySendCounter: 0, //
    correctlySendCounterNoDuplicates: 0,
    notSent: 0,
    notSentNoDuplicates: 0,
    correctlySendEmailCounter: 0, //
    correctlySendSMSCounter: 0, //
    emailTypeCounter: 0, //
    smsTypeCounter: 0, //
    emailErrorCounter: 0, //
    smsErrorCounter: 0, //
    noNameErrorEmailCounter: 0, //
    noNameErrorSMSCounter: 0, //
    ownerRegisteredEmailCounter: 0, //
    ownerRegisteredSMSCounter: 0, //
    oppositionRightEmailCounter: 0, //
    oppositionRightSMSCounter: 0, //
    invalidDocumentEmailCounter: 0, //
    invalidDocumentSMSCounter: 0, //
    invalidCupsEmailCounter: 0, //
    invalidCupsSMSCounter: 0, //
  })

  const [tempSelectedState, setTempSelectedState] = useState(3) // canal o tipo de mensaje

  const [isCheckboxSelectedSendCorrectly, setIsCheckboxSelectedSendCorrectly] = useState(true)
  const [isCheckboxSelectedInvalidEmailAndSMS, setIsCheckboxSelectedInvalidEmailAndSMS] = useState(true)
  // const [isCheckboxSelectedNameAndSurname, setIsCheckboxSelectedNameAndSurname] = useState(true)
  const [isCheckboxSelectedOwnerRegistered, setIsCheckboxSelectedOwnerRegistered] = useState(true)
  const [isCheckboxSelectedOpositionRight, setIsCheckboxSelectedOpositionRight] = useState(true)
  // const [isCheckboxSelectedInvalidDocument, setIsCheckboxSelectedInvalidDocument] = useState(true)
  const [isCheckboxSelectedInvalidCups, setIsCheckboxSelectedInvalidCups] = useState(true)

  const restarDias = (date: any, dias: number) => {
    date.setDate(date.getDate() - dias)
    return date
  }

  const [listItems, setListItems] = useState([] as any)
  const [listItemsFiltered, setListItemsFiltered] = useState([] as any)
  const [datepickerDate1, setDatepickerDate1] = useState<Date>(restarDias(new Date(), 8));
  const [datepickerDate2, setDatepickerDate2] = useState<Date>(restarDias(new Date(), 1));
  const [province, setProvince] = useState<string>('')
  const [town, setTown] = useState<string>('')
  const [registeredPercentage, setRegisteredPercentage] = useState<string>('0')
  const [registeredPercentage2, setRegisteredPercentage2] = useState<string>('0')
  const [startItems, setStartItems] = useState<number>(0)
  const [endItems, setEndItems] = useState<number>(0)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalPagesFilter, setTotalPagesFilter] = useState(0)

  useEffect(() => {
    if (statesList.length === 0) {
      // cargar lista de provincias de nuestra master data
      setLoadingStatesList(true)
      dispatch(thunkGetListProvinces('', (response) => {
        if (response && response.provinces && response.provinces.items && response.provinces.items.length > 0) {
          let selectList = []
          selectList.push(t('controlMensajeria.management.searchResume.all_f'))
          response.provinces.items.map((item) => {
            selectList.push(item.provinceName)
          })
          setStatesList(selectList)
        }
        setLoadingStatesList(false)
      }));
    }
  }, [statesList])

  useEffect(() => {
    setTotalPagesFilter(listItemsFiltered.length === 0 ? 1 : Math.ceil(listItemsFiltered.length / itemsPerPage))
    setTotalItems(listItemsFiltered.length)

    handleSetItems()
  }, [listItemsFiltered.length, itemsPerPage])

  useEffect(() => {
    handleSetItems()
  }, [currentPage, itemsPerPage, listItemsFiltered.length])

  const handleSetItems = () => {
    let AendItems = (currentPage + 1) * itemsPerPage
    let AstartItems = AendItems - itemsPerPage + 1

    if (AendItems > listItemsFiltered.length) {
      AendItems = listItemsFiltered.length
    }

    setEndItems(AendItems)
    setStartItems(AstartItems)
  }

  if (!token) {
		return <Redirect to='/login' />
	  }
	
	  if (!userRolesArray.includes('US_CC')) {
		if (userRolesArray.includes('US_SUPPLYPOINT_CLIENT') || userRolesArray.includes('US_MANAGER') || userRolesArray.includes('US_CC')) {
		  return <Redirect to='/dashboard' />
		} else if (userRolesArray.includes('US_CONSULTANT')) {
		  return <Redirect to='/supplies' />
		} else {
		  return <Redirect to='/landing' />
		}
	  }

  return (
    <>
      {
        isLoadingList &&
        <Spinner fixed={true} />
      }

      <Grid container justifyContent='center' alignItems='center' className={styles.container}>
        <Grid item xs={11} sm={12} md={12} className={styles.maxWidthForBigScreens}>

          <Grid item className={styles.headerTitle}>
            {t('controlMensajeria.management.header.subtitle')}
          </Grid>

          <Grid container justify='flex-start' className={styles.subContainer}>
            <Header
              statesList={statesList}
              loadingStatesList={loadingStatesList}
              listItems={listItems}
              setListItems={setListItems}
              listItemsFiltered={listItemsFiltered}
              setListItemsFiltered={setListItemsFiltered}
              counters={counters}
              setCounters={setCounters}
              registeredPercentage={registeredPercentage}
              registeredPercentage2={registeredPercentage2}
              setRegisteredPercentage={setRegisteredPercentage}
              setRegisteredPercentage2={setRegisteredPercentage2}
              datepickerDate1={datepickerDate1}
              setDatepickerDate1={setDatepickerDate1}
              datepickerDate2={datepickerDate2}
              setDatepickerDate2={setDatepickerDate2}
              province={province}
              setProvince={setProvince}
              town={town}
              setTown={setTown}
              isLoadingList={isLoadingList}
              setIsLoadingList={setIsLoadingList}
              setCurrentPage={setCurrentPage}
              tempSelectedState={tempSelectedState}
              setTempSelectedState={setTempSelectedState}
              isCheckboxSelectedSendCorrectly={isCheckboxSelectedSendCorrectly}
              setIsCheckboxSelectedSendCorrectly={setIsCheckboxSelectedSendCorrectly}
              isCheckboxSelectedInvalidEmailAndSMS={isCheckboxSelectedInvalidEmailAndSMS}
              setIsCheckboxSelectedInvalidEmailAndSMS={setIsCheckboxSelectedInvalidEmailAndSMS}
              isCheckboxSelectedOwnerRegistered={isCheckboxSelectedOwnerRegistered}
              setIsCheckboxSelectedOwnerRegistered={setIsCheckboxSelectedOwnerRegistered}
              isCheckboxSelectedOpositionRight={isCheckboxSelectedOpositionRight}
              setIsCheckboxSelectedOpositionRight={setIsCheckboxSelectedOpositionRight}
              isCheckboxSelectedInvalidCups={isCheckboxSelectedInvalidCups}
              setIsCheckboxSelectedInvalidCups={setIsCheckboxSelectedInvalidCups}
              executingNewSearch={executingNewSearch}
              setExecutingNewSearch={setExecutingNewSearch}
              tabValue={tabValue}
              setTabValue={setTabValue}
              tabletRes={tabletRes}
              mobileRes={mobileRes}
            />

            <HeaderNavigation
              tabValue={tabValue}
              setTabValue={setTabValue}
              tabletRes={tabletRes}
              mobileRes={mobileRes}
            />

            {tabValue === 0 ?
              <List
                listItems={listItemsFiltered}
                setListItems={setListItemsFiltered}
                listItems2={listItems}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                counters={counters}
                registeredPercentage={registeredPercentage}
                registeredPercentage2={registeredPercentage2}
                datepickerDate1={datepickerDate1}
                datepickerDate2={datepickerDate2}
                province={province}
                town={town}
                startItems={startItems}
                endItems={endItems}
                totalItems={totalItems}
                totalPagesFilter={totalPagesFilter}
                tempSelectedState={tempSelectedState}
                isCheckboxSelectedSendCorrectly={isCheckboxSelectedSendCorrectly}
                isCheckboxSelectedInvalidEmailAndSMS={isCheckboxSelectedInvalidEmailAndSMS}
                isCheckboxSelectedOwnerRegistered={isCheckboxSelectedOwnerRegistered}
                isCheckboxSelectedOpositionRight={isCheckboxSelectedOpositionRight}
                isCheckboxSelectedInvalidCups={isCheckboxSelectedInvalidCups}
                executingNewSearch={executingNewSearch}
                tabletRes={tabletRes}
                mobileRes={mobileRes}
              />
            :
              <MensajeriaGraph 
                listItemsFiltered={listItemsFiltered}
              />
            }
          </Grid>

        </Grid>
      </Grid >
    </>
  )
}

export default ControlMensajeria;