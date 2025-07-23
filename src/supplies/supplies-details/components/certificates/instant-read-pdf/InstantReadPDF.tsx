import React from 'react'
import {
  Document,
  Page,
  View,
  Text,
  Image
} from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import Logo from '../../../../../assets/img/naturgyLogo.png'
import Sign from '../../../../../assets/img/sello.png'
import SateliteV from '../../../../../assets/img/satelite_vertical.png'
import SateliteH from '../../../../../assets/img/satelite_horizontal.png'

import { formatDate, formatCupsNumber } from '../../../../../common/lib/FormatLib'

import classes from './InstantReadPDF.styles'

const InstantReadPDF = (props: any) => {
  const { t } = useTranslation()

  const {
    user,
    supplyData,
    reading,
    onePhase
  } = props

  const getCurrentDate = () => {
    const currentDate = new Date()

    return formatDate(currentDate)
  }

  const formatNumberES = (numero: Number) => {
    let cadena:string='';
    let sNumero=numero.toString();
     
    if(sNumero.length==4){
         if ( sNumero.includes('.') || sNumero.includes(',')){
           return numero.toLocaleString('es-ES');
         } else {
           let cadena=numero.toLocaleString('es-ES');
           const result = cadena.slice(0, 1) + '.' + cadena.slice(1);
           return result;
         }
     } else {
       return numero.toLocaleString('es-ES');
     }
     
 }

  const getCurrentHour = () => {
    const currentDate = new Date()
    const hour = currentDate.getHours()
    const minutes = currentDate.getMinutes()
    const seconds = currentDate.getSeconds()

    const strHour = hour < 10 ? '0' + hour : hour
    const strMinutes = minutes < 10 ? '0' + minutes : minutes
    const strSeconds = seconds < 10 ? '0' + seconds : seconds

    return strHour + ':' + strMinutes + ':' + strSeconds
  }

  const currentDate = getCurrentDate()
  const currentHour = getCurrentHour()

  let period1 = 0
  let period2 = 0
  let period3 = 0
  let period4 = 0
  let period5 = 0
  let period6 = 0

  const setPeriod = (periodNumber: string, value: any) => {

    if (periodNumber === 'p1') {
      period1 = value
    } else if (periodNumber === 'p2') {
      period2 = value
    } else if (periodNumber === 'p3') {
      period3 = value
    } else if (periodNumber === 'p4') {
      period4 = value
    } else if (periodNumber === 'p5') {
      period5 = value
    } else if (periodNumber === 'p6') {
      period6 = value
    }
  }

  return (
    <Document>
      <Page size='A4' style={classes.page}>
        <View fixed style={classes.sidebar}>
          <Text>UDF Distribución Electricidad, S.A. Dom. Social: Avda. América 38, 28028. Madrid. R.M. de Madrid, T. 39314, F. 31, H. M-503809, N.I.F. A-63222533</Text>
        </View>

        <View fixed style={classes.header}>
          <Text>{t('supplies.suppliesDetails.components.certificates.document.header.label')}
            <Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.header.instantReading')}</Text>
          </Text>

          <Image style={classes.logo} src={Logo} />
        </View>

        <Text
          fixed
          style={classes.pageNumber}
          render={({ pageNumber, totalPages }) => (
            `${t('supplies.suppliesDetails.components.certificates.document.pageNumber')} ${pageNumber}/${totalPages}`
          )}
        />

        <View style={classes.contractData}>
          <Text style={classes.contractDataTitle}>{t('supplies.suppliesDetails.components.certificates.document.contractData.title')}</Text>

          <Text style={classes.contractDataItem}><Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.contractData.client')}</Text> {user && `${user.name} ${user.surName}`}</Text>

          <Text style={classes.contractDataItem}><Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.contractData.nif')}</Text> {user && user.documentNumber}</Text>

          <Text style={classes.contractDataItem}><Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.contractData.cups')}</Text> {supplyData && supplyData.cups && formatCupsNumber(supplyData.cups)}</Text>

          <Text style={classes.contractDataItem}>
            <Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.contractData.address')}</Text>
            {
              (supplyData && supplyData.address) &&
              (supplyData.address.street ? supplyData.address.street : '') +
              ' ' +
              (supplyData.address.number ? supplyData.address.number : '') +
              ', ' +
              (supplyData.address.province ? supplyData.address.province : '') +
              ' ' +
              (supplyData.address.zipCode ? supplyData.address.zipCode : '')
            }
          </Text>
        </View>

        <View style={classes.dates}>
          <Text style={classes.datesItem}><Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.dates.issue')}</Text> {currentDate + '  ' + currentHour}</Text>
        </View>

        <View style={classes.contractInvoices}>
          <Text style={classes.contractInvoicesTitle}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.instantRead')}</Text>

          <View style={classes.contractInvoicesTable}>
            <View style={classes.contractInvoicesTableHeader}>
              <View style={classes.contractInvoicesTableHeaderRow}>
                <Text style={classes.contractInvoicesTableHeaderRowCell100}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.readingTitle')}</Text>
              </View>

              <View style={classes.contractInvoicesTableHeaderRow}>
                <View style={classes.contractInvoicesTableHeaderRowCell20}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.counterIdentifier')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell15}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.date')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell10}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.hour')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell25}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.energy2')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell10}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.periods')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell20}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.reading')}</Text>
                </View>
              </View>
            </View>

            <View style={classes.contractInvoicesTableContainer}>
              <View style={classes.contractInvoicesTableContainerRow}>
                <View style={classes.contractInvoicesTableContainerRowCell20}>
                  <Text style={classes.boldSmall}>{reading.readings[0].meterId}</Text>
                </View>

                <View style={classes.contractInvoicesTableContainerRowCell15}>
                  <Text style={classes.boldSmall}>{currentDate}</Text>
                </View>

                <View style={classes.contractInvoicesTableContainerRowCell10}>
                  <Text style={classes.boldSmall}>{currentHour}</Text>
                </View>

                <View style={classes.contractInvoicesTableContainerRowCell25}>
                  <Text style={classes.boldSmall}>
                    {onePhase ?
                      formatNumberES(parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '421')[0].meterReadings[0].value)/1000)
                      :
                      formatNumberES(parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '507')[0].meterReadings[0].value)/1000) 
                    }
                  </Text>
                </View>
                
                <View style={classes.contractInvoicesTableContainerRowCell10}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.meter.connectSuccess.period.period1')}</Text>
                </View>

                <View style={classes.contractInvoicesTableContainerRowCell20}>
                  <Text style={classes.boldSmall}>{reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '11301')[0].meterReadings[0].value}</Text>
                </View>

                {setPeriod('p1', parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '11301')[0].meterReadings[0].value))}

              </View>

              <View style={classes.contractInvoicesTableContainerRow}>

                <View style={classes.contractInvoicesTableContainerRowCell20} />

                <View style={classes.contractInvoicesTableContainerRowCell15} />

                <View style={classes.contractInvoicesTableContainerRowCell10} />

                <View style={classes.contractInvoicesTableContainerRowCell25} />

                <View style={classes.contractInvoicesTableContainerRowCell10}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.meter.connectSuccess.period.period2')}</Text>
                </View>

                <View style={classes.contractInvoicesTableContainerRowCell20}>
                  <Text style={classes.boldSmall}>{reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '12301')[0].meterReadings[0].value}</Text>
                </View>

                {setPeriod('p2', parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '12301')[0].meterReadings[0].value))}

              </View>

              <View style={classes.contractInvoicesTableContainerRow}>

                <View style={classes.contractInvoicesTableContainerRowCell20} />

                <View style={classes.contractInvoicesTableContainerRowCell15} />

                <View style={classes.contractInvoicesTableContainerRowCell10} />

                <View style={classes.contractInvoicesTableContainerRowCell25} />

                <View style={classes.contractInvoicesTableContainerRowCell10}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.meter.connectSuccess.period.period3')}</Text>
                </View>

                <View style={classes.contractInvoicesTableContainerRowCell20}>
                  <Text style={classes.boldSmall}>{reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '13301')[0].meterReadings[0].value}</Text>
                </View>

                {setPeriod('p3', parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '13301')[0].meterReadings[0].value))}

              </View>

              {!onePhase &&
                <>
                  <View style={classes.contractInvoicesTableContainerRow}>

                    <View style={classes.contractInvoicesTableContainerRowCell20} />

                    <View style={classes.contractInvoicesTableContainerRowCell15} />

                    <View style={classes.contractInvoicesTableContainerRowCell10} />

                    <View style={classes.contractInvoicesTableContainerRowCell25} />

                    <View style={classes.contractInvoicesTableContainerRowCell10}>
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.meter.connectSuccess.period.period4')}</Text>
                    </View>

                    <View style={classes.contractInvoicesTableContainerRowCell20}>
                      <Text style={classes.boldSmall}>{reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '14301')[0].meterReadings[0].value}</Text>
                    </View>

                    {setPeriod('p4', parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '14301')[0].meterReadings[0].value))}

                  </View>

                  <View style={classes.contractInvoicesTableContainerRow}>

                    <View style={classes.contractInvoicesTableContainerRowCell20} />

                    <View style={classes.contractInvoicesTableContainerRowCell15} />

                    <View style={classes.contractInvoicesTableContainerRowCell10} />

                    <View style={classes.contractInvoicesTableContainerRowCell25} />

                    <View style={classes.contractInvoicesTableContainerRowCell10}>
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.meter.connectSuccess.period.period5')}</Text>
                    </View>

                    <View style={classes.contractInvoicesTableContainerRowCell20}>
                      <Text style={classes.boldSmall}>{reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '15301')[0].meterReadings[0].value}</Text>
                    </View>

                    {setPeriod('p5', parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '15301')[0].meterReadings[0].value))}

                  </View>

                  <View style={classes.contractInvoicesTableContainerRow}>

                    <View style={classes.contractInvoicesTableContainerRowCell20} />

                    <View style={classes.contractInvoicesTableContainerRowCell15} />

                    <View style={classes.contractInvoicesTableContainerRowCell10} />

                    <View style={classes.contractInvoicesTableContainerRowCell25} />

                    <View style={classes.contractInvoicesTableContainerRowCell10}>
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.meter.connectSuccess.period.period6')}</Text>
                    </View>

                    <View style={classes.contractInvoicesTableContainerRowCell20}>
                      <Text style={classes.boldSmall}>{reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '16301')[0].meterReadings[0].value}</Text>
                    </View>

                    {setPeriod('p6', parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '16301')[0].meterReadings[0].value))}

                  </View>
                </>
              }

              <View style={classes.contractInvoicesTableContainerRow}>

                <View style={classes.contractInvoicesTableContainerRowCell20} />

                <View style={classes.contractInvoicesTableContainerRowCell15} />

                <View style={classes.contractInvoicesTableContainerRowCell10} />

                <View style={classes.contractInvoicesTableContainerRowCell25} />

                <View style={classes.contractInvoicesTableContainerRowCell10}>
                  <Text style={classes.boldMedium}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.summaryBox.total')}</Text>
                </View>

                <View style={classes.contractInvoicesTableContainerRowCell20}>
                  <Text style={classes.boldMedium}>{(period1 + period2 + period3 + period4 + period5 + period6).toString()}</Text>
                </View>

              </View>

            </View>

          </View>
        </View>

        <View style={classes.sign}>
          <Image style={classes.signImage} src={Sign} />

          <View style={classes.signTexts}>
            <Text style={classes.signText}>UFD - Atención al cliente de red</Text>

            <Text style={classes.signText}>Tel. 900 111 999</Text>
          </View>
        </View>

        {
          (supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') ?
            <View fixed style={classes.sateliteVertical}>
              <Image src={SateliteV} />
            </View>
            :
            <View fixed style={classes.sateliteHorizontal}>
              <Image src={SateliteH} />
            </View>
        }

      </Page>
    </Document>
  )
}

export default InstantReadPDF
