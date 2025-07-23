import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useStyles from './DossierData.styles'

const DossierData = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const requests = useSelector((state: any) => state.requests)
  const provisions = useSelector((state: any) => state.provisions)

  return (
    <div className={classes.container}>
      <div className={classes.section}>
        <b>{t('requests.newRequest.dossierData.dossierNumber')}</b> {window.location.pathname === '/provisions/detail' ? provisions.currentProvision.dossierCod : requests.newRequestDossier.dossierCod}
      </div>

      <div className={classes.section}>
        <b>{t('requests.newRequest.dossierData.address')}</b> {window.location.pathname === '/provisions/detail' ? provisions.currentProvision.addressDescription : requests.newRequestDossier.address}
      </div>
    </div>
  )
}

export default DossierData
