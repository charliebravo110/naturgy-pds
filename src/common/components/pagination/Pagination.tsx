import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import LeftArrowIcon from '../../../assets/icons/flecha_izquierda.svg'
import RightArrowIcon from '../../../assets/icons/flecha_derecha.svg'

import useStyles from './Pagination.styles'

const Pagination = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    totalPages,
    currentPage,
    handleChangePage
  } = props

  return (
    <>
    {
    totalPages > 1 &&
    <Grid container className={classes.pagination}>
      <Grid item>
          <Grid container justifyContent='center'>
            <img
              className={classes.icon}
              src={LeftArrowIcon}
              alt=''
              onClick={() => {
                if (currentPage > 1) {
                  handleChangePage(currentPage - 1)
                }
              }}
            />

            <span className={classes.label}><strong>{currentPage}</strong> {t('common.pagination.span')} {totalPages}</span>

            <img
              className={classes.icon}
              src={RightArrowIcon}
              alt=''
              onClick={() => {
                if (currentPage < totalPages) {
                  handleChangePage(currentPage + 1)
                }
              }}
            />
          </Grid>
      </Grid>
    </Grid>
    }
    </>
  )
}

export default Pagination
