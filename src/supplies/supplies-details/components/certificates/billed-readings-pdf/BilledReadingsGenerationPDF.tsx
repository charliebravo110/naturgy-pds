import React, { useState, useEffect } from 'react'
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

const BilledReadingsGenerationPDF = (props: any) => {
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

  let totalEnergy1 = 0
  let totalEnergy2 = 0
  let totalEnergy3 = 0
  let totalEnergySum = 0

  const sumEnergy1 = (num) => {
    let numEnergy1 = parseFloat(num.replace(',', '.'))
    totalEnergy1 += numEnergy1
  }
  const sumEnergy2 = (num) => {
    let numEnergy2 = parseFloat(num.replace(',', '.'))
    totalEnergy2 += numEnergy2
  }
  const sumEnergy3 = (num) => {
    let numEnergy3 = parseFloat(num.replace(',', '.'))
    totalEnergy3 += numEnergy3
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
              {t('supplies.suppliesDetails.components.certificates.document.header.generationReadings')}
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
          <Text style={classes.contractInvoicesTitle}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.title3')}</Text>

          <View style={classes.contractInvoicesTable}>
            <View style={classes.contractInvoicesTableHeader}>
              <View style={classes.contractInvoicesTableHeaderRow}>

                <View style={classes.contractInvoicesTableHeaderRowCell16First} />

                <View style={classes.contractInvoicesTableHeaderRowCell16} />

                <View style={classes.contractInvoicesTableHeaderRowCell13} />

                <View style={classes.contractInvoicesTableHeaderRowCell50Colored}>
                  <Text>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.readingTitle')}</Text>
                </View>
              </View>

              <View style={classes.contractInvoicesTableHeaderRow}>

                <View style={classes.contractInvoicesTableHeaderRowCell16}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.readingDate')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell16}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.reference1')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell13}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.cnae')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell16Colored}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.energy1')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell16Colored}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.reactiveEnergyR1')}</Text>
                </View>

                <View style={classes.contractInvoicesTableHeaderRowCell16Colored}>
                  <Text style={classes.boldSmall}>{t('supplies.suppliesDetails.components.certificates.document.contractInvoices.table.reactiveEnergyR4')}</Text>
                </View>

              </View>
            </View>

            <View style={classes.contractInvoicesTableContainer}>
              {(data && data.periods && data.periods.length > 0) && data.periods.map((item, index) => (
                <View key={index} style={classes.contractInvoicesTableContainerRow}>

                  <View style={classes.contractInvoicesTableContainerRowCell16First}>
                    <Text style={classes.small}>{item.startDate}</Text>
                  </View>

                  <View style={classes.contractInvoicesTableContainerRowCell16}>
                    <Text style={classes.small}>276141192</Text>
                    {/* <Text style={classes.boldSmall}>{item.consumption ? item.consumption.replace(',', '.') : '0'}</Text> */}
                  </View>

                  <View style={classes.contractInvoicesTableContainerRowCell13}>
                    <Text style={classes.small}>T9820</Text>
                  </View>

                  <View style={classes.contractInvoicesTableContainerRowCell16Colored}>
                    <Text style={classes.small}>{supplyData.power}</Text>
                  </View>

                  <View style={classes.contractInvoicesTableContainerRowCell16Colored}>
                    <Text style={classes.small}>{supplyData.power1}</Text>
                  </View>

                  <View style={classes.contractInvoicesTableContainerRowCell16Colored}>
                    <Text style={classes.small}>{supplyData.power2}</Text>
                  </View>

                  {sumEnergy1(supplyData.power)}
                  {sumEnergy2(supplyData.power1)}
                  {sumEnergy3(supplyData.power2)}
                </View>
              ))
              }

              <View style={classes.contractInvoicesTableContainerRow}>

                <View style={classes.contractInvoicesTableContainerRowCell16First} />
                <View style={classes.contractInvoicesTableContainerRowCell16} />

                <View style={classes.contractInvoicesTableContainerRowCell13}>
                  <Text style={classes.boldMedium}>Total</Text>
                </View>

                <View style={classes.contractInvoicesTableContainerRowCell16}>
                  <Text style={classes.boldMedium}>{totalEnergy1}</Text>
                </View>

                <View style={classes.contractInvoicesTableContainerRowCell16}>
                  <Text style={classes.boldMedium}>{totalEnergy2}</Text>
                </View>

                <View style={classes.contractInvoicesTableContainerRowCell16}>
                  <Text style={classes.boldMedium}>{totalEnergy3}</Text>
                </View>
              </View>
            </View>

            <View style={classes.contractInvoicesTableFooter} />

          </View>
        </View>

        <View style={classes.sign}>
          <Image style={classes.signImage} src={Sign} />

          <View style={classes.signTexts}>
            <Text style={classes.signText}>UFD - Atención al cliente de red</Text>

            <Text style={classes.signText}>Tel. 900 111 999</Text>
          </View>
        </View>

        {supplyData.measurementSystem === 'O' ?
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

export default BilledReadingsGenerationPDF
