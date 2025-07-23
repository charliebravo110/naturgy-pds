import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'

import useStyles from './DelegationsButton.module'

import { useTranslation } from 'react-i18next'

const DelegationsButton = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <Link className={classes.link} to={props.to}>
      <Button size='small' className={classes.button}>{t('common.buttons.enter')}</Button>
    </Link>
  )
}

export default DelegationsButton
