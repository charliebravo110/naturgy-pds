import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Views from '../views/Views'
import TextButton from '../../../../../common/components/text-button/TextButton'

import useStyles from './Toolbar.styles'

import { formatDateBars } from '../../../../../common/lib/FormatLib'

import XLSX from 'xlsx'

import Checkbox from '../checkbox/Checkbox'
import DynamicSearcher from '../../../../../common/components/searcher/DynamicSearcher'
import Button from '../../../../../common/components/button/Button'
import { isMobileApp } from '../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../mobile-apps/local-downloads/createFileAndOpenIt'
const Toolbar = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    view,
    handleClickCheckbox,
    handleChangeView,
    selectedItemsList,
    setCurrentPage,
    mobile,
    supplies,
    delegationsInManagersList,
    delegatesInMeList,
    adminToken,
    openBajaDelegation,
    finalList,
    setFinalList
  } = props



  const handleOnClick = () => {
    props.history.push('/landing')
  }

  const handleDowloadSupliesList = () => {
    if (finalList) {
      let listData = [] as any
      finalList.map(
        (item) => {
          listData.push({
            cups: item.cups ? item.cups : '',
            direction: item.address &&
              (item.address.street ? item.address.street : '') + ' ' + (item.address.number ? item.address.number : '') + ', ' + (item.address.province ? item.address.province : '') + ' ' + (item.address.zipCode ? item.address.zipCode : ''),
            name: item.name ? item.name : '',
            delegationPeriod: (item.startDate ? formatDateBars(item.startDate) : '' )+'-'+ (item.endDate ? formatDateBars(item.endDate) : ''),
            delegationType:  item.role === 'US_CONSULTANT' ? t('delegations.delegatesInMe.delegateRol.consultant') :(item.role === 'US_MANAGER'? t('delegations.delegatesInMe.delegateRol.manager') : '')
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
          'direction',
          'name',
          'delegationPeriod',
          'delegationType',
        ]
      })
      ws['A1'].v = t('delegations.delegatesInMe.list.cups')
      ws['B1'].v = t('delegations.delegatesInMe.list.direction')
      ws['C1'].v = t('delegations.delegatesInMe.list.name')
      ws['D1'].v = t('delegations.delegatesInMe.list.delegationPeriod')
      ws['D1'].v = t('delegations.delegatesInMe.list.delegationType')


      let fileName = 'MisSuministros.xlsx'
      XLSX.utils.book_append_sheet(wb, ws, 'Delegados en mí')
      //crea el llibre 
      XLSX.writeFile(wb, fileName)

      // XLSX.writeFile will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
       
    }
  }

  return (

    <Grid container className={classes.toolbar}>
      <Grid item>
        <Grid container className={classes.items}>
          <Grid item>

            <Checkbox selected={selectedItemsList.length > 0 && delegatesInMeList.length === selectedItemsList.length} disabled={delegatesInMeList.length === 0} handleClick={() => handleClickCheckbox(null)} />

          </Grid>
          <Grid item className={`${classes.action} ${(selectedItemsList.length === 0 || adminToken) && 'disabled'}`} onClick={openBajaDelegation}>{t('delegations.delegatesInMe.delegationBaja')}</Grid>
        </Grid>
      </Grid>


      {supplies &&
        delegationsInManagersList &&
        (supplies.list.length === 0 && delegationsInManagersList.length === 0) &&
        <Grid item>
          <TextButton onClick={handleOnClick}>Vincular un suministro</TextButton>
        </Grid>
      }
      <Grid item />
      <Grid item className={classes.toolbarRight} >
        <Grid container alignItems='center'>
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

          <DynamicSearcher
            label={t('provisions.provisionsList.searcher')}
            finalList={finalList}
            setFinalList={setFinalList}
            listItems={delegatesInMeList}
            subtype={'delegates'}
            setCurrentPage={setCurrentPage}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Toolbar
