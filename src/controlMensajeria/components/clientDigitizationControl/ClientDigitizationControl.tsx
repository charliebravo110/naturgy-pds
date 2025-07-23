import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@material-ui/core';

import Grid from '@material-ui/core/Grid'
import useStyles from './ClientDigitizationControl.styles'
import Spinner from '../../../common/components/spinner/Spinner'
import { Search } from './components/search/Search'
import CDHeaderNavigation from './components/cd-header-navigation/CDHeaderNavigation'
import { TableResult } from './components/table-result/TableResult'
import CDGraph from './components/cd-graph/CDGraph'

export const ClientDigitizationControl = (props:any) => {  
  const { t } = useTranslation()
  const styles = useStyles({})

  const [isLoading, setIsLoading] = useState(false)
  const mobileRes = useMediaQuery('(max-width:576px)')  
  const tabletRes = useMediaQuery('(max-width:768px)')

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedDetail, setSelectedDetail] = useState<string>('')
  const [categoryTitle, setCategoryTitle] = useState('')
  const [detailTitle, setDetailTitle] = useState('')
  const [listItems, setListItems] = useState([] as any)
  const [listItemsFiltered, setListItemsFiltered] = useState([] as any)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [startItems, setStartItems] = useState<number>(0)
  const [endItems, setEndItems] = useState<number>(0)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalPagesFilter, setTotalPagesFilter] = useState(0)
  const [executingNewSearch, setExecutingNewSearch] = useState(false) // Variable para controlar cada vez que se hace una nueva búsqueda
  const [tabValue, setTabValue] = useState(0)
  const [emailPercentage, setEmailPercentage] = useState<string>('0')
  const [smsPercentage, setSmsPercentage] = useState<string>('0')
  const [tempSelectedState, setTempSelectedState] = useState(3) // canal o tipo de mensaje

  const restarDias = (date: any, dias: number) => {
    date.setDate(date.getDate() - dias)
    return date
  }

  const [datepickerDate1, setDatepickerDate1] = useState<Date>(restarDias(new Date(), 8))
  const [datepickerDate2, setDatepickerDate2] = useState<Date>(restarDias(new Date(), 1))
  const [startDateSearched, setStartDateSearched] = useState('')
  const [endDateSearched, setEndDateSearched] = useState('')

  const [counters, setCounters] = useState({
    totalCounter: 0,
    sentEmailsCounter: 0,
    sentSMSCounter: 0,
    openedURLsCounter: 0
  }) 
 
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

  return (
    <>        
      {(isLoading) &&
        <Spinner fixed={true} />
      }

      <Grid container justifyContent='center' alignItems='center' className={styles.container}>
        <Grid item xs={11} sm={12} md={12} className={styles.maxWidthForBigScreens}>
          
          <Grid item className={styles.headerTitle}>
            {t('clientDigitizationControl.title')}
          </Grid>
          <Grid item className={styles.orangeSubtitle}>
            {t('clientDigitizationControl.subTitle1')}
          </Grid>
          <Grid item className={styles.lightSubtitle}>
            {t('clientDigitizationControl.subTitle2')}
          </Grid>

          <Search
            setIsLoading={setIsLoading}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDetail={selectedDetail}
            setSelectedDetail={setSelectedDetail}
            datepickerDate1={datepickerDate1}
            setDatepickerDate1={setDatepickerDate1}
            datepickerDate2={datepickerDate2}
            setDatepickerDate2={setDatepickerDate2}
            executingNewSearch={executingNewSearch}
            setExecutingNewSearch={setExecutingNewSearch}
            setCurrentPage={setCurrentPage}
            listItems={listItems}
            setListItems={setListItems}
            tabValue={tabValue}
            setTabValue={setTabValue}
            startDateSearched={startDateSearched}
            setStartDateSearched={setStartDateSearched}
            endDateSearched={endDateSearched}
            setEndDateSearched={setEndDateSearched}
            emailPercentage={emailPercentage}
            setEmailPercentage={setEmailPercentage}
            smsPercentage={smsPercentage}
            setSmsPercentage={setSmsPercentage}
            counters={counters}
            setCounters={setCounters}
            listItemsFiltered={listItemsFiltered}
            setListItemsFiltered={setListItemsFiltered}
            tempSelectedState={tempSelectedState}
            setTempSelectedState={setTempSelectedState}
            mobileRes={mobileRes}
            tabletRes={tabletRes}
            setCategoryTitle={setCategoryTitle}
            setDetailTitle={setDetailTitle}
          />

          <CDHeaderNavigation
            tabValue={tabValue}
            setTabValue={setTabValue}
            tabletRes={tabletRes}
            mobileRes={mobileRes}
          />

          {tabValue === 0 ?
            <TableResult 
              selectedCategory={selectedCategory}
              selectedDetail={selectedDetail}
              listItems={listItemsFiltered}
              setListItems={setListItemsFiltered}
              listItems2={listItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              startDateSearched={startDateSearched}
              endDateSearched={endDateSearched}
              startItems={startItems}
              endItems={endItems}
              totalItems={totalItems}
              totalPagesFilter={totalPagesFilter}
              executingNewSearch={executingNewSearch}
              tabletRes={tabletRes}
              mobileRes={mobileRes} 
              counters={counters}
              smsPercentage={smsPercentage}
              emailPercentage={emailPercentage}
              categoryTitle={categoryTitle}
              detailTitle={detailTitle}
            />
          :
            <CDGraph 
              listItemsFiltered={listItemsFiltered}
            />
          }

        </Grid>
      </Grid>
    </>
  )
}