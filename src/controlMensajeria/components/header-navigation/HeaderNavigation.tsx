import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  StyledTabSelector,
  StyledTab
} from '../../../common/components/styled-tab-selector/StyledTabSelector'
import Grid from '@material-ui/core/Grid'

import ArrowRightIcon from '../../../assets/icons/flecha_derecha.svg'
import useStyles from './HeaderNavigation.styles'

const HeaderNavigation = (props: any) => {
  const classes = useStyles({})
  const {
    tabletRes,
    mobileRes,
    tabValue,
    setTabValue
  } = props

  const { t } = useTranslation()

  return (
    <Grid container className={classes.generalCont}>
      <StyledTabSelector
        className={`${classes.tabSelector} ${(tabletRes || mobileRes) ? classes.tabsMobile : classes.tabs} navigation-tabs`}
        value={tabValue}
        onChange={(event, newValue) => setTabValue(newValue)}
        indicatorColor='primary'
        textColor='primary'
        orientation={(tabletRes || mobileRes) ? 'vertical' : 'horizontal'}
        TabIndicatorProps={(tabletRes || mobileRes) ?
          {
            style: {
              left: 0,
              width: 5,
              borderRadius: 0
            }
          } : {}
        }
      >
        {
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : classes.tab}
            label={t('controlMensajeria.navigation.detail')}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

        {
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : classes.tab}
            label={t('controlMensajeria.navigation.graph')}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }
      </StyledTabSelector>
    </Grid>
  )
}

export default withRouter(HeaderNavigation)
