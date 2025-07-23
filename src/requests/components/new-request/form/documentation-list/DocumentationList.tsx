import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Item2 from './item/Item2'

import useStyles from './DocumentationList.styles'

const DocumentationList = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { items, handleChangeActualRed, setLoading, setBigFilePopup } = props

  return (
    <div className={classes.container}>
      <div className={classes.description}>{t('requests.newRequest.form.documentationList.description')}</div>
      <Grid container className={classes.items}>
        <Grid item md={12} sm={12} xs={12}>
          {
            items && items.map((item, index) => {
              return (
                <Grid container key={index} className={classes.itemCont}>
                  <Item2
                    item={item}
                    handleChangeActualRed={handleChangeActualRed}
                    setLoading={setLoading}
                    setBigFilePopup={setBigFilePopup}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      </Grid>
    </div>
  )
}

export default DocumentationList
