import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import LeftArrowIcon from '../../../assets/icons/flecha_izquierda.svg'
import RightArrowIcon from '../../../assets/icons/flecha_derecha.svg'

import { thunkListSupplies } from '../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'

import useStyles from './DelegatePagination.styles'

const DelegatePagination = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const delegationsRdx = useSelector((state: any) => state.delegations)

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    searchValue,
    setIsLoading
  } = props

  const handleClickLeftArrow = () => {
    // actualizamos la página actual
    setCurrentPage(currentPage === 0 ? 0 : (currentPage - 1))
  }

  const handleClickRightArrow = () => {
    let defaultSupplyName = t('delegations.supplyPointDefaultName')

    let currentItems = delegationsRdx.delegatesInMeList.slice(
      (currentPage * itemsPerPage),
      ((currentPage * itemsPerPage) + itemsPerPage)
    ) as any

    let lastItem = delegationsRdx.delegatesInMeList.indexOf(currentItems[currentItems.length - 1]) // índice del último elemento visible (en la página actual)

    if (lastItem === (delegationsRdx.delegatesInMeList.length - 1)) {
      const newOffset = (currentPage + 1)

      if (newOffset <= totalPages) {
        // cargar más expedientes mediante una llamada a listDossiers
        setIsLoading(true)

        dispatch(thunkListSupplies(
          defaultSupplyName,
          //1, // offset
          //15, // limit
          //searchValue, // búsqueda por cups
          //false, // proveniente de cupsSearch para la busqueda
          //newOffset, // offset [delegatePoints]
          //15, // limit [delegatePoints]
          false, // proveniente de cupsSearch para la busqueda [delegatePoints]
          false, // accion contra supplyPoints
          true, // accion contra delegatePoints
          (response) => {
            if (response && response.delegatepoints && response.delegatepoints.length > 0) {
              // avanzar una página
              setCurrentPage(currentPage + 1)
            }

            setIsLoading(false)
          }
        ) as any)
      }
    } else {
      // avanzar una página
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <>
      {
        totalPages > 1 &&
          <Grid container className={classes.container}>
            <Grid item>
                <Grid container justifyContent='center'>
                  <img
                    className={`${classes.icon} ${currentPage === 0 && 'disabled'}`}
                    src={LeftArrowIcon}
                    alt=''
                    onClick={handleClickLeftArrow}
                  />

                  <span className={classes.label}><strong>{(currentPage + 1)}</strong> {t('common.pagination.span')} {totalPages}</span>

                  <img
                    className={`${classes.icon} ${(currentPage + 2) > totalPages && 'disabled'}`}
                    src={RightArrowIcon}
                    alt=''
                    onClick={handleClickRightArrow}
                  />
                </Grid>
            </Grid>
          </Grid>
      }
    </>
  )
}

export default DelegatePagination
