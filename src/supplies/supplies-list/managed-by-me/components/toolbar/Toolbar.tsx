import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Checkbox from '../checkbox/Checkbox'
import Views from '../views/Views'
import DynamicSearcher from '../../../../../common/components/searcher/DynamicSearcher'

import XLSX from 'xlsx'

import useStyles from './Toolbar.styles'
import { DialogSuppliesAlert } from '../../../components/supplies-list/DialogSuppliesAlert'
import { useSelector } from 'react-redux'
import IcoGestor from '../../../../../assets/icons/ico_Gestor.svg'
import IcoAsesor from '../../../../../assets/icons/ico_Asesor.svg'
import IcoAlertaActiva from '../../../../../assets/icons/icon_AlertaActiva.svg'
import IcoAlertaInactiva from '../../../../../assets/icons/icon_AlertaInactiva.svg'
import IconTextButton from '../../../../../common/components/icon-text-button/IconTextButton'
import Button from '../../../../../common/components/button/Button'
import { isMobileApp } from '../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm';

const Toolbar = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const user = useSelector((state: any) => state.user);
  const [alertaConfigurada, setAlertaConfigurada] = useState(false)

  useEffect(() => {
    setAlertaConfigurada((user.profile.destinatario) ? true : false)
  }, [])
  


  const {
    view,
    suppliesList,
    selectedItemsList,
    handleClickCheckbox,
    handleChangeView,
    handleClickDelegate,
    handleClickAuthorize,
    mobile,
    adminToken,
    finalList,
    setFinalList,
    setCurrentPage
  } = props

  const [dialogstate, setDialogstate] = useState(false);
  const [dialogstate2, setDialogstate2] = useState(false);
  const handleDowloadSupliesList = () => {
    if (finalList) {
      let listData = [] as any
      finalList.map(
        (item) => {
          listData.push({
            name: item.name ? item.name : '',
            cups: item.cups ? item.cups : '',
            adress: item.address &&
            (item.address.street ? item.address.street : '') + ' ' +
            (item.address.number ? item.address.number : '') + ', ' +
            // (item.address.stair ? t('delegations.suppliesList.stair') + item.address.stair : '') + ' ' + 
            // (item.address.floor ? t('delegations.suppliesList.floor') + item.address.floor : '') + ' ' + 
            // (item.address.door ? t('delegations.suppliesList.door') + item.address.door : '') +', ' +
            (item.address.town ? item.address.town : '') + ', ' + 
            (item.address.province ? item.address.province : '') + ' ' + 
            (item.address.zipCode ? item.address.zipCode : ''),
            sypplyType: item.isGenerator === '0' ?
              t('delegations.suppliesList.consumption')
              :
              t('delegations.suppliesList.generation'),
            // openDate: item.createDate ? item.createDate : '00/00/0000',
          })
        }
      )
      //funcion para descar un excel con la información de los suplipoints en un excel
      const wb = XLSX.utils.book_new()
      let ws
      //posa un JSON object a una pagina
      ws = XLSX.utils.json_to_sheet(listData, {
        header: [
          'name',
          'cups',
          'adress',
          'sypplyType',
        ]
      })
      ws['A1'].v = t('delegations.name')
      ws['B1'].v = 'CUPS'
      ws['C1'].v = t('delegations.address')
      ws['D1'].v = t('delegations.supplyType')

      let fileName = 'MisSuministros.xlsx'
      XLSX.utils.book_append_sheet(wb, ws, 'Gestionados por mí')
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
        tab_name: 'gestionados por mi',
        browsing_type: sessionStorage.getItem('browsing_type')
      });
    }
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendEventManageDelegate = ():void => {
    let itemSelected = finalList.find(item => item.cups === selectedItemsList[0])
    sendGAEvent({
      event: 'manage_supply',
      section_name: 'mis suministros',
      click_text: 'delegar en un gestor',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemsList[0],
      supply_type: itemSelected ? (itemSelected.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })

    handleClickDelegate((selectedItemsList.length > 0 && !adminToken), 'US_MANAGER')
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendEventManageConsultant = ():void => {
    let itemSelected = finalList.find(item => item.cups === selectedItemsList[0])
    sendGAEvent({
      event: 'manage_supply',
      section_name: 'mis suministros',
      click_text: 'autorizar a asesores',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemsList[0],
      supply_type: itemSelected ? (itemSelected.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })

    handleClickAuthorize((selectedItemsList.length > 0 && !adminToken), 'US_CONSULTANT')
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendEventManageEnableAlerts = ():void => {
    let itemSelected = finalList.find(item => item.cups === selectedItemsList[0])
    sendGAEvent({
      event: 'manage_supply',
      section_name: 'mis suministros',
      click_text: 'activar alerta',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemsList[0],
      supply_type: itemSelected ? (itemSelected.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })

    if (alertaConfigurada) { setDialogstate(true)}
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendEventManageDisableAlerts = ():void => {
    let itemSelected = finalList.find(item => item.cups === selectedItemsList[0])
    sendGAEvent({
      event: 'manage_supply',
      section_name: 'mis suministros',
      click_text: 'desactivar alerta',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemsList[0],
      supply_type: itemSelected ? (itemSelected.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })

    { if (alertaConfigurada) { setDialogstate2(true)} }
  }

  return (
    <Grid container className={classes.toolbar} >
      <Grid container xs={12} md={5} alignItems='flex-end' className={`${classes.margin} ${selectedItemsList.length > 0 && classes.visible}`}>
        {/* <Grid container className={classes.items}> */}
          <Grid container>
            <Grid container className={classes.checkTxtCont}>
              <span>{t('supplies.dialogAlertConfirm.selectedSupps')}</span>
            </Grid>
          </Grid>
          <Grid container direction='row'>
            <Grid item xs={12} md={5} className={`${classes.action} marginBottom ${(selectedItemsList.length === 0 || adminToken) && 'disabled'}`} onClick={() => sendEventManageDelegate()}>{<IconTextButton icon={<img src={IcoGestor} />} text={t('delegations.managedByMe.delegateManager')}/>}</Grid>
            <Grid item xs={12} md={5} className={`${classes.action} marginBottom ${(selectedItemsList.length === 0 || adminToken || !alertaConfigurada) && 'disabled'}`} onClick={() => sendEventManageEnableAlerts()}>{<IconTextButton icon={<img src={IcoAlertaActiva} />} text={t('supplies.dialogAlertConfirm.activate')}/>}</Grid>

            <Grid item xs={12} md={5} className={`${classes.action} ${mobile && 'marginBottom'} ${(selectedItemsList.length === 0 || adminToken) && 'disabled'}`} onClick={() => sendEventManageConsultant()}>{<IconTextButton icon={<img src={IcoAsesor} />} text={t('delegations.managedByMe.authorizeConsultant')}/>}</Grid>
            <Grid item xs={12} md={5} className={`${classes.action} ${(selectedItemsList.length === 0 || adminToken || !alertaConfigurada) && 'disabled'}`} onClick={() => sendEventManageDisableAlerts()}>{<IconTextButton icon={<img src={IcoAlertaInactiva} />} text={t('supplies.dialogAlertConfirm.deactivate')}/>}</Grid>
          </Grid>
        {/* </Grid> */}
      </Grid>

      <Grid container xs={12} md={7} className={classes.toolbarRight} >
        <Grid container alignItems='center' justifyContent='flex-end'>
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

            <Views
              view={view}
              handleChangeView={handleChangeView}
            />
          }

          {console.log('finalList before DS: ', finalList)}
          <DynamicSearcher
            label={t('provisions.provisionsList.searcher')}
            finalList={finalList}
            setFinalList={setFinalList}
            listItems={suppliesList}
            subtype={'suministro'}
            setCurrentPage={setCurrentPage}
          />
        </Grid>
      </Grid>

      {
        selectedItemsList.length > 1 &&
        <Grid container className={classes.selectedItemsCounter}>
          {t('delegations.managedByMe.selected1')}<b>{selectedItemsList.length}</b>{t('delegations.managedByMe.selected2')}
        </Grid>
      }
       <DialogSuppliesAlert dialogstate={dialogstate} setDialogstate={setDialogstate} selectedItemList={selectedItemsList} activate={true} finalList={finalList} />
      <DialogSuppliesAlert dialogstate={dialogstate2} setDialogstate={setDialogstate2} selectedItemList={selectedItemsList} activate={false} finalList={finalList}/>
    </Grid>
  )
}

export default Toolbar
