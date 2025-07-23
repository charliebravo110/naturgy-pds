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

import classes from './DocumentPDF.styles'

const DocumentPDF = (props: any) => {
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

  return (
    <Document>
      <Page size='A4' style={classes.page}>
        <View fixed style={classes.sidebar}>
          <Text>UDF Distribución Electricidad, S.A. Dom. Social: Avda. América 38, 28028. Madrid. R.M. de Madrid, T. 39314, F. 31, H. M-503809, N.I.F. A-63222533</Text>
        </View>

        <View fixed style={classes.header}>
          <Text>{t('supplies.suppliesDetails.components.certificates.document.header.label')}
            <Text style={classes.bold}>
                {
                  supplyData.isGenerator === '0' ?
                    t('supplies.suppliesDetails.components.certificates.document.header.consumption')
                  :
                    t('supplies.suppliesDetails.components.certificates.document.header.generation')
                }
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
                <View style={classes.contractInvoicesTableHeaderRowCell50Colored}>
                  {
                    supplyData.measurementSystem === 'G' ?
                      <Text>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.billingPeriodGMv10')}</Text>
                    : (
                      supplyData.isGenerator === '0' ?
                        <Text>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.billingPeriod')}</Text>
                      :
                        <Text>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.billingPeriodGeneration')}</Text>
                    )
                  }
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell50} />
              </View>

              <View style={classes.contractInvoicesTableHeaderRow}>
                <View style={classes.contractInvoicesTableHeaderRowCell25Colored}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.from')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell25Colored}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.to')}</Text>
                </View>

                <View style={(supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') ? classes.contractInvoicesTableHeaderRowCell25 : classes.contractInvoicesTableHeaderRowCell50}>
                  {
                    supplyData.isGenerator === '0' ?
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.energy')}</Text>
                    :
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.generationEnergy')}</Text>
                  }
                </View>

                {
                  (supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') &&
                    <View style={classes.contractInvoicesTableHeaderRowCell25}>
                      <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.power')}</Text>
                    </View>
                }
              </View>
            </View>

            <View style={classes.contractInvoicesTableContainer}>
              {
                (data && data.periods && data.periods.length > 0) && data.periods.map((item, index) => (
                  <View key={index} style={classes.contractInvoicesTableContainerRow}>
                    <View style={classes.contractInvoicesTableContainerRowCell25}>
                      <Text style={classes.boldSmall}>{item.startDate}</Text>
                    </View>

                    <View style={classes.contractInvoicesTableContainerRowCell25}>
                      <Text style={classes.boldSmall}>{item.endDate}</Text>
                    </View>

                    <View style={(supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') ? classes.contractInvoicesTableContainerRowCell25Colored : classes.contractInvoicesTableContainerRowCell50Colored}>
                      <Text style={classes.boldSmall}>{item.consumption ? item.consumption.replace(',', '.') : '0'}</Text>
                    </View>

                    {
                      (supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') &&
                        <View style={classes.contractInvoicesTableContainerRowCell25}>
                          <Text style={classes.boldSmall}>{supplyData && supplyData.power}</Text>
                        </View>
                    }
                  </View>
                ))
              }
            </View>

            <View style={classes.contractInvoicesTableFooter}>
              <View style={classes.contractInvoicesTableFooterRow}>
                <View style={classes.contractInvoicesTableFooterRowCell50}>
                  {
                    supplyData.isGenerator === '0' ?
                      <Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.totalConsumption')}</Text>
                    :
                      <Text style={classes.bold}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.totalGeneration')}</Text>
                  }
                </View>

                <View style={(supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') ? classes.contractInvoicesTableFooterRowCell25 : classes.contractInvoicesTableFooterRowCell50}>
                  <Text style={classes.bold}>{(data && data.totalConsumption) ? +data.totalConsumption.toFixed(6) : '0'} kWh</Text>
                </View>

                {
                  (supplyData.measurementSystem === 'O' && supplyData.isGenerator === '0') &&
                    <View style={classes.contractInvoicesTableFooterRowCell25} />
                }
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

export default DocumentPDF
