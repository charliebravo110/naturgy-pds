import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Input from '../../../../../common/components/input/Input'

import { setNewRequestData } from '../../../../store/actions/RequestsActions'

import useStyles from './Comment.styles'

const Comment = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const requests = useSelector((state: any) => state.requests)

  const handleChangeComment = (e) => {
    const value = e.target.value

    dispatch(setNewRequestData({
      comment: value
    }))
  }

  return (
    <div className={classes.container}>
      <div className={classes.label}>{t('requests.newRequest.form.comment.label')}</div>

      <Input
        fullWidth
        multiline
        rows='5'
        value={requests.newRequestData.comment}
        onChange={handleChangeComment}
        inputProps={{
          maxlength: '300'
        }}
      />

      <Grid container justifyContent='flex-end'>
        <Grid item className={classes.characterCount}>
          {t('requests.newRequest.form.comment.characterCount.part1')}

          <b>{(300 - requests.newRequestData.comment.length)}</b>

          {t('requests.newRequest.form.comment.characterCount.part2')}

          <b>300</b>
        </Grid>
      </Grid>
    </div>
  )
}

export default Comment
