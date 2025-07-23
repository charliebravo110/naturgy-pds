import React, { Fragment, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Button from '../../../common/components/button/Button'

import useStyles from './SignUp.styles'
import { useDispatch } from 'react-redux'
import { thunkGetLoginToken } from '../../store/actions/LoginThunkActions'
import { validateUserCode } from '../../../common/lib/ValidationLib'
import { fixNifLength } from '../../../common/lib/FormatLib'
import LoginService from '../../LoginService'
import { setUserProfile } from '../../../common/store/actions/UserActions'
import Spinner from '../../../common/components/spinner/Spinner'

const SignUp = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()


  const [isLoading, setIsLoading] = useState(false)


  const handleSend = () => {
    setIsLoading(true);
    dispatch(thunkGetLoginToken(setIsLoading, {}, (response) => {
      if (response && response?.result?.codResult == "0000") {
        props.history.push('/offlinepayment')
      }
      setIsLoading(false);
    }));
  }

  return (
    <Fragment>
      {
        isLoading &&
        <Spinner fixed={true} />
      }
      <div className={classes.title}>{t('login.signUp.title')}</div>

      <div className={classes.text}>{t('login.signUp.description')}</div>

      <Button
        className={classes.button}
        text={t('login.signUp.button')}
        size={'large'}
        variant={'contained'}
        onClick={() => props.history.push('/signup')}
      />

      <div className={classes.separator} />

      <div className={classes.title}>{t('provisions.offlinePayment.noRegisterOp')}</div>

      <Button
        className={classes.button}
        text={t('provisions.offlinePayment.paymentTitle')}
        size={'large'}
        variant={'contained'}
        onClick={handleSend}
      />
    </Fragment>
  )
}

export default withRouter(SignUp)
