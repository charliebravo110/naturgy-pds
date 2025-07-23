import React from 'react'
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link
} from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import Logo from '../../../../../assets/img/naturgyLogo.png'
import Sign from '../../../../../assets/img/sello2.jpg'
import SateliteH from '../../../../../assets/img/satelite_horizontal.png'

import { formatDate } from '../../../../../common/lib/FormatLib'

import classes from './DocumentPDF.styles'

const DocumentPDF = (props: any) => {
  const { t } = useTranslation()

  const {
    user,
    actualDate,
    data,
    currentProvision
  } = props

  const modificationFacilities = 'DOSTYP003'
  const generation = 'DOSTYP002'
  const consumption = 'DOSTYP001'

  const formatDateAndTime = (date) => {
    if (date) {
      const year = date.substring(0, 4)
      const month = date.substring(4, 6)
      const day = date.substring(6, 8)
      const hour = date.substring(8, 10)
      const min = date.substring(10, 12)
      const sec = date.substring(12, 14)
      return (day + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec)
    }
  }

  const adressFormatted = () => {
    if (currentProvision) {
      let address = ''

      if (currentProvision.addressDescription && currentProvision.addressDescription != '' ) {  
          address = currentProvision.streetType + ' ' + currentProvision.addressDescription
      } else {
          address = currentProvision.streetType+' '+currentProvision.streetName+' '+
          currentProvision.num+' '+ currentProvision.stair+' '+ currentProvision.floor+' '+
          currentProvision.door+' '+currentProvision.zipCode+' '+currentProvision.place
      }
      return (address)
    }
  }


  return (
    <Document>
      <Page size='A4' style={classes.page}>
        <View fixed style={classes.sidebar}>
          <Text>UDF Distribución Electricidad, S.A. Dom. Social: Avda. América 38, 28028. Madrid. R.M. de Madrid, T. 39314, F. 31, H. M-503809, N.I.F. A-63222533</Text>
        </View>

        <View fixed style={classes.header}>
          <Text>{t('provisions.provisionsDetails.activitiesList.pdf.header')}
            <Text style={classes.bold}> {t('provisions.provisionsDetails.activitiesList.pdf.description')}</Text>
          </Text>

          <Image style={classes.logo} src={Logo} />
        </View>

        <Text
          fixed
          style={classes.pageNumber}
          render={({ pageNumber, totalPages }) => (
            `${t('provisions.provisionsDetails.activitiesList.pdf.pageNumber')} ${pageNumber}/${totalPages}`
          )}
        />

        <View fixed style={classes.requestData}>
          <Text style={classes.contractDataTitle}>{t('provisions.provisionsDetails.activitiesList.pdf.title')}</Text>

          <Text style={classes.contractDataItem}><Text style={classes.bold}>{t('provisions.provisionsDetails.activitiesList.pdf.data.applicant')}</Text> {user && user.surName}</Text>

          <Text style={classes.contractDataItem}><Text style={classes.bold}>{t('provisions.provisionsDetails.activitiesList.pdf.data.nif')}</Text> {user && user.documentNumber}</Text>

          <Text style={classes.contractDataItem}><Text style={classes.bold}>{t('provisions.provisionsDetails.activitiesList.pdf.data.requestNum')}</Text> {currentProvision && currentProvision.dossierCod && currentProvision.dossierCod}</Text>

          <Text style={classes.contractDataItem}><Text style={classes.bold}>{t('provisions.provisionsDetails.activitiesList.pdf.data.requestType')}
          </Text> {
            currentProvision && currentProvision.idDossierTypeId && currentProvision.idDossierTypeId === modificationFacilities ?
              t('provisions.provisionsDetails.activitiesList.pdf.modificationFacilities')
            :
              currentProvision && currentProvision.idDossierTypeId && currentProvision.idDossierTypeId === generation ?
                t('provisions.provisionsDetails.activitiesList.pdf.generation')
              :
                currentProvision && currentProvision.idDossierTypeId && currentProvision.idDossierTypeId === consumption ?
                  t('provisions.provisionsDetails.activitiesList.pdf.consumption')
                :
                  ''
          }</Text>

          <Text style={classes.contractDataItem}>
            <Text style={classes.bold}>{t('provisions.provisionsDetails.activitiesList.pdf.data.address')}</Text> {
                adressFormatted()}
          </Text>
        </View>

        <View fixed style={classes.upSpace}>
          <Text style={classes.contractDataItem}><Text style={classes.bold}>{t('provisions.provisionsDetails.activitiesList.pdf.data.emissionDate')}</Text> {actualDate && actualDate}</Text>
        </View>

        <View fixed style={classes.tableSubtitle}>
          <Text style={classes.contractDataTitle}>{t('provisions.provisionsDetails.activitiesList.pdf.data.title')}</Text>
        </View>

        <View wrap={true}>
          {/* <View style={classes.table}> */}
          <View style={classes.tableRow}>
            <Text style={classes.smallCellTitle}>{t('provisions.provisionsDetails.activitiesList.pdf.data.date')}</Text>
            <Text style={classes.bigCellTitle}>{t('provisions.provisionsDetails.activitiesList.pdf.data.action')}</Text>
          </View>
          {
            data.map((activity, index) => {
              if (index !== 0 && index % 6 === 0) {
                return (
                  // <>
                  <View key={index}>
                    <View style={classes.spacing}/>
                    <View style={classes.tableRow} break>
                      <Text style={classes.separator}/>
                      <Text style={classes.smallCellData}>{activity && formatDateAndTime(activity.activityDate)}</Text>
                      <Text style={classes.bigCellData}>{activity && activity.message}</Text>
                    </View>
                  </View>
                  // </>
                )
              } else {
                return (
                  <View style={classes.tableRow} key={index}>
                    <Text style={classes.separator}/>
                    <Text style={classes.smallCellData}>{activity && formatDateAndTime(activity.activityDate)}</Text>
                    <Text style={classes.bigCellData}>{activity && activity.message}</Text>
                  </View>
                )
              }
            })
          }
          {/* </View> */}
        </View>   

        <View fixed style={classes.sign}>
          <Image style={classes.signImage} src={Sign} />

          <View style={classes.signTexts}>
            <Link src='www.ufd.es' style={classes.link}>www.ufd.es</Link>
            {/* <Text style={classes.signText}>UFD - Atención al cliente de red</Text>
            <Text style={classes.signText}>Tel. 900 111 999</Text> */}
          </View>
        </View>   

        <View fixed style={classes.sateliteHorizontal}>
          <Image src={SateliteH} />
        </View> 

      </Page>
    </Document>

  )
}

export default DocumentPDF
