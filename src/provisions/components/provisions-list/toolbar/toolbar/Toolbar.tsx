import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import XLSX from 'xlsx'

import Views from '../views/Views'
import DynamicSearcher from '../../../../../common/components/searcher/DynamicSearcher'

import useStyles from './Toolbar.styles'
import Button from '../../../../../common/components/button/Button'
import { isMobileApp } from '../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm';

const Toolbar = (props: any) => {
  const { t } = useTranslation()

  const {
    view,
    handleChangeView,
    mobile,
    finalList,
    setFinalList,
    totalList,
    dossierStatus,
    isLoading
  } = props

  const classes = useStyles({})

  //const [searchValue, setSearchValue] = useState('')

  const handleCheckProvisionName = (nameProvision) => {
    let nameResult = nameProvision
    if (nameResult === 'Provisión de servicio') {
      nameResult = 'Solicitud de conexión'
    }
    return nameResult
  }

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

  const getDossierSubtype = (CurrentProvisionType, CurrentProvisionSubType) => {
    if (CurrentProvisionType === 'DOSTYP001') {
      if (CurrentProvisionSubType === 'DOSSUB015') return t('provisions.provisionsList.provisionTypes.power')
      else return t('provisions.provisionsList.provisionTypes.consumo')
    }
    else {
      if (CurrentProvisionType === 'DOSTYP002') {
        if (CurrentProvisionSubType === 'DOSSUB000') return t('provisions.provisionsList.provisionTypes.autoconsumo')
        else return t('provisions.provisionsList.provisionTypes.generation')
      }
      else return t('provisions.provisionsList.provisionTypes.trazado')
    }
  }

  const handleDowloadSupliesList = () => {
    if (finalList) {
      let listData = [] as any
      finalList.map(
        (item) => {
          listData.push({
            provisionName: item.name ? handleCheckProvisionName(item.name) : '',
            provisionType: getDossierSubtype(item.idDossierType, item.idDossierSubtype),
            provisionNumber: item.dossierCod ? item.dossierCod : '',
            provisionAdress: item.addressDescription ? item.addressDescription : '',
            provisionCreateDate: item.registerDate ? formatDateAndTime(item.registerDate) : '00/00/0000',
            provisionStatus: dossierStatus.find(i => i.key === item.dossierStatusId) ? dossierStatus.find(i => i.key === item.dossierStatusId).value : '',
          })
        }
      )
      //funcion para descar un excel con la información de los suplipoints en un excel
      const wb = XLSX.utils.book_new()
      let ws
      //posa un JSON object a una pagina
      ws = XLSX.utils.json_to_sheet(listData, {
        header: [
          'provisionName',
          'provisionType',
          'provisionNumber',
          'provisionAdress',
          'provisionCreateDate',
          'provisionStatus',
        ]
      })
      ws['A1'].v = t('provisions.provisionsList.name')
      ws['B1'].v = t('provisions.provisionsList.provisionType')
      ws['C1'].v = t('provisions.provisionsList.number')
      ws['D1'].v = t('provisions.provisionsList.address')
      ws['E1'].v = t('provisions.provisionsList.createDate')
      ws['F1'].v = t('provisions.provisionsList.status')

      let fileName = 'MisPeticiones.xlsx'
      XLSX.utils.book_append_sheet(wb, ws, 'Peticiones')
      //crea el llibre 
      XLSX.writeFile(wb, fileName)

      // XLSX.writeFile will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
      
      // LCS: Enviar evento de GdC a GA - Wave 3
      if(listData.length>0){
        let tab_name = sessionStorage.getItem('tab_selected')
        sendGAEvent({
          event: 'data_export',
          section_name: 'mi conexion a la red',
          click_text: 'exportar datos',
          element_type: 'conversion de accion',
          page_url: removeEmails(window.location.href),
          tab_name: tab_name,
          browsing_type: sessionStorage.getItem('browsing_type')
        });
      }
    }
  }

  return (
    <Grid container alignItems='center' justifyContent='flex-end' className={classes.searchBar}>
      <Grid item className={classes.mobileFullWidth2}>
        <Button
          text={t('provisions.provisionsList.exportarData')}
          color={'primary'}
          variant={'contained'}
          className={classes.exportButton}
          onClick={handleDowloadSupliesList}
          disabled={isLoading}
        />
      </Grid>
      {
        !mobile &&
        <Grid item className={classes.view} >
          <Views
            view={view}
            handleChangeView={handleChangeView}
          />
        </Grid>
      }

      <Grid item className={classes.mobileFullWidth}>
        {/*<Searcher
          label={t('provisions.provisionsList.searcher')}
          handleChangeSearch={handleChangeSearch}
          handleSearch={handleSearch}
          searchWhenClick={true}
          setSearchValue={setSearchValue}
          readyToSearch={validateDossierCode(searchValue)}
        />*/}

        <DynamicSearcher
          label={t('provisions.provisionsList.searcher')}
          finalList={finalList}
          setFinalList={setFinalList}
          listItems={totalList}
          subtype={'solicitud'}
        />
      </Grid>
    </Grid >
  )
}

export default Toolbar
