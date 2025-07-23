import React, { useState } from 'react'
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

import classes from './InvoicedConsumptionPDF.styles'

const InvoicedConsumptionPDF = (props: any) => {
  const { t } = useTranslation()

  const {
    user,
    supplyData,
    data,
    startDate,
    endDate
  } = props

  const isSelfConsumption = supplyData.isSelfConsumption ? true : false

  const getCurrentDate = () => {
    const currentDate = new Date()

    return formatDate(currentDate)
  }

  let totalEnergy = 0.00
  let totalEnergySum = 0.00

  let bills = []


  let powerCounter = 1
  let netConsumptionCounter = 1
  let surplusEnergyCounter = 1

  let netConsumptionValue = ''
  let surplusEnergyValue = ''

  const sumPowerCounter = () => {
    powerCounter++
  }

  const sumNetConsumptionCounter = (bill) => {
    switch (netConsumptionCounter) {
      case 1:
        netConsumptionValue = bill.netConsumption.consumption1
        break
      case 2:
        netConsumptionValue = bill.netConsumption.consumption2
        break
      case 3:
        netConsumptionValue = bill.netConsumption.consumption3
        break
      case 4:
        netConsumptionValue = bill.netConsumption.consumption4
        break
      case 5:
        netConsumptionValue = bill.netConsumption.consumption5
        break
      case 6:
        netConsumptionValue = bill.netConsumption.consumption6
        break
    }
    netConsumptionCounter++
  }

  const sumSurplusEnergyCounter = (bill) => {
    switch (surplusEnergyCounter) {
      case 1:
        surplusEnergyValue = bill.surplusEnergy.energy1
        break
      case 2:
        surplusEnergyValue = bill.surplusEnergy.energy2
        break
      case 3:
        surplusEnergyValue = bill.surplusEnergy.energy3
        break
      case 4:
        surplusEnergyValue = bill.surplusEnergy.energy4
        break
      case 5:
        surplusEnergyValue = bill.surplusEnergy.energy5
        break
      case 6:
        surplusEnergyValue = bill.surplusEnergy.energy6
        break
    }
    surplusEnergyCounter++
  }

  const resetPowerCounter = () => {
    powerCounter = 1
  }

  const resetNetConsumptionCounter = () => {
    netConsumptionCounter = 1
  }

  const resetSurplusEnergyCounter = () => {
    surplusEnergyCounter = 1
  }

  const formatNumberES = (numero: Number) => {
    let cadena: string = '';
    let sNumero = numero.toString();

    if (sNumero.length == 4) {
      if (sNumero.includes('.') || sNumero.includes(',')) {
        return numero.toLocaleString('es-ES');
      } else {
        let cadena = numero.toLocaleString('es-ES');
        const result = cadena.slice(0, 1) + '.' + cadena.slice(1);
        return result;
      }
    } else {
      return numero.toLocaleString('es-ES');
    }

  }

  function sumarValores(obj, index, length, billNum) {
    let suma = 0;

    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        let numero = Number(obj[key]);
        if (!isNaN(numero)) {
          suma += numero;
        }
      }
    }

    totalEnergy = suma;

    if ((index + 1) === length) {
      let bill = {
        code: billNum,
        energy: totalEnergy
      }

      bills.push(bill)

      totalEnergySum += totalEnergy;
    }
  }

  const sumEnergy = (energy, index, length, billNum) => {

    let auxEnergy = ((energy.toString()).replace(/\s/g, '') == '' || !energy) ? 0 : energy

    // Si la potencia entrante tiene decimales, la redondeamos a 2 decimales
    if (auxEnergy % 1 !== 0) {
      auxEnergy = auxEnergy.toFixed(2)
    }

    totalEnergy = index === 0 ? auxEnergy : (parseFloat(totalEnergy.toString()) + parseFloat(auxEnergy))

    if ((index + 1) === length) {
      let bill = {
        code: billNum,
        energy: totalEnergy
      }

      bills.push(bill)

      totalEnergySum += parseFloat(totalEnergy.toString())
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
      case '1.18.0':
        return 'P0'
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
        return ''
    }
  }

  let maxPowerInfo = {
    energy: '',
    day: '',
    hour: ''
  }

  const getMaxPowerInfo = (code, meters) => {

    maxPowerInfo.energy = ''

    let maxPowerCode = ''

    switch (code) {
      case '1.18.0':
        maxPowerCode = '1.16.0.01'
        break
      case '1.18.1':
        maxPowerCode = '1.16.1.01'
        break
      case '1.18.2':
        maxPowerCode = '1.16.2.01'
        break
      case '1.18.3':
        maxPowerCode = '1.16.3.01'
        break
      case '1.18.4':
        maxPowerCode = '1.16.4.01'
        break
      case '1.18.5':
        maxPowerCode = '1.16.5.01'
        break
      case '1.18.6':
        maxPowerCode = '1.16.6.01'
        break
    }

    meters.map((meter, index) => {
      let consumption
      if (meter.measurings.measuring && meter.measurings.measuring.length > 0) {
        meter.measurings.measuring.map((measuring, index) => {
          if (measuring.code && measuring.code === maxPowerCode) {

            if ((measuring.consumption.toString()).replace(/\s/g, '') == '') {
              maxPowerInfo.energy = ''
            }
            else if (measuring.consumption % 1 !== 0) {
              consumption = ((measuring.consumption.toString()).replace(',', '.'))
              maxPowerInfo.energy = Number(consumption).toFixed(2)
            }
            else {
              maxPowerInfo.energy = measuring.consumption
            }
          }
        })
      }
    })
  }

  let hasPeriods = false

  const checkPeriods = (measurings) => {

    measurings.map((measuring, index) => {
      if (measuring.code === '1.18.0' ||
        measuring.code === '1.18.1' ||
        measuring.code === '1.18.2' ||
        measuring.code === '1.18.3' ||
        measuring.code === '1.18.4' ||
        measuring.code === '1.18.5' ||
        measuring.code === '1.18.6'
      ) {
        hasPeriods = true
      }
    })
  }

  const translateDate = (date) => {
    if (date.includes('/')) {
      return date
    }
    else {
      return formatDate(new Date(date))
    }
  }

  const translateRegister = (register) => {
    if (register === 'REAL') {
      return 'REAL'
    }
    else if (register === 'FIRME') {
      return 'REAL'
    }
    else if (register === 'ESTIMADA') {
      return 'ESTIMADO'
    }
    else if (register === 'REAL    ') {
      return 'REAL'
    }
    else if (register === 'ESTIMADA    ') {
      return 'ESTIMADA'
    }
    else {
      return ''
    }
  }

  function eliminarCerosYAgregarComas(str) {
    // Eliminar los ceros a la izquierda
    const numeroSinCeros = Number(str);

    // Devolver el número con comas para separar los decimales
    return numeroSinCeros.toLocaleString();
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
              {t('supplies.suppliesDetails.components.certificates.document.header.invoicedConsumption')}
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
          <Text style={classes.datesItem}><Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.dates.issue')}</Text> {getCurrentDate()}</Text>

          <Text style={classes.datesItem}><Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.dates.start')}</Text> {startDate}</Text>

          <Text style={classes.datesItem}><Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.dates.end')}</Text> {endDate}</Text>
        </View>

        <View style={isSelfConsumption ? classes.contractInvoicesSelfConsumption : classes.contractInvoices}>
          <Text style={classes.contractInvoicesTitle}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.title2')}</Text>

          <View style={isSelfConsumption ? classes.contractInvoicesTableSelfConsumption : classes.contractInvoicesTable}>

            {
              (data && data.length > 0) && data.map((bill, index) => (
                <>

                  {/* Comprobamos los códigos de cada lectura para determinar si se debe o no mostrar la factura actual (1.18.1 [ENER. ACTIVA P1 A+], 1.18.2 [ENER. ACTIVA P2 A+], etc) */}
                  {(
                    bill &&
                    bill.meters &&
                    bill.meters.meter.map((meter, index) => {
                      meter.measurings &&
                        meter.measurings.measuring &&
                        meter.measurings.measuring.length > 0 &&
                        checkPeriods(meter.measurings.measuring)
                    })
                  )}

                  {hasPeriods &&

                    <>
                      <View style={classes.contractInvoicesTableHeader}>
                        <View style={classes.contractInvoicesTableHeaderRow}>

                          <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell106 : classes.contractInvoicesTableHeaderRowCell30} />

                          <View style={classes.contractInvoicesTableHeaderRowCell15}>
                            <Text>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.billingPeriod')}</Text>
                          </View>

                          <View style={classes.contractInvoicesTableHeaderRowCell23} />

                          <View style={classes.contractInvoicesTableHeaderRowCell23V2} />



                          <View style={classes.contractInvoicesTableHeaderRowCell23V2} />



                          {/* <View style={classes.contractInvoicesTableHeaderRowCell76} /> */}


                        </View>

                        <View style={classes.contractInvoicesTableHeaderRow}>

                          <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell11 : classes.contractInvoicesTableHeaderRowCell76}>
                            <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.reference')}</Text>
                          </View>

                          <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell11 : classes.contractInvoicesTableHeaderRowCell76}>
                            <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.from')}</Text>
                          </View>

                          <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell11 : classes.contractInvoicesTableHeaderRowCell76}>
                            <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.to')}</Text>
                          </View>

                          <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell11 : classes.contractInvoicesTableHeaderRowCell76} >
                            <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.method')}</Text>
                          </View>

                          <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell11 : classes.contractInvoicesTableHeaderRowCell76}>
                            <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.periods')}</Text>
                          </View>

                          {
                            isSelfConsumption ?
                              <View style={classes.contractInvoicesTableHeaderRowCell11}>
                                <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.netEnergy')}</Text>
                              </View>
                              :
                              <View style={classes.contractInvoicesTableHeaderRowCell76}>
                                <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.energy')}</Text>
                              </View>
                          }

                          {
                            isSelfConsumption &&
                            <View style={classes.contractInvoicesTableHeaderRowCell11}>
                              <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.surplusEnergy')}</Text>
                            </View>
                          }

                          {
                            supplyData.measurementSystem === 'O' ?
                              <>
                                <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell11V2 : classes.contractInvoicesTableHeaderRowCell76V2}>
                                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.powerTitle')}</Text>
                                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.contractPower')}</Text>
                                  <Text style={classes.boldSmall}>({t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.kw')})</Text>
                                </View>
                                <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell11V2 : classes.contractInvoicesTableHeaderRowCell76V2}>
                                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.powerTitle')}</Text>
                                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.demandedPower')}</Text>
                                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.facturedPower')}</Text>
                                  <Text style={classes.boldSmall}>({t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.kw')})</Text>
                                </View>
                              </>
                              :
                              <>
                                <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell11V2 : classes.contractInvoicesTableHeaderRowCell76V2}>
                                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.powerTitle')}</Text>
                                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.contractPower')}</Text>
                                  <Text style={classes.boldSmall}>({t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.kw')})</Text>
                                </View>
                                <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell11V2 : classes.contractInvoicesTableHeaderRowCell76V2}>
                                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.powerTitle')}</Text>
                                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.demandedPower')}</Text>
                                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.facturedPower')}</Text>
                                  <Text style={classes.boldSmall}>({t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.kw')})</Text>
                                </View>
                              </>
                          }

                        </View>
                      </View>

                      <View style={classes.contractInvoicesTableContainer}>
                        {
                          // (bill && bill.meters && bill.meters.meter[0] && bill.meters.meter[0].measurings && bill.meters.meter[0].measurings.measuring && bill.meters.meter[0].measurings.measuring.length > 0) &&
                          // filteredMeasurings(bill.meters.meter[0].measurings.measuring).map((measuring, index) => (
                          (bill && bill.meters && bill.meters.meter && bill.meters.meter.length > 0) &&
                          filteredMeasurings(bill.meters.meter).map((measuring, index) => (
                            <View key={index} style={classes.contractInvoicesTableContainerRow}>
                              <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell11 : classes.contractInvoicesTableContainerRowCell76}>
                                <Text style={classes.small}>{bill.contractRef && bill.contractRef}</Text>
                              </View>

                              <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell11 : classes.contractInvoicesTableContainerRowCell76}>
                                <Text style={classes.boldSmall}>{bill.startDate && translateDate(bill.startDate)}</Text>
                              </View>

                              <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell11 : classes.contractInvoicesTableContainerRowCell76}>
                                <Text style={classes.boldSmall}>{bill.endDate && translateDate(bill.endDate)}</Text>
                              </View>

                              <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell11 : classes.contractInvoicesTableContainerRowCell76}>
                                {(measuring.measuringType && measuring.measuringType !== '') ?
                                  <Text style={classes.small}>{translateRegister(measuring.measuringType)}</Text>
                                  :
                                  <Text style={classes.small} />
                                }
                              </View>

                              <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell11 : classes.contractInvoicesTableContainerRowCell76}>
                                <Text style={classes.boldSmall}>{translatePeriod(measuring.code)}</Text>
                              </View>

                              <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell11 : classes.contractInvoicesTableContainerRowCell76}>
                                {
                                  isSelfConsumption ?
                                    bill.netConsumption ?
                                      <Text style={classes.boldSmall}>
                                        {sumNetConsumptionCounter(bill)}
                                        {netConsumptionValue && netConsumptionValue !== '0' &&
                                          netConsumptionValue === 'Error' ?
                                          t('supplies.suppliesDetails.components.certificates.document.noData')
                                          :
                                          (netConsumptionValue === '' ?
                                            ''
                                            :
                                            formatNumberES(parseFloat(netConsumptionValue))
                                          )
                                        }
                                      </Text>
                                      :
                                      <Text style={classes.boldSmall}>
                                        {measuring.netConsumption !== '0' && measuring.netConsumption &&
                                          ((measuring.netConsumption.toString()).replace(/\s/g, '') == '' ?
                                            ''
                                            :
                                            measuring.netConsumption % 1 !== 0 ?
                                              formatNumberES(parseFloat((measuring.netConsumption).toFixed(2)))
                                              :
                                              formatNumberES(parseFloat(measuring.netConsumption))
                                          )
                                        }
                                      </Text>
                                    :
                                    <Text style={classes.boldSmall}>
                                      {measuring.consumption !== '0' && measuring.consumption &&
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
                                }
                              </View>

                              {
                                isSelfConsumption && (
                                  bill.surplusEnergy ?
                                    <View style={classes.contractInvoicesTableContainerRowCell11}>
                                      {sumSurplusEnergyCounter(bill)}
                                      <Text style={classes.boldSmall}>
                                        {surplusEnergyValue !== '0' &&
                                          (surplusEnergyValue === '' ?
                                            t('supplies.suppliesDetails.components.certificates.document.doesNotApply')
                                            :
                                            (surplusEnergyValue.toString()).replace(/\s/g, '') == 'Error' ?
                                              t('supplies.suppliesDetails.components.certificates.document.noData')
                                              :
                                              eliminarCerosYAgregarComas(surplusEnergyValue)
                                          )
                                        }
                                      </Text>
                                    </View>
                                    :
                                    <View style={classes.contractInvoicesTableContainerRowCell11}>
                                      <Text style={classes.boldSmall}>
                                        {measuring.surplusEnergy !== '0' &&
                                          (measuring.surplusEnergy == '' ?
                                            t('supplies.suppliesDetails.components.certificates.document.doesNotApply')
                                            :
                                            (measuring.surplusEnergy.toString()).replace(/\s/g, '') == 'Error' ?
                                              t('supplies.suppliesDetails.components.certificates.document.noData')
                                              :
                                              measuring.surplusEnergy % 1 !== 0 ?
                                                formatNumberES(parseFloat((measuring.surplusEnergy).toFixed(2)))
                                                :
                                                formatNumberES(parseFloat(measuring.surplusEnergy))
                                          )
                                        }
                                      </Text>
                                    </View>
                                )
                              }

                              {/* Obtenemos la información de la máxima potencia demandada */}
                              {getMaxPowerInfo(measuring.code, bill.meters.meter)}

                              {/* <View style={classes.contractInvoicesTableContainerRowCell76}>
                                <Text style={classes.small}>{bill.contractPower.power1}</Text>
                              </View> */}

                              <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell11V2 : classes.contractInvoicesTableContainerRowCell76V2}>
                                <Text style={classes.small}>{powerCounter === 1 ? formatNumberES(bill.contractPower.power1) : powerCounter === 2 ? formatNumberES(bill.contractPower.power2) : powerCounter === 3 ? formatNumberES(bill.contractPower.power3) : powerCounter === 4 ? formatNumberES(bill.contractPower.power4) : powerCounter === 5 ? formatNumberES(bill.contractPower.power5) : powerCounter === 6 ? formatNumberES(bill.contractPower.power6) : ''}</Text>
                              </View>

                              <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell11V2 : classes.contractInvoicesTableContainerRowCell76V2}>
                                <Text style={classes.small}>{powerCounter === 1 ? formatNumberES(bill.demandedPower.power1) : powerCounter === 2 ? formatNumberES(bill.demandedPower.power2) : powerCounter === 3 ? formatNumberES(bill.demandedPower.power3) : powerCounter === 4 ? formatNumberES(bill.demandedPower.power4) : powerCounter === 5 ? formatNumberES(bill.demandedPower.power5) : powerCounter === 6 ? formatNumberES(bill.demandedPower.power6) : ''}</Text>
                              </View>

                              {sumPowerCounter()}

                              {/*<View style={classes.contractInvoicesTableContainerRowCell76}>
                              <Text style={classes.small}>{maxPowerInfo.day}</Text>
                            </View>

                            <View style={classes.contractInvoicesTableContainerRowCell76}>
                              <Text style={classes.small}>{maxPowerInfo.hour}</Text>
                            </View>*/}

                              {isSelfConsumption ?
                                bill.netConsumption ?
                                  sumarValores(bill.netConsumption, index, filteredMeasurings(bill.meters.meter).length, bill.billNumber)
                                  :
                                  sumEnergy(measuring.netConsumption, index, filteredMeasurings(bill.meters.meter).length, bill.billNumber)
                                :
                                sumEnergy(measuring.consumption, index, filteredMeasurings(bill.meters.meter).length, bill.billNumber)
                              }

                            </View>

                          ))
                        }

                        {resetPowerCounter()}
                        {resetNetConsumptionCounter()}
                        {resetSurplusEnergyCounter()}

                        <View style={classes.contractInvoicesTableContainerRow}>

                          <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell44 : classes.contractInvoicesTableContainerRowCell53} />

                          <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell11 : classes.contractInvoicesTableContainerRowCell76}>
                            <Text style={classes.boldMedium}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.total')}</Text>
                          </View>

                          <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell11 : classes.contractInvoicesTableContainerRowCell76}>
                            <Text style={classes.boldMedium}>{formatNumberES(totalEnergy)}</Text>
                          </View>

                          <View style={classes.contractInvoicesTableContainerRowCell30} />

                        </View>
                      </View>

                      <View style={classes.contractInvoicesTableFooter} />

                    </>

                  }

                </>
              ))}
          </View>
        </View>

        {
          isSelfConsumption &&
          <View style={classes.red}>
            <Text >{t('supplies.suppliesDetails.components.certificates.document.billsReminder')}</Text>
          </View>
        }


        <View style={classes.summaryBox}>
          <View style={classes.summaryHeader}>
            <View style={classes.summaryTitleCont}>
              <Text style={classes.medium}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.summaryBox.title') + ' ' + startDate + ' ' + t('supplies.suppliesDetails.components.certificates.document.contractInvoices.summaryBox.title2') + ' ' + endDate}</Text>
            </View>

            <View style={classes.splitSummary}>
              <View style={classes.halfHeader}>
                <Text style={classes.boldMedium}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.summaryBox.billNumber')}</Text>
              </View>

              <View style={classes.halfHeader}>
                <Text style={classes.boldMedium}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.summaryBox.consumedEnergy')}</Text>
              </View>
            </View>

          </View>

          {
            bills.length > 0 && bills.map((bill, index) => (
              <View key={index} style={classes.splitSummary}>
                <View style={classes.halfSummaryData}>
                  <Text style={classes.medium}>{bill.code}</Text>
                </View>

                <View style={classes.halfSummaryData}>
                  <Text style={classes.boldMedium}>{formatNumberES(bill.energy)}</Text>
                </View>
              </View>
            ))
          }

          <View style={classes.splitSummary}>
            <View style={classes.halfSummaryData}>
              <Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.summaryBox.total')}</Text>
            </View>

            <View style={classes.halfSummaryData}>
              <Text style={classes.bold}>{totalEnergySum % 1 === 0 ? formatNumberES(totalEnergySum) : formatNumberES(parseFloat(totalEnergySum.toFixed(2)))}</Text>
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

export default InvoicedConsumptionPDF
