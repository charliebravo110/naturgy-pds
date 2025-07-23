import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import OkList from '../../../../assets/icons/ok_list.svg'
import AddNew from '../../../../assets/icons/mas.svg'

import useStyles from './NoDelegates.styles'

// LCS: Importar las funciones - Wave 3
import { sendGAEvent } from '../../../../core/utils/gtm'

const NoDelegates = (props: any) => {
    const { t } = useTranslation()

    const { history, delegates } = props

    const classes = useStyles({})

    const adminToken = useSelector((state: any) => state.admin.token)

    const handleClickAdd = () => {
      if (!adminToken) {
        history.push({
          pathname: `${delegates}/add`
        })
      }
    }

    // LCS: Enviar evento de GdC a GA - Wave 3
    const sendGAEventNoDelegates = (type: any):void => {
      if (type === 'consultants') {
        sendGAEvent({
          event: 'add_advisor',
          section_name: 'mis suministros',
          subsection_name: 'mis asesores',
          click_text: 'dar de alta a un asesor',
          element_type: 'consulta de informacion',
          page_url: window.location.href,
          browsing_type: sessionStorage.getItem('browsing_type'),
        })
      } else {
        sendGAEvent({
          event: 'add_manager',
          section_name: 'mis suministros',
          subsection_name: 'mis gestores',
          click_text: 'dar de alta a un gestor',
          element_type: 'consulta de informacion',
          page_url:window.location.href,
          browsing_type: sessionStorage.getItem('browsing_type'),
        })
      }
    }

    return (
        <>
          <Grid container item className={classes.box} md={8} sm={10} xs={10}>
            <Grid item className={classes.headerSubTitle}>
                <b>{t(`delegates.${delegates}.subheader`)}</b>
            </Grid>
            <Grid item >
                <div className={classes.tickText}>
                    <img className={classes.tickIcon} src={OkList} alt='tick' />
                    <p>{t(`delegates.${delegates}.text1`)}</p>
                </div>
                <div className={classes.tickText}>
                    <img className={classes.tickIcon} src={OkList} alt='tick' />
                    <p>{t(`delegates.${delegates}.text2`)}</p>
                </div>

                { delegates === 'managers' &&
                <div className={classes.tickText}>
                    <img className={classes.tickIcon} src={OkList} alt='tick' />
                    <p>{t(`delegates.${delegates}.text3`)}</p>
                </div>
                }
            </Grid>
          </Grid>
            <Grid container item justifyContent='center' direction='column' className={classes.addNewDelegate} >
                <b className={classes.headerSubTitle}>{t(`delegates.${delegates}.noTitle`)}</b>
                <p className={classes.tickText}>{t(`delegates.${delegates}.noSubtitle`)}</p>
                <span className={adminToken && 'disabled'} onClick={() => { sendGAEventNoDelegates(delegates); handleClickAdd()}}>
                    <img src={AddNew} alt='+' />
                    <p className={classes.newDelegateText}>{t(`delegates.${delegates}.newDelegate`)}</p>
                </span>
            </Grid>
        </>
    )
  }

  export default NoDelegates
