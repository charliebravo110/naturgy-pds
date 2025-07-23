import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { pdf } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'

import CertificateSelection from './certificate-selection/CertificateSelection'
import Toolbar from './toolbar/Toolbar'
import ConsumptionsPDF from './consumptions-pdf/ConsumptionsPDF'
import InvoicedConsumptionPDF from './invoiced-consumption-pdf/InvoicedConsumptionPDF'
import BilledReadingsPDF from './billed-readings-pdf/BilledReadingsPDF'

import { formatDate } from '../../../../common/lib/FormatLib'

import { showError } from '../../../../common/store/actions/ErrorActions'
import { thunkGetBillingPeriods, thunkGetConsumptions, thunkGetBillsList } from '../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './Certificates.styles'
import { thunkGetMasterData } from '../../../../provisions/store/actions/ProvisionsThunkActions'
import { isMobileApp, isWeb } from '../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Certificates = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user.profile)
  const delegations = useSelector((state: any) => state.delegations)

  const {
    supplyData,
    setIsLoading,
    setTabValue,
    setNavToMeter,
    billingStartDate,
    setBilingStartDate,
    billingEndDate,
    setBilingEndDate,
  } = props

  const billingPeriodsFakeResponse =
  {
    'count': 21,
    'self': {
      'href': 'string'
    },
    'cups': 'ES0022000008361151CV1F',
    'items': [
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2022-09-08',
        'periodEndDate': '2022-10-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2022-09-08',
        'periodEndDate': '2022-11-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2022-11-11',
        'periodEndDate': '2022-12-07'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2022-12-08',
        'periodEndDate': '2023-01-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-01-11',
        'periodEndDate': '2023-02-09'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-02-10',
        'periodEndDate': '2023-03-08'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-03-09',
        'periodEndDate': '2023-04-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-04-11',
        'periodEndDate': '2023-05-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-05-11',
        'periodEndDate': '2023-06-11'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-06-12',
        'periodEndDate': '2023-07-09'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-07-10',
        'periodEndDate': '2023-08-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-08-11',
        'periodEndDate': '2023-09-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-09-11',
        'periodEndDate': '2023-10-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-10-11',
        'periodEndDate': '2023-11-07'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-11-08',
        'periodEndDate': '2023-12-06'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2023-12-07',
        'periodEndDate': '2024-01-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2024-01-11',
        'periodEndDate': '2024-02-11'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2024-02-12',
        'periodEndDate': '2024-03-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2024-03-11',
        'periodEndDate': '2024-04-10'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2024-04-11',
        'periodEndDate': '2024-05-09'
      },
      {
        'self': {
          'href': 'string'
        },
        'periodStartDate': '2024-05-10',
        'periodEndDate': '2024-06-10'
      }
    ]
  }


  const [type, setType] = useState('consumptions')

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [consumptionDisplay, setConsumptionDisplay] = useState(null)

  // estructura de los períodos
  const defaultData = {
    periods: [
      {
        startDate: '',
        endDate: '',
        consumption: 0
      }
    ],
    totalConsumption: 0
  }

  const isSelfConsumption = supplyData.isSelfConsumption ? true : false

  const [data, setData] = useState(defaultData)
  const [selfConsumptionData, setSelfConsumptionData] = useState<any>()
  
  let consumptionLoaded = false
  let selfConsumptionLoaded = false

  const [billingData, setBillingData] = useState([])

  // const [startDatesList, setStartDatesList] = useState(null)
  // const [endDatesList, setEndDatesList] = useState(null)

  const [documentIsReady, setDocumentIsReady] = useState(false)

  const [selection, setSelection] = useState('')

  const [dateStartBilling, setDateStartBilling] = useState('')

  // isDelegate
  let isDelegate = false

  if (delegations.delegatesInMeList.find(item => item.cups === supplyData.cups)) {
    isDelegate = true
  }

  const resetConsumptionLoaders = () => {
    consumptionLoaded = false
    selfConsumptionLoaded = false
  }

  const handleDownload = () => {
    if (startDate && endDate) {
      // LCS: Enviar evento de GdC a GA - Wave 3
      var auxSelection
      switch (selection) {
        case 'option1':
          auxSelection = 'consumos'
          break;
        case 'option2':
          auxSelection = 'consumos facturados'
          break;
        case 'option3':
          auxSelection = 'lecturas facturadas'
          break;
        case 'option4':
          auxSelection = 'lectura instantanea'
          break;
      }
      sendGAEvent({
        event: 'download',
        section_name: 'mis suministros',
        subsection_name: 'mis certificados de consumo',
        click_text: 'descargar',
        elemet_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        browsing_type: sessionStorage.getItem('browsing_type'),
        cups: supplyData.cups,
        supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
        certificate_type: auxSelection
      });

      // Comprobamos que el rango entre fechas no supere los 2 años
      if (longerThanTwoYears(startDate, endDate)) {
        dispatch(showError('invalidDates', 'downloadCertificates'))
      }
      // Comprobamos que la fecha inicio no sea posterior a la fecha fin
      else if (startDateGraterThanEndDate(startDate, endDate)) {
        dispatch(showError('startDateGraterThanEndDate', 'downloadCertificates'))

        // Opción 1: certificado Consumos
      } else if (selection === 'option1') {
        setIsLoading(true)

        setDocumentIsReady(false)

        setData(defaultData)

        // isSupplantedUser
        let isSupplantedUser = false

        if (delegations.delegatesInMeList.find(item => item.cups === supplyData.cups)) {
          isSupplantedUser = true
        }

        if (isSelfConsumption) {
          dispatch(thunkGetConsumptions(supplyData.cups, 'M', startDate, endDate, supplyData.isGenerator, isSupplantedUser, isDelegate, '1', supplyData.measurementSystem, (selfConsumptionsResponse) => {
            if (selfConsumptionsResponse) {
              if ((
                selfConsumptionsResponse[0] &&
                selfConsumptionsResponse[0].selfConsumptions &&
                selfConsumptionsResponse[0].selfConsumptions.items &&
                selfConsumptionsResponse[0].selfConsumptions.items.length > 0
              )) {
                let auxPeriods = [] as any
                let auxTotalConsumption = 0
                let auxTotalSurplusEnergy = 0

                selfConsumptionsResponse[0].selfConsumptions.items.map(item => {
                  const splittedStartDate = item.date.split('/')
                  const parsedEndDate = new Date(splittedStartDate[2], splittedStartDate[1], 0)

                  let netConsumption
                  let surplusEnergy

                  if (supplyData.isSelfConsumption.collective === 'N') {
                    netConsumption = item.EHCR ? Number(item.EHCR.replace(',', '.')) : 0
                    surplusEnergy = item.EHEX ? Number(item.EHEX.replace(',', '.')) : 0
                  } else {
                    netConsumption = item.EHCRi ? Number(item.EHCRi.replace(',', '.')) : 0
                    surplusEnergy = item.EHEXi ? Number(item.EHEXi.replace(',', '.')) : 0
                  }

                  auxPeriods.push({
                    startDate: item.date,
                    endDate: formatDate(parsedEndDate),
                    netConsumption: netConsumption,
                    surplusEnergy: surplusEnergy
                  })

                  auxTotalConsumption = auxTotalConsumption + netConsumption
                  auxTotalSurplusEnergy = auxTotalSurplusEnergy + surplusEnergy

                  return null
                })

                // ordenar períodos por fecha de inicio
                auxPeriods.sort(function (a, b) {
                  let aa = a.startDate.split('/')
                  aa = aa[2] + '-' + aa[1] + '-' + aa[0]

                  let bb = b.startDate.split('/')
                  bb = bb[2] + '-' + bb[1] + '-' + bb[0]

                  return new Date(aa).getTime() - new Date(bb).getTime()
                })

                setSelfConsumptionData({
                  ...selfConsumptionData,
                  periods: auxPeriods,
                  totalConsumption: auxTotalConsumption,
                  totalSurplusEnergy: auxTotalSurplusEnergy
                })

                selfConsumptionLoaded = true
                if (consumptionLoaded) {
                  setDocumentIsReady(true)
                  resetConsumptionLoaders()
                }

              }
            }
          }))
        }

        // if (supplyData.measurementSystem === 'G' || (supplyData.measurementSystem === 'O' && supplyData.isGenerator === '1')) {
        // suministros de gmv10 o de odi generadores (sin períodos de facturación)
        dispatch(thunkGetConsumptions(supplyData.cups, 'M', startDate, endDate, supplyData.isGenerator, isSupplantedUser, isDelegate, '0', supplyData.measurementSystem, (consumptionsResponse) => {
          if (!consumptionsResponse) {
            consumptionLoaded = true
            setIsLoading(false)
            return
          }
          if (consumptionsResponse.length === 0) {
            // no hay consumos para ese rango de fechas
            dispatch(showError('noConsumptions', 'downloadCertificates'))
            setIsLoading(false)
            return
          }

          setConsumptionDisplay(consumptionsResponse)
          if (!(
            consumptionsResponse[0] &&
            consumptionsResponse[0].consumptions &&
            consumptionsResponse[0].consumptions.items &&
            consumptionsResponse[0].consumptions.items.length > 0
          )) {
            setIsLoading(false)
            return
          }

          let auxPeriods = [] as any
          let auxTotalConsumption = 0

          consumptionsResponse[0].consumptions.items.map(item => {
            const splittedStartDate = item.consumptionDate.split('/')
            const parsedEndDate = new Date(splittedStartDate[2], splittedStartDate[1], 0)

            let consumption

            if (supplyData.isGenerator === '1') {
              consumption = item.activeInput ? Number(item.activeInput.replace(',', '.')) : 0
            } else {
              consumption = item.consumptionValue ? Number(item.consumptionValue.replace(',', '.')) : 0
            }

            auxPeriods.push({
              startDate: item.consumptionDate,
              endDate: formatDate(parsedEndDate),
              consumption: supplyData.isGenerator === '1' ? item.activeInput : item.consumptionValue
            })

            auxTotalConsumption = auxTotalConsumption + consumption

            return null
          })

          // ordenar períodos por fecha de inicio
          auxPeriods.sort(function (a, b) {
            let aa = a.startDate.split('/')
            aa = aa[2] + '-' + aa[1] + '-' + aa[0]

            let bb = b.startDate.split('/')
            bb = bb[2] + '-' + bb[1] + '-' + bb[0]

            return new Date(aa).getTime() - new Date(bb).getTime()
          })

          setData({
            ...data,
            periods: auxPeriods,
            totalConsumption: auxTotalConsumption
          })

          consumptionLoaded = true
          if (isSelfConsumption) {
            if (selfConsumptionLoaded) {
              setDocumentIsReady(true)
              resetConsumptionLoaders()
            }
          } else {
            setDocumentIsReady(true)
            resetConsumptionLoaders()
          }

          setIsLoading(false)
        }))

        // Opción 2: certificado Consumos facturados; u opción 3: certificado Lecturas facturadas
      } else if (selection === 'option2' || selection === 'option3') {
        setIsLoading(true)

        setDocumentIsReady(false)

        // isSupplantedUser
        let isSupplantedUser = false

        if (delegations.delegatesInMeList.find(item => item.cups === supplyData.cups)) {
          isSupplantedUser = true
        }

        dispatch(thunkGetBillsList(supplyData.cups, startDate, endDate, (supplyData.isMigrated === '1' ? true : false), isDelegate, (billsListResponse) => {
          if (billsListResponse && billsListResponse.bills && billsListResponse.bills.bill && billsListResponse.bills.bill.length > 0) {

            setBillingData(billsListResponse.bills.bill)

            setDocumentIsReady(true)
            resetConsumptionLoaders()

            setIsLoading(false)

          }
          else if (billsListResponse && billsListResponse.result && billsListResponse.result.codResult && billsListResponse.result.codResult === '0000') {
            dispatch(showError('noTitular', 'downloadCertificates'))
            setIsLoading(false)
          }
          else {
            setIsLoading(false)
          }
        }))
      }
    }
  }

  const downloadDocument = async () => {
    let blob
    let docName

    if (selection === 'option1') {
      docName = 'Consumos.pdf'
      blob = await pdf(
        <ConsumptionsPDF
          user={user}
          supplyData={supplyData}
          data={data}
          startDate={startDate}
          endDate={endDate}
          selfConsumptionData={selfConsumptionData}
        />
      ).toBlob()
    } else if (selection === 'option2') {
      docName = 'ConsumoFacturado.pdf'
      blob = await pdf(
        <InvoicedConsumptionPDF
          user={user}
          supplyData={supplyData}
          data={billingData}
          startDate={startDate}
          endDate={endDate}
        />
      ).toBlob()
    } else if (selection === 'option3') {
      docName = 'CertificadodeLecturasFacturadas.pdf'
      blob = await pdf(
        <BilledReadingsPDF
          user={user}
          supplyData={supplyData}
          data={billingData}
          startDate={startDate}
          endDate={endDate}
        />
      ).toBlob()
    }

    if (isWeb()) {
      const pdfUrl = window.URL.createObjectURL(blob)
      const tempLink = document.createElement('a')

      tempLink.href = pdfUrl
      tempLink.setAttribute('download', docName)
      tempLink.click()
    } else {
      // downloadLink.click() will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      createFileAndOpenIt({ fileName: docName, contentAsBlob: blob })
    }
  }

  useEffect(() => {
    if (documentIsReady) {
      downloadDocument()
    }
    // eslint-disable-next-line
  }, [documentIsReady])

  useEffect(() => {
    const date = new Date()
    dispatch(thunkGetMasterData('BILLING_DATE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'BILLING_DATE', (response) => {
      if (response && response.length > 0) {
        const year = date.getFullYear() - response[0].value
        const month = date.getMonth() + 1
        const day = date.getDate()
        let formattedDay = day.toString()
        let formattedMonth = month.toString()
        if (day < 10) {
          formattedDay = '0' + day
        }
        if (month < 10) {
          formattedMonth = '0' + month
        }
        setDateStartBilling(formattedDay + '/' + formattedMonth + '/' + year)
      }
    }))
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (dateStartBilling !== '') {
      dispatch(thunkGetBillingPeriods(supplyData.cups, dateStartBilling, formatDate(new Date()), (billingPeriodsResponse) => {

        if (billingPeriodsResponse && billingPeriodsResponse.items.length > 0) {
          // if (billingPeriodsResponse && billingPeriodsResponse.length > 0) {

          let startDatesArray = [] as any
          let endDatesArray = [] as any

          billingPeriodsResponse.items.map((bill, index) => {
            if (bill.periodStartDate && bill.periodStartDate !== '' && startDateGraterThanEndDate(bill.periodStartDate, dateStartBilling)) {
              if (bill.periodStartDate.includes('/')) {
                startDatesArray.push(bill.periodStartDate)
              }
              else {
                startDatesArray.push(formatDate(new Date(bill.periodStartDate)))
              }
            }
            if (bill.periodEndDate && bill.periodEndDate !== '' && startDateGraterThanEndDate(bill.periodEndDate, dateStartBilling)) {
              if (bill.periodEndDate.includes('/')) {
                endDatesArray.push(bill.periodEndDate)
              }
              else {
                endDatesArray.push(formatDate(new Date(bill.periodEndDate)))
              }
            }
          })

          // ordenar períodos por fecha de inicio

          startDatesArray.sort(function (a, b) {
            let aa = a.split('/')
            aa = aa[2] + '-' + aa[1] + '-' + aa[0]

            let bb = b.split('/')
            bb = bb[2] + '-' + bb[1] + '-' + bb[0]

            return new Date(aa).getTime() - new Date(bb).getTime()
          })

          setBilingStartDate(startDatesArray)

          endDatesArray.sort(function (a, b) {
            let aa = a.split('/')
            aa = aa[2] + '-' + aa[1] + '-' + aa[0]

            let bb = b.split('/')
            bb = bb[2] + '-' + bb[1] + '-' + bb[0]

            return new Date(aa).getTime() - new Date(bb).getTime()
          })

          setBilingEndDate(endDatesArray)

        } else if (supplyData.measurementSystem === 'G') {
          var now = new Date()
          var firstDaysOfYear = []
          var lastDaysOfYear = []
          for (var i = 0; i < 24; i++) {
            firstDaysOfYear.push(formatDate(new Date(now.getFullYear(), now.getMonth() - i, 1)))
            lastDaysOfYear.push(formatDate(new Date(now.getFullYear(), now.getMonth() + 1 - i, 0)))
          }
          for (let i = 0; i < firstDaysOfYear.length; i++) {
          }
          firstDaysOfYear.sort(function (a, b) {
            let aa = a.split('/')
            aa = aa[2] + '-' + aa[1] + '-' + aa[0]

            let bb = b.split('/')
            bb = bb[2] + '-' + bb[1] + '-' + bb[0]

            return new Date(aa).getTime() - new Date(bb).getTime()
          })

          setBilingStartDate(firstDaysOfYear)

          lastDaysOfYear.sort(function (a, b) {
            let aa = a.split('/')
            aa = aa[2] + '-' + aa[1] + '-' + aa[0]

            let bb = b.split('/')
            bb = bb[2] + '-' + bb[1] + '-' + bb[0]

            return new Date(aa).getTime() - new Date(bb).getTime()
          })

          setBilingEndDate(lastDaysOfYear)
        }
      })
      )
    }
  }, [dateStartBilling])

  let startDateCompareDay
  let endDateCompareDay
  let startDateCompareMon
  let endDateCompareMon
  let startDateCompareYear
  let endDateCompareYear

  const longerThanTwoYears = (firstDate, finalDate) => {
    startDateCompareDay = firstDate.split('/')[0]
    startDateCompareMon = firstDate.split('/')[1]
    startDateCompareYear = firstDate.split('/')[2]
    endDateCompareDay = finalDate.split('/')[0]
    endDateCompareMon = finalDate.split('/')[1]
    endDateCompareYear = finalDate.split('/')[2]

    if ((startDateCompareYear < (endDateCompareYear - 2)) ||
      (startDateCompareYear == (endDateCompareYear - 2) && startDateCompareMon < endDateCompareMon) ||
      (startDateCompareYear == (endDateCompareYear - 2) && startDateCompareMon == endDateCompareMon && startDateCompareDay < endDateCompareDay)) {
      return true
    } else {
      return false
    }
  }

  let firstDateUSAType
  let finalDateUSAType

  const startDateGraterThanEndDate = (firstDate, finalDate) => {
    if (firstDate.includes('/')) {
      firstDateUSAType = firstDate.split('/')[1] + '/' + firstDate.split('/')[0] + '/' + firstDate.split('/')[2]
    }
    else {
      firstDateUSAType = firstDate
    }

    if (finalDate.includes('/')) {
      finalDateUSAType = finalDate.split('/')[1] + '/' + finalDate.split('/')[0] + '/' + finalDate.split('/')[2]
    }
    else {
      finalDateUSAType = finalDate
    }

    if (new Date(firstDateUSAType) > new Date(finalDateUSAType)) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    setStartDate(null)
    setEndDate(null)
  }, [selection])

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.maxWidthForBigScreens} md={10}>
        <Grid container>
          <Grid container className={classes.title}>
            {t('supplies.suppliesDetails.components.certificates.title')}
          </Grid>
          {/* ADN - 20/05/2024 - PPM 1008089 Incorporar conceptos de autoconsumo en los certificados*/}
          <>
            <Grid container className={classes.description}>
              {t('supplies.suppliesDetails.components.certificates.description')}
            </Grid>

            <CertificateSelection
              selection={selection}
              setSelection={setSelection}
              supplyData={supplyData}
            />

            <Toolbar
              type={type}
              setType={setType}
              supplyData={supplyData}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              handleDownload={handleDownload}
              selection={selection}
              setTabValue={setTabValue}
              setNavToMeter={setNavToMeter}
              startDatesList={billingStartDate}
              endDatesList={billingEndDate}
            />
          </>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Certificates