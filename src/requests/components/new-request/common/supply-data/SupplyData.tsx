import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useStyles from './SupplyData.styles'

const SupplyData = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const requests = useSelector((state: any) => state.requests)

  const { supplyData } = props

  return (
    <div className={classes.container}>
      <div className={classes.section}>
        <b>{t('requests.newRequest.supplyData.cups')}</b> {window.location.pathname === '/supplies/detail' ? supplyData.cups : requests.newRequestSupply.cups}
      </div>

      <div className={classes.section}>
        <b>{t('requests.newRequest.supplyData.address')}</b> {window.location.pathname === '/supplies/detail' ? supplyData.address && ((supplyData.address.street ? supplyData.address.street : '') + ' ' + (supplyData.address.number ? supplyData.address.number : '') + ', ' + ' ' + (supplyData.address.town ? supplyData.address.town : '') + ', ' + ' ' + (supplyData.address.province ? supplyData.address.province : '') + ' ' + (supplyData.address.zipCode ? supplyData.address.zipCode : '')) : requests.newRequestSupply.address}
      </div>
    </div>
  )
}

export default SupplyData
