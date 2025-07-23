import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import LeftArrowIcon from '../../../assets/icons/flecha_izquierda.svg'
import RightArrowIcon from '../../../assets/icons/flecha_derecha.svg'

import { thunkListSupplies } from '../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'

import useStyles from './SupplyPagination.styles'

const SupplyPagination = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const suppliesRdx = useSelector((state: any) => state.supplies)

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

    let currentItems = suppliesRdx.list.slice(
      (currentPage * itemsPerPage),
      ((currentPage * itemsPerPage) + itemsPerPage)
    ) as any

    // let firstItem = dossiersRdx.provisionsList.indexOf(currentItems[0]) // índice del primer elemento visible (en la página actual)
    let lastItem = suppliesRdx.list.indexOf(currentItems[currentItems.length - 1]) // índice del último elemento visible (en la página actual)

    if (lastItem === (suppliesRdx.list.length - 1)) {
      // comprobar si el total de expedientes cargados es menor al total de expedientes del usuario
      if (suppliesRdx.list.length < suppliesRdx.count) {
        // cargar más expedientes mediante una llamada a listDossiers
        setIsLoading(true)

        dispatch(thunkListSupplies(
          defaultSupplyName,
          //(lastItem + 2), // offset
          //itemsPerPage, // limit
          //searchValue, // búsqueda por cups
          //false, // proveniente de cupsSearch para la busqueda
          //0, // offset [delegatePoints]
          //15, // limit [delegatePoints]
          false, // proveniente de cupsSearch para la busqueda [delegatePoints]
          true, // accion contra supplyPoints
          false, // accion contra delegatePoints
          (response) => {
            if (response && response.supplypoints && response.supplypoints.length > 0) {
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
                    className={`${classes.icon} ${(currentPage + 1) === totalPages && 'disabled'}`}
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

export default SupplyPagination
