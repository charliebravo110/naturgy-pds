import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Tooltip from '../../../../../../../common/components/tooltip/Tooltip'
import ListIcon from '../../../../../../../assets/icons/listado.svg'
import SelectedListIcon from '../../../../../../../assets/icons/listado_seleccionado.svg'
import MosaicIcon from '../../../../../../../assets/icons/mosaico.svg'
import SelectedMosaicIcon from '../../../../../../../assets/icons/mosaico_seleccionado.svg'

import useStyles from './Views.styles'

const Views = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    view,
    handleChangeView
  } = props

  return (
    <Grid className={classes.container}>
      <Tooltip title={t('views.titleList')} placement='top'>
        <div
          className={`${classes.button} ${view === 0 && 'active'} list`}
          onClick={() => handleChangeView(0)}
        >
          {
            view === 0 ?
              <img src={SelectedListIcon} alt='' />
            :
              <img src={ListIcon} alt='' />
          }
        </div>
      </Tooltip>

      <Tooltip title={t('views.titleMosaic')} placement='top'>
        <div
          className={`${classes.button} ${view === 1 && 'active'} mosaic`}
          onClick={() => handleChangeView(1)}
        >
          {
            view === 0 ?
              <img src={MosaicIcon} alt='' />
            :
              <img src={SelectedMosaicIcon} alt='' />
          }
        </div>
      </Tooltip>
    </Grid>
  )
}

export default Views
