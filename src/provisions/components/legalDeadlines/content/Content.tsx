import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import useStyles from './Content.styles'

const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [link1Selected, setLink1Selected] = useState(true)
  const [link2Selected, setLink2Selected] = useState(false)

  const showBaremo = (isBaremo) => {
    if (isBaremo) {
      setLink1Selected(true)
      setLink2Selected(false)
    } 
    else {
      setLink1Selected(false)
      setLink2Selected(true)
    }
  }

  return (
    <Grid container spacing={1} className={classes.generalCont}>
      <Grid container className={classes.linksCont}>
        <Grid item onClick={() => showBaremo(true)} className={link1Selected ? classes.link1Selected : classes.link1}>
          {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.links.link1')}
        </Grid>
        <Grid item onClick={() => showBaremo(false)} className={link2Selected ? classes.link2Selected : classes.link2}>
          {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.links.link2')}
        </Grid>
      </Grid>

      {link1Selected ?
        <>
          <Grid container className={classes.descriptionCont}>
            <Grid item>
              <span className={classes.description}>
                {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.description1')}
              </span>
              {' '}
              <span className={classes.descriptionBold}>
                {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.description2')}
              </span>
              {' '}
              <span className={classes.description}>
                {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.description3')}
              </span>
            </Grid>
            <Grid item className={classes.secondaryDescription}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.description4')}
            </Grid>
          </Grid>
        
          <Grid container className={classes.firstTable}>
            <Grid container>
              <Grid container>
                <Grid container className={classes.flexCell} xs={3}>
                  <Grid item>
                    {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column1.text1')}
                  </Grid>
                </Grid>
                <Grid container xs={9}>
                  <Grid container>
                    <Grid item className={classes.celln} xs={8}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column2.text1')}</Grid>
                    <Grid item className={classes.cell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column4.text1')}</Grid>
                  </Grid>
                  <Grid container>
                    <Grid item className={classes.celln} xs={8}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column2.text2')}</Grid>
                    <Grid item className={classes.cell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column4.text2')}</Grid>
                  </Grid>

                  <Grid container>
                    <Grid container className={`${classes.celln} ${mobile && 'extraSmall'}`} xs={4}>
                      <Grid item>
                      {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column2.text3')}
                      </Grid>
                    </Grid>
                    <Grid container xs={8}>
                      <Grid container>
                        <Grid item className={classes.cell} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column3.text1')}</Grid>
                        <Grid item className={classes.cell} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column4.text2')}</Grid>
                      </Grid>
                      <Grid container>
                        <Grid item className={classes.cell} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column3.text2')}</Grid>
                        <Grid item className={classes.cell} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column4.text3')}</Grid>
                      </Grid>
                      <Grid container>
                        <Grid item className={classes.cell} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column3.text3')}</Grid>
                        <Grid item className={classes.cell} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column4.text4')}</Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container>
                <Grid container className={classes.flexCell} xs={3}>
                  <Grid item>
                    {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column1.text2')}
                  </Grid>
                </Grid>
                <Grid container xs={9}>
                  <Grid container>
                    <Grid item className={classes.celln} xs={8}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column2.text4')}</Grid>
                    <Grid item className={classes.cell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column4.text5')}</Grid>
                  </Grid>
                  <Grid container>
                    <Grid item className={classes.celln} xs={8}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column2.text5')}</Grid>
                    <Grid item className={classes.cell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.firstTable.column4.text6')}</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container className={classes.descriptionCont}>
          <Grid item>
            <Grid item className={classes.secondaryDescription}>
              <span className={classes.bold}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text51')}</span>
            </Grid>
            {' '}
            <Grid item className={classes.secondaryDescription}>
              <span className={classes.bold}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text52')}
              </span>
              {' '}
              <span className={classes.description}>
                {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text53')}
              </span>
              {' '}
              <span className={classes.bold}>
                {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text54')}
              </span>
            </Grid>
            <Grid item className={classes.scriptDescription}>
              <span className={classes.description}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text55')}
              </span>
            </Grid>
            <Grid item className={classes.scriptDescription}>
              <span className={classes.description}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text56')}
              </span>
            </Grid>
          </Grid>
        </Grid>
        </>
      :
      link2Selected &&
      <>
        <Grid container className={classes.descriptionCont}>
          <Grid item>
            <span className={classes.description}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.description1')}
            </span>
            {' '}
            <span className={classes.descriptionBold}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.description2')}
            </span>
            {' '}
            <span className={classes.description}>
              {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.description3')}
            </span>
          </Grid>
          <Grid item className={classes.secondaryDescription}>
            {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.description4')}
          </Grid>
        </Grid>
        <Grid container className={classes.secondTable}>
          <Grid container>
            <Grid container>
              <Grid container className={classes.flexCell} xs={4}>
                <Grid item>
                  {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text1')}
                </Grid>
              </Grid>
              <Grid container xs={8}>
                <Grid container>
                  <Grid item className={classes.celln} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column2.text1')}</Grid>
                  <Grid item className={classes.cell} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column4.text1')}</Grid>
                </Grid>
                <Grid container>
                  <Grid item className={classes.celln} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column2.text2')}</Grid>
                  <Grid item className={classes.cell} xs={6}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column4.text2')}</Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item className={classes.flexCell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text2')}</Grid>
              <Grid item className={classes.celln} xs={4}>{''}</Grid>
              <Grid item className={classes.cell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column4.text3')}</Grid>
            </Grid>

            <Grid container>
              <Grid item className={classes.flexCell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text3')}</Grid>
              <Grid item className={classes.celln} xs={4}>{''}</Grid>
              <Grid item className={classes.cell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column4.text4')}</Grid>
            </Grid>

            <Grid container>
              <Grid item className={classes.flexCell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text4')}</Grid>
              <Grid item className={classes.celln} xs={4}>{''}</Grid>
              <Grid item className={classes.cell} xs={4}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column4.text5')}</Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className={classes.descriptionCont}>
          <Grid item>
            <Grid item className={classes.secondaryDescription}>
              <span className={classes.bold}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text51')}</span>
            </Grid>
            {' '}
            <Grid item className={classes.secondaryDescription}>
              <span className={classes.bold}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text52')}
              </span>
              {' '}
              <span className={classes.description}>
                {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text53')}
              </span>
              {' '}
              <span className={classes.bold}>
                {t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text54')}
              </span>
            </Grid>
            <Grid item className={classes.secondaryDescription}>
              <span className={classes.description}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text55')}
              </span>
            </Grid>
            <Grid item className={classes.secondaryDescription}>
              <span className={classes.description}>{t('provisions.newProvision.keepInMind.legalDeadlinesDialog.consumption.secondTable.column1.text56')}
              </span>
            </Grid>
          </Grid>
        </Grid>
      </>
      }      
      
    </Grid>
  )
}

export default Content