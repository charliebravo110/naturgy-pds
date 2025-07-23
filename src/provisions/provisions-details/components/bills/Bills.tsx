import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './Bills.styles'
import BillsList from '../../../components/bills-list/BillsList'

const Bills = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { location, dossierCod, provision } = props


  return (
    <Grid container justifyContent='center' alignItems='center'>
      <Grid item container md={12} className={classes.container}>
        <Grid item className={classes.title}>
          {t('provisions.provisionsDetails.bills.title')}
        </Grid>
      
          <BillsList type={'b'} dossierCod={dossierCod} location={location} provision={provision}/>
        
      </Grid>
    </Grid>
  )
}
export default Bills
