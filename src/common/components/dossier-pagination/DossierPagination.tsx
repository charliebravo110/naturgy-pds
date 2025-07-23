import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import LeftArrowIcon from '../../../assets/icons/flecha_izquierda.svg'
import RightArrowIcon from '../../../assets/icons/flecha_derecha.svg'

import { thunkListDossiers } from '../../../provisions/store/actions/ProvisionsThunkActions'

import useStyles from './DossierPagination.styles'

const DossierPagination = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const dossiersRdx = useSelector((state: any) => state.provisions)

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
    let defaultDossierName = t('provisions.defaultName')

    let currentItems = dossiersRdx.provisionsList.slice(
      (currentPage * itemsPerPage),
      ((currentPage * itemsPerPage) + itemsPerPage)
    ) as any

    // let firstItem = dossiersRdx.provisionsList.indexOf(currentItems[0]) // índice del primer elemento visible (en la página actual)
    let lastItem = dossiersRdx.provisionsList.indexOf(currentItems[currentItems.length - 1]) // índice del último elemento visible (en la página actual)

    if (lastItem === (dossiersRdx.provisionsList.length - 1)) {
      const newOffset = (currentPage + 2)

      if (newOffset <= totalPages) {
        // cargar más expedientes mediante una llamada a listDossiers
        setIsLoading(true)

        dispatch(thunkListDossiers(
          defaultDossierName,
          newOffset, // offset
          20, // limit
          searchValue, // búsqueda por dossierCod
          false, // proveniente de un busqueda
          (response) => {
            if (response && response.length > 0) {
              // avanzar una página
              setCurrentPage(currentPage + 1)
            }
  
            setIsLoading(false)
          }) as any)
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

export default DossierPagination
