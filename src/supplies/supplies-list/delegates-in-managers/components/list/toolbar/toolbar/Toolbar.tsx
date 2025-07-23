import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Views from '../views/Views'
import Searcher from '../../../../../../../common/components/searcher/Searcher'
import RemoveIcon from '../../../../../../../assets/icons/eliminar.svg'

import XLSX from 'xlsx'

import useStyles from './Toolbar.styles'
import Button from '../../../../../../../common/components/button/Button'
import { formatDateBars } from '../../../../../../../common/lib/FormatLib'
import { isMobileApp } from '../../../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../../../core/utils/gtm';

const Toolbar = (props: any) => {
  const {
    delegationsToDelete,
    openRemoveDelegation,
    view,
    handleChangeView,
    handleChangeSearch,
    handleSearch,
    mobile,
    listItems
  } = props

  const { t } = useTranslation()
  const classes = useStyles({})

  let supplantedUser = sessionStorage.getItem('supplantedUser')

  const handleDowloadSupliesList = () => {
    if (listItems) {
      let listData = [] as any
      let managerPeriod
      let managerDoc
      listItems.map(
        (item) => {
          managerPeriod = ''
          managerDoc = ''
          {
            listItems.find(item => item.managers.length > 0) &&
              item.managers.map((manager, i) => {
                if (manager.name && manager.startDate && manager.endDate) {
                  managerPeriod = managerPeriod + formatDateBars(manager.startDate) + ' - ' + formatDateBars(manager.endDate)+ ' '
                  managerDoc =  managerDoc + manager.documentNumber + ' '

                }
              })
          }
          {
            listItems.find(item => item.consultants.length > 0) &&
            item.consultants.map((consultant, i) => {
                if (consultant.name && consultant.startDate && consultant.endDate) {
                  managerPeriod = managerPeriod + consultant.name + ': ' + formatDateBars(consultant.startDate) + ' - ' + formatDateBars(consultant.endDate) + ' '
                  managerDoc = managerDoc + consultant.documentNumber + ' '

                }
              })
          }
          listData.push({
            cups: item.cups ? item.cups : '',
            address: item.address ? item.address : '',
            delegationPeriod: managerPeriod,
            manager: managerDoc,
          })
        }
      )
     
      //funcion para descar un excel con la información de los suplipoints en un excel
      const wb = XLSX.utils.book_new()
      let ws
      //posa un JSON object a una pagina
      ws = XLSX.utils.json_to_sheet(listData, {
        header: [
          'cups',
          'address',
          'delegationPeriod',
          'manager',
        ]
      })
      ws['A1'].v = t('delegations.delegatesInMe.list.cups')
      ws['B1'].v = t('delegations.address')
      ws['C1'].v = t('delegations.list.delegationPeriod')
      ws['D1'].v = t('delegations.manager')


      let fileName = 'MisSuministros.xlsx'
      XLSX.utils.book_append_sheet(wb, ws, 'Delegados en gestor o asesor')
      //crea el llibre 
      XLSX.writeFile(wb, fileName)

      // XLSX.writeFile will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
      
      // LCS: Enviar evento de GdC a GA - Wave 3
      sendGAEvent({
        event: 'data_export',
        section_name: 'mis suministros',
        click_text: 'exportar datos',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        tab_name:'delegados en gestor o asesor',
        browsing_type: sessionStorage.getItem('browsing_type')
      });
    }
  }

  return (
    <Grid container justifyContent='space-between' className={classes.searchBar} >
      <div
        className={`${classes.removeDelegate} ${(delegationsToDelete.length === 0 || supplantedUser) && 'disabled'}`}
        onClick={openRemoveDelegation}
      >
        <img src={RemoveIcon} alt='+' />
        {t('delegates.delegatesList.remove')}
      </div>
      <div className={classes.toolbarRight}>
        <Grid item className={classes.mobileFullWidth2}>
          <Button
            text={t('provisions.provisionsList.exportarData')}
            color={'primary'}
            variant={'contained'}
            className={classes.exportButton}
            onClick={handleDowloadSupliesList}
          />
        </Grid>
        {
          !mobile &&
          <div className={classes.view} >
            <Views
              view={view}
              handleChangeView={handleChangeView}
            />
          </div>
        }
        <Searcher
          handleChangeSearch={handleChangeSearch}
          handleSearch={handleSearch}
          fromSupplies
        />
      </div>
    </Grid>
  )
}

export default Toolbar
