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

import classes from './BilledReadingsPDF.styles'

const BilledReadingsPDF = (props: any) => {
  const { t } = useTranslation()

  const {
    user,
    supplyData,
    data,
    startDate,
    endDate
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


  let totalEnergy1 = 0.00
  let totalEnergyQ1 = 0.00
  let totalEnergyQ4 = 0.00

  const sumEnergy1 = (energy, type, index) => {
    let auxEnergy
    if (energy) {
      auxEnergy = ((energy && energy.toString()).replace(/\s/g, '') !== '' && !isNaN(energy)) ? energy : 0
    } else {
      auxEnergy = (energy && energy !== '' && !isNaN(energy)) ? energy : 0
    }

    if (auxEnergy % 1 !== 0) {
      auxEnergy = auxEnergy.toFixed(2)
    }
    if (type === 'AE') {
      totalEnergy1 = index === 0 ? auxEnergy : (parseFloat(totalEnergy1.toString()) + parseFloat(auxEnergy))
    } else if (type === 'Q1') {
      totalEnergyQ1 = index === 0 ? auxEnergy : (parseFloat(totalEnergyQ1.toString()) + parseFloat(auxEnergy))
    } else if (type === 'Q4') {
      totalEnergyQ4 = index === 0 ? auxEnergy : (parseFloat(totalEnergyQ4.toString()) + parseFloat(auxEnergy))
    }
  }

  const translateDate = (date) => {
    if (date.includes('/')) {
      return date
    }
    else {
      return formatDate(new Date(date))
    }
  }

  const filteredMeasurings = (meters) => {

    let auxMeasurings = []

    meters.map((meter, index) => {
      if (meter.measurings.measuring && meter.measurings.measuring.length > 0) {
        meter.measurings.measuring.map((measuring, index) => {

          if (measuring.code &&
            (measuring.code === '1.18.0' ||
              measuring.code === '1.18.1' ||
              measuring.code === '1.18.2' ||
              measuring.code === '1.18.3' ||
              measuring.code === '1.18.4' ||
              measuring.code === '1.18.5' ||
              measuring.code === '1.18.6')) {

            auxMeasurings.push(measuring)

          }
        })
      }
    })

    if (auxMeasurings && auxMeasurings.length > 0) {
      return auxMeasurings
    }
    else {
      return []
    }

  }

  const translatePeriod = (code) => {
    switch (code) {
      case '1.18.1':
        return 'P1'
      case '1.18.2':
        return 'P2'
      case '1.18.3':
        return 'P3'
      case '1.18.4':
        return 'P4'
      case '1.18.5':
        return 'P5'
      case '1.18.6':
        return 'P6'
      default:
        return 'P0'
    }
  }
  let ReactiveInfoQ1 = {
    energy: 0
  }
  let ReactiveInfoQ4 = {
    energy: 0
  }

  const informarConsumos = (code, meters) => {

    ReactiveInfoQ1.energy = 0
    ReactiveInfoQ4.energy = 0
    let reactiveCodeQ1 = ''
    let reactiveCodeQ4 = ''

    switch (code) {
      case '1.18.0':
        reactiveCodeQ1 = '1.58.0'
        reactiveCodeQ4 = '1.96.0'
        break
      case '1.18.1':
        reactiveCodeQ1 = '1.58.1'
        reactiveCodeQ4 = '1.96.1'
        break
      case '1.18.2':
        reactiveCodeQ1 = '1.58.2'
        reactiveCodeQ4 = '1.96.2'
        break
      case '1.18.3':
        reactiveCodeQ1 = '1.58.3'
        reactiveCodeQ4 = '1.96.3'
        break
      case '1.18.4':
        reactiveCodeQ1 = '1.58.4'
        reactiveCodeQ4 = '1.96.4'
        break
      case '1.18.5':
        reactiveCodeQ1 = '1.58.5'
        reactiveCodeQ4 = '1.96.5'
        break
      case '1.18.6':
        reactiveCodeQ1 = '1.58.6'
        reactiveCodeQ4 = '1.96.6'
        break
    }

    meters.map((meter, index) => {
      if (meter.measurings.measuring && meter.measurings.measuring.length > 0) {
        meter.measurings.measuring.map((measuring, index) => {
          if (measuring.code && measuring.code === reactiveCodeQ1) {

            if ((measuring.consumption.toString()).replace(/\s/g, '') == '') {
              ReactiveInfoQ1.energy = 0
            }
            else if (measuring.consumption % 1 !== 0) {
              ReactiveInfoQ1.energy = (measuring.consumption).toFixed(2)
            }
            else {
              ReactiveInfoQ1.energy = measuring.consumption
            }
          }
          if (measuring.code && measuring.code === reactiveCodeQ4) {
            if ((measuring.consumption.toString()).replace(/\s/g, '') == '') {
              ReactiveInfoQ4.energy = 0
            }
            else if (measuring.consumption % 1 !== 0) {
              ReactiveInfoQ4.energy = (measuring.consumption).toFixed(2)
            }
            else {
              ReactiveInfoQ4.energy = measuring.consumption
            }
          }
        })
      }
    })
  }

  return (
    <Document>
      <Page size='A4' style={classes.page}>
        <View fixed style={classes.sidebar}>
          <Text>UDF Distribución Electricidad, S.A. Dom. Social: Avda. América 38, 28028. Madrid. R.M. de Madrid, T. 39314, F. 31, H. M-503809, N.I.F. A-63222533</Text>
        </View>

        <View fixed style={classes.header}>
          <Text>{t('supplies.suppliesDetails.components.certificates.document.header.label')}
            <Text style={classes.bold}>
              {t('supplies.suppliesDetails.components.certificates.document.header.billedReadings')}
            </Text>
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

            {(supplyData && supplyData.address) &&
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
          <Text style={classes.datesItem}><Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.dates.issue')}</Text>{getCurrentDate()}</Text>

          <Text style={classes.datesItem}><Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.dates.start')}</Text>{startDate}</Text>

          <Text style={classes.datesItem}><Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.dates.end')}</Text>{endDate}</Text>
        </View>

        <View style={classes.contractInvoices}>
          <Text style={classes.contractInvoicesTitle}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.title2')}</Text>


          <View style={classes.contractInvoicesTable}>
            {(data && data.length > 0) && data.map((bill, index) => (
              <>
                <View style={classes.contractInvoicesTableHeader}>
                  <View style={classes.contractInvoicesTableHeaderRow}>

                    <View style={classes.contractInvoicesTableHeaderRowCell15First} />

                    <View style={classes.contractInvoicesTableHeaderRowCell15} />

                    <View style={classes.contractInvoicesTableHeaderRowCell13} />

                    <View style={classes.contractInvoicesTableHeaderRowCell15} />

                    <View style={classes.contractInvoicesTableHeaderRowCell13} />

                    <View style={classes.contractInvoicesTableHeaderRowCell15} />

                    <View style={classes.contractInvoicesTableHeaderRowCell15} />
                  </View>

                  <View style={classes.contractInvoicesTableHeaderRow}>

                    <View style={classes.contractInvoicesTableHeaderRowCell15First}>
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.reference1')}</Text>
                    </View>

                    <View style={classes.contractInvoicesTableHeaderRowCell15}>
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.serialNumber')}</Text>
                    </View>

                    <View style={classes.contractInvoicesTableHeaderRowCell13}>
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.periods')}</Text>
                    </View>

                    <View style={classes.contractInvoicesTableHeaderRowCell15}>
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.readingDate')}</Text>
                    </View>

                    <View style={classes.contractInvoicesTableHeaderRowCell13}>
                    <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.method')}</Text>
                    </View>

                    <View style={classes.contractInvoicesTableHeaderRowCell15}>
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.reading')}</Text>
                    </View>

                    <View style={classes.contractInvoicesTableHeaderRowCell15}>
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.energy1')}</Text>
                    </View>

                  </View>
                </View>

                <View style={classes.contractInvoicesTableContainer}>
                  {
                    (bill && bill.meters && bill.meters.meter && bill.meters.meter.length > 0) &&
                    filteredMeasurings(bill.meters.meter).map((measuring, index) => (

                      <>

                        <View key={index} style={classes.contractInvoicesTableContainerRow}>
                          <View style={classes.contractInvoicesTableContainerRowCell15First}>
                            <Text style={classes.small}>{bill.contractRef}</Text>
                          </View>

                          <View style={classes.contractInvoicesTableContainerRowCell15}>
                            <Text style={classes.small}>{bill.meters.meter[0].serialNumber}</Text>
                          </View>

                          <View style={classes.contractInvoicesTableContainerRowCell13}>
                            <Text style={classes.small}>{translatePeriod(measuring.code)}</Text>
                          </View>

                          <View style={classes.contractInvoicesTableContainerRowCell15}>
                            <Text style={classes.small}>{bill.endDate && translateDate(bill.endDate)}</Text>
                          </View>

                          <View style={classes.contractInvoicesTableContainerRowCell13}>
                            <Text style={classes.small}>{measuring.measuringType}</Text>
                          </View>

                          <View style={classes.contractInvoicesTableContainerRowCell15}>
                            <Text style={classes.small}>{formatNumberES(parseFloat(measuring.reading))}</Text>
                          </View>

                          <View style={classes.contractInvoicesTableContainerRowCell15}>
                            <Text style={classes.small}>
                              {measuring.consumption &&
                                ((measuring.consumption.toString()).replace(/\s/g, '') == '' ?
                                  ''
                                  :
                                  measuring.consumption % 1 !== 0 ?
                                  formatNumberES(parseFloat((measuring.consumption).toFixed(2)))
                                    :
                                    formatNumberES(parseFloat(measuring.consumption))
                                )
                              }
                            </Text>
                          </View>
                          {informarConsumos(measuring.code, bill.meters.meter)}

                          {/* <>
                            <View style={classes.contractInvoicesTableContainerRowCell15Colored}>
                              <Text style={classes.small}>
                                {
                                  ReactiveInfoQ1.energy !== 0 && ReactiveInfoQ1.energy &&
                                  ((ReactiveInfoQ1.energy.toString()).replace(/\s/g, '') == '' ?
                                    ''
                                    :
                                    ReactiveInfoQ1.energy % 1 !== 0 ?
                                      ReactiveInfoQ1.energy.toFixed(2)
                                      :
                                      ReactiveInfoQ1.energy
                                  )
                                }
                              </Text>
                            </View>

                            <View style={classes.contractInvoicesTableContainerRowCell15Colored}>
                              <Text style={classes.small}>
                                {
                                  ReactiveInfoQ4.energy !== 0 && ReactiveInfoQ4.energy &&
                                  ((ReactiveInfoQ4.energy.toString()).replace(/\s/g, '') == '' ?
                                    ''
                                    :
                                    ReactiveInfoQ4.energy % 1 !== 0 ?
                                      ReactiveInfoQ4.energy.toFixed(2)
                                      :
                                      ReactiveInfoQ4.energy
                                  )
                                }
                              </Text>
                            </View>
                          </> */}
                          {sumEnergy1(measuring.consumption, 'AE', index)}
                          {sumEnergy1(ReactiveInfoQ1.energy, 'Q1', index)}
                          {sumEnergy1(ReactiveInfoQ4.energy, 'Q4', index)}
                        </View>
                      </>
                    ))
                  }

                  <View style={classes.contractInvoicesTableContainerRow}>

                    <View style={classes.contractInvoicesTableContainerRowCell15First} />
                    
                    <View style={classes.contractInvoicesTableContainerRowCell15} />

                    

                    <View style={classes.contractInvoicesTableContainerRowCell13}/>
                    
                    <View style={classes.contractInvoicesTableContainerRowCell15} />

                    <View style={classes.contractInvoicesTableContainerRowCell13} />

                    <View style={classes.contractInvoicesTableContainerRowCell15} >
                    <Text style={classes.boldMedium}>Total</Text>
                    </View>

                    <View style={classes.contractInvoicesTableContainerRowCell15}>
                      <Text style={classes.boldMedium}>{totalEnergy1 ? formatNumberES(totalEnergy1) : ' '}</Text>
                    </View>
                  </View>

                </View>

                <View style={classes.contractInvoicesTableFooter} />
              </>
            ))}
          </View>
        </View>

        <View style={classes.sign}>
          <Image style={classes.signImage} src={Sign} />

          <View style={classes.signTexts}>
            <Text style={classes.signText}>UFD - Atención al cliente de red</Text>

            <Text style={classes.signText}>Tel. 900 111 999</Text>
          </View>
        </View>

        {(supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') ?
          <View fixed style={classes.sateliteVertical}>
            <Image src={SateliteV} />
          </View>
          :
          <View fixed style={classes.sateliteHorizontal}>
            <Image src={SateliteH} />
          </View>
        }
      </Page>
    </Document >
  )
}

export default BilledReadingsPDF
