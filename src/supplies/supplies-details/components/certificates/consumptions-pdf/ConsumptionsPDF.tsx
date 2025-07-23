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

import classes from './ConsumptionsPDF.styles'

const ConsumptionsPDF = (props: any) => {
  const { t } = useTranslation()

  const {
    user,
    supplyData,
    data,
    startDate,
    endDate,
    selfConsumptionData
  } = props


  const isSelfConsumption = supplyData.isSelfConsumption ? true : false

  function formatNumber(number) {

    const parts0 = number.toString().split('.');
    const roundedNumber = (parts0.length > 1 && parts0[1].length > 2) ? parseFloat(number.toFixed(2)) : number;

    const parts = roundedNumber.toString().split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return parts.join(',').toString();
  }

  const getCurrentDate = () => {
    const currentDate = new Date()

    return formatDate(currentDate)
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

              {t('supplies.suppliesDetails.components.certificates.document.header.consumption')}

              {/* {
                  supplyData.isGenerator === '0' ?
                    t('supplies.suppliesDetails.components.certificates.document.header.consumption')
                  :
                    t('supplies.suppliesDetails.components.certificates.document.header.generation')
                } */}
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

        <View style={classes.contractInvoices}>
          <Text style={classes.contractInvoicesTitle}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.title')}</Text>

          <View style={classes.contractInvoicesTable}>
            <View style={classes.contractInvoicesTableHeader}>
              <View style={classes.contractInvoicesTableHeaderRow}>
                <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell40Colored : classes.contractInvoicesTableHeaderRowCell50Colored}>

                  <Text>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.billingPeriodGMv10')}</Text>

                  {/* {
                    supplyData.measurementSystem === 'G' ?
                      <Text>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.billingPeriodGMv10')}</Text>
                    : (
                      supplyData.isGenerator === '0' ?
                        <Text>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.billingPeriod')}</Text>
                      :
                        <Text>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.billingPeriodGeneration')}</Text>
                    )
                  } */}
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell50} />
              </View>

              <View style={classes.contractInvoicesTableHeaderRow}>
                <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell20Colored : classes.contractInvoicesTableHeaderRowCell25Colored}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.from')}</Text>
                </View>

                <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell20Colored : classes.contractInvoicesTableHeaderRowCell25Colored}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.to')}</Text>
                </View>

                <View style={(supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') ? (isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell20 : classes.contractInvoicesTableHeaderRowCell25) : (isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell25 : classes.contractInvoicesTableHeaderRowCell50)}>

                  {isSelfConsumption ?
                    <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.netEnergy')}</Text>
                    :
                    <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.energy')}</Text>
                  }

                  {/* {
                    supplyData.isGenerator === '0' ?
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.energy')}</Text>
                    :
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.generationEnergy')}</Text>
                  } */}
                </View>

                {
                  (isSelfConsumption) &&
                  <View style={(supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') ? classes.contractInvoicesTableHeaderRowCell20 : classes.contractInvoicesTableHeaderRowCell25}>
                    <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.surplusEnergy')}</Text>
                  </View>
                }

                {
                  (supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') &&
                  <View style={isSelfConsumption ? classes.contractInvoicesTableHeaderRowCell20 : classes.contractInvoicesTableHeaderRowCell25}>
                    <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.power')}</Text>
                  </View>
                }
              </View>
            </View>

            <View style={classes.contractInvoicesTableContainer}>
              <View style={classes.contractInvoicesTableContainerRow}>
                <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell20 : classes.contractInvoicesTableContainerRowCell25}>
                  <Text style={classes.boldSmall}>{startDate}</Text>
                </View>

                <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell20 : classes.contractInvoicesTableContainerRowCell25}>
                  <Text style={classes.boldSmall}>{endDate}</Text>
                </View>

                <View style={(supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') ? (isSelfConsumption ? classes.contractInvoicesTableContainerRowCell20Colored : classes.contractInvoicesTableContainerRowCell25Colored) : (isSelfConsumption ? classes.contractInvoicesTableContainerRowCell25Colored : classes.contractInvoicesTableContainerRowCell50Colored)}>
                  <Text style={classes.boldSmall}>{isSelfConsumption ? ((selfConsumptionData && selfConsumptionData.totalConsumption) ? formatNumber(selfConsumptionData.totalConsumption) : '0') : ((data && data.totalConsumption) ? formatNumber(data.totalConsumption) : '0')}</Text>
                </View>

                {
                  isSelfConsumption &&
                  <View style={(supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') ? classes.contractInvoicesTableContainerRowCell20Colored : classes.contractInvoicesTableContainerRowCell25Colored}>
                    <Text style={classes.boldSmall}>{(selfConsumptionData && selfConsumptionData.totalSurplusEnergy) ? formatNumber(selfConsumptionData.totalSurplusEnergy) : t('supplies.suppliesDetails.components.certificates.document.doesNotApply')}</Text>
                  </View>
                }

                {
                  (supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') &&
                  <View style={isSelfConsumption ? classes.contractInvoicesTableContainerRowCell20 : classes.contractInvoicesTableContainerRowCell25}>
                    <Text style={classes.boldSmall}>{supplyData && formatNumber(supplyData.power)}</Text>
                  </View>
                }
              </View>
            </View>

          </View>
        </View>

        {
          isSelfConsumption &&
          <View style={classes.red2}>
            <Text >{t('supplies.suppliesDetails.components.certificates.document.netReminder')}</Text>
          </View>
        }


        <View style={classes.red}>
          <Text >{t('supplies.suppliesDetails.components.certificates.document.consumptionsReminder')}</Text>
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

export default ConsumptionsPDF
