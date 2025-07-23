import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Checkbox from '../../../../../../common/components/checkbox/Checkbox'

import useStyles from './DelegatesItem.styles'

const DelegatesItem = (props: any) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const {
    color,
    delegateType,
    handleSupplyCheckbox,
    handleCheckbox,
    itemsList,
    cups,
    openDetailPopup,
    openListPopup } = props

  const { t } = useTranslation()

  const classes = useStyles({})

  let supplantedUser = sessionStorage.getItem('supplantedUser')

  const openSupplyCheckbox = (event) => {
    if(event.target.checked){
      setOpen(true)
    }else{
      setOpen(false)
    }

    handleSupplyCheckbox(event, delegateType, cups)
  }

  return (
    <div>
      {
        itemsList.length > 0 &&
        <>
        {
          itemsList.length > 1 ?
          <>
            <div className={`${classes.delegateItem} ${classes.several}`}>
              <Checkbox
                className={classes.supplyCheckBox}
                checked={!itemsList.find(item => item.checked === false)}
                onChange={(event) => openSupplyCheckbox(event)}
              />
              <div className={classes[color]} />
              <div onClick={() => openListPopup(itemsList)} >{t('delegations.various')}</div>
            </div>
            <>
              {
                open &&
                <>
                  { itemsList.map(item =>
                    <div className={classes.delegateItem} key={item.delegationId} >
                      <Checkbox
                        value={item.delegationId}
                        checked={item.checked}
                        onChange={(event) => handleCheckbox(event, item.delegationId)}
                      />
                      <div>{item.name}</div>
                    </div>
                  )}
                </>
              }
            </>
          </>
          :
          <div className={classes.delegateItem} >
            <Checkbox
              value={itemsList[0].delegationId}
              checked={itemsList[0].checked}
              onChange={(event) => handleCheckbox(event, itemsList[0].delegationId)}
            />
            <div className={classes[color]} />
            <div onClick={() => openDetailPopup(itemsList[0])} className={`${classes.singleDelegate} ${supplantedUser && 'disabled'}`} >
              {itemsList[0].name}
            </div>
          </div>
        }
        </>
      }
    </div>
  )
}

export default DelegatesItem
