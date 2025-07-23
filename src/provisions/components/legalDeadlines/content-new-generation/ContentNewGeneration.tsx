import React from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'

import useStyles from './ContentNewGeneration.styles'

const ContentNewGeneration = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <Grid container spacing={1} className={classes.generalCont}>

      <Grid container className={classes.header}>
        <Grid item>
          {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.header')}
        </Grid>
      </Grid>

      <Grid container className={classes.thirdDescription}>
        <Grid item>
          {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.header2')}
        </Grid>
      </Grid>
      
      <Grid container className={classes.table}>
        <Grid container>
          <Grid container>
            <Grid container className={classes.flexCell} xs={4}>
              <Grid item>
                {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text1')}
              </Grid>
            </Grid>
            <Grid container xs={8}>
              <Grid container>
                <Grid item className={classes.celln} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column2.text1')}</Grid>
                <Grid item className={classes.cell} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column4.text1')}</Grid>
              </Grid>
              <Grid container>
                <Grid item className={classes.celln} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column2.text2')}</Grid>
                <Grid item className={classes.cell} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column4.text2')}</Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item className={classes.flexCell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text2')}</Grid>
            <Grid item className={classes.celln} xs={4}>{''}</Grid>
            <Grid item className={classes.cell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column4.text3')}</Grid>
          </Grid>

          <Grid container>
            <Grid item className={classes.flexCell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text3')}</Grid>
            <Grid item className={classes.celln} xs={4}>{''}</Grid>
            <Grid item className={classes.cell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column4.text4')}</Grid>
          </Grid>

          <Grid container>
            <Grid item className={classes.flexCell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text4')}</Grid>
            <Grid item className={classes.celln} xs={4}>{''}</Grid>
            <Grid item className={classes.cell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column4.text5')}</Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className={classes.descriptionCont}>
        <Grid item>
          <Grid item className={classes.secondaryDescription}>
            <span className={classes.bold}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text50')}
            </span>
          </Grid>
          {' '}
          <Grid item className={classes.secondaryDescription}>
            <span className={classes.description}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text51')}
            </span>
            {' '}
            <span className={classes.bold}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text52')}
            </span>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item className={classes.thirdDescription}>
            <span className={classes.bold}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text61')}
            </span>
          </Grid>
          {' '}
          <Grid item className={classes.secondaryDescription}>
            <span className={classes.bold}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text62')}
            </span>
            {' '}
            <span className={classes.description}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text63')}
            </span>
            {' '}
            <span className={classes.bold}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text64')}
            </span>
          </Grid>
        </Grid>      
        <Grid item className={classes.scriptDescription}>
          <span className={classes.description}>
            {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.newGeneration.table.column1.text65')}
          </span>
        </Grid>
      </Grid>     
      
    </Grid>
  )
}

export default ContentNewGeneration