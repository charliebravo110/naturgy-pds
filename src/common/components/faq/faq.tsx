import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Interrogante from '../../../assets/icons/Interrogante.svg'
import Tab from '../../../assets/icons/tab.svg'

import useStyles from './faq.styles'
import NaturgyArrowTooltip from '../tooltip/arrow/ArrowTooltip'

const Faq = (props: any) => {
  const { t } = useTranslation()
  const mobileRes = useMediaQuery('(max-width:576px)')

	const { toSpace } = props

  const openTab = () => {
		window.open('https://www.ufd.es/preguntas-frecuentes/#1704786732903-18accea8-3d74', '_blank').focus();
	}

  const classes = useStyles({})

  return (
    <>
			<NaturgyArrowTooltip title={t('faq.tooltip')} placement='left'>
				{ !mobileRes && toSpace ?
					<Grid container direction='column' className={classes.generalContSpaced} onClick={() => {openTab()}}>
						<Grid item className={classes.iconCont}>
							<img className={classes.icon} src={Interrogante} alt='' />
						</Grid>
						<Grid item className={classes.textBlock}>
							<div className={classes.text}>{t('faq.questions')}</div>
							<div className={classes.text}>{t('faq.frequently')}</div>
						</Grid>
						<Grid item className={classes.tabCont}>
							<img className={classes.tabIcon} src={Tab} alt='' />
						</Grid>
					</Grid>  

				: mobileRes && toSpace ?

					<Grid container direction='column' className={classes.generalMobileContSpaced} onClick={() => {openTab()}}>
						<Grid item className={classes.iconMobileTabCont}>
							<img className={classes.mobileTabIcon} src={Tab} alt='' />
						</Grid>
						<Grid item className={classes.iconMobileCont}>
							<img className={classes.mobileIcon} src={Interrogante} alt='' />
						</Grid>
					</Grid>

				: !mobileRes && !toSpace ? 

					<Grid container direction='column' className={classes.generalCont} onClick={() => {openTab()}}>
						<Grid item className={classes.iconCont}>
							<img className={classes.icon} src={Interrogante} alt='' />
						</Grid>
						<Grid item className={classes.textBlock}>
							<div className={classes.text}>{t('faq.questions')}</div>
							<div className={classes.text}>{t('faq.frequently')}</div>
						</Grid>
						<Grid item className={classes.tabCont}>
							<img className={classes.tabIcon} src={Tab} alt='' />
						</Grid>
					</Grid> 

				: mobileRes && !toSpace &&

					<Grid container direction='column' className={classes.generalCont} onClick={() => {openTab()}}>
						<Grid item className={classes.iconMobileTabCont}>
							<img className={classes.mobileTabIcon} src={Tab} alt='' />
						</Grid>
						<Grid item className={classes.iconMobileCont}>
							<img className={classes.mobileIcon} src={Interrogante} alt='' />
						</Grid>
					</Grid>
				}
			</NaturgyArrowTooltip>
    </>    
  )
}

export default withRouter(Faq)