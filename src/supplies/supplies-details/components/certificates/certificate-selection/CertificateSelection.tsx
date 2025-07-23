import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './CertificateSelection.styles'

const CertificateSelection = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    selection,
    setSelection,
    supplyData,
  } = props

  const [isSelfConsumption, setIsSelfConsumption] = useState<boolean>()

  useEffect(() => {
    setIsSelfConsumption(supplyData.isSelfConsumption ? true : false)
  }, [])

  useEffect(() => {
    if (isSelfConsumption && supplyData.isSelfConsumption.generationCups === '') {
      setIsSelfConsumption(false)
    }
  }, [isSelfConsumption])

  const handleChangeSelection = (option) => {
    if (option === 'option1') {
      setSelection(option)
    }
    else if (option === 'option2') {
      setSelection(option)
    }
    else if (option === 'option3') {
      setSelection(option)
    }
    else if (option === 'option4') {
      setSelection(option)
    }
  }

  return (
    <Grid container className={classes.mainCont}>
      <Grid container xs={12} className={classes.title}>
        {t('supplies.suppliesDetails.components.certificates.certificateSelection.title')}
      </Grid>
      <Grid container className={classes.menu}>
        <Grid
          item
          className={`${classes.menuItem} ${selection === 'option1' && 'active'}`}
          onClick={() => handleChangeSelection('option1')}
        >
          {t('supplies.suppliesDetails.components.certificates.certificateSelection.selection.option1')}
        </Grid>

        {supplyData.isGenerator !== '1' &&
          <>
            <Grid
              item
              className={`${classes.menuItem} ${selection === 'option2' && 'active'}`}
              onClick={() => handleChangeSelection('option2')}
            >
              {t('supplies.suppliesDetails.components.certificates.certificateSelection.selection.option2')}
            </Grid>

            {isSelfConsumption ?
              <Grid
                item
                className={`${classes.menuItemDisabled} ${selection === 'option3' && 'active'}`}
                onClick={() => handleChangeSelection('option3')}
              >
                {t('supplies.suppliesDetails.components.certificates.certificateSelection.selection.option3')}
              </Grid>
              :
              <Grid
                item
                className={`${classes.menuItem} ${selection === 'option3' && 'active'}`}
                onClick={() => handleChangeSelection('option3')}
              >
                {t('supplies.suppliesDetails.components.certificates.certificateSelection.selection.option3')}
              </Grid>
            }

          </>
        }

        {supplyData.tipoDeLectura === 'TELEGESTIONADO' &&
          <Grid
            item
            className={`${classes.menuItem} ${selection === 'option4' && 'active'}`}
            onClick={() => handleChangeSelection('option4')}
          >
            {t('supplies.suppliesDetails.components.certificates.certificateSelection.selection.option4')}
          </Grid>
        }
      </Grid>
    </Grid>
  )
}

export default CertificateSelection