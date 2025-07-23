import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Tooltip from '../../../../../../common/components/tooltip/Tooltip'
import GraphViewIcon from '../../../../../../assets/icons/vista_grafica.svg'
import SelectedGraphViewIcon from '../../../../../../assets/icons/vista_grafica_seleccionado.svg'
import TableViewIcon from '../../../../../../assets/icons/vista_tabla.svg'
import SelectedTableViewIcon from '../../../../../../assets/icons/vista_tabla_seleccionado.svg'

import useStyles from './Mode.styles'

const Mode = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    mode,
    setMode
  } = props

  return (
    <Grid item className={classes.container}>
      <Tooltip title={t('supplies.suppliesDetails.components.consumption.charts.mode.graph')} placement='top'>
        <div
          className={`${classes.button} ${(mode === 'graph' || mode === undefined) && 'active'} graph`}
          onClick={() => setMode('graph')}
        >
          {
            mode === 'graph' ?
            <img src={GraphViewIcon} alt='' />
            :
            <img src={SelectedGraphViewIcon} alt='' />
             
          }
        </div>
      </Tooltip>

      <Tooltip title={t('supplies.suppliesDetails.components.consumption.charts.mode.table')} placement='top'>
        <div
          className={`${classes.button} ${mode === 'table' && 'active'} table`}
          onClick={() => setMode('table')}
        >
          {
            mode === 'table' ?
            <img src={TableViewIcon} alt='' />
            :
            <img src={SelectedTableViewIcon} alt='' />
          }
        </div>
      </Tooltip>
    </Grid>
  )
}

export default Mode
