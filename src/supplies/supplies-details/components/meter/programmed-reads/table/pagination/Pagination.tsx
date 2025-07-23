import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import LeftArrowIcon from '../../../../../../../assets/icons/flecha_izquierda.svg'
import RightArrowIcon from '../../../../../../../assets/icons/flecha_derecha.svg'

import {
  appendCurrentSupplyProgrammedReads
} from '../../../../../../store/actions/SuppliesActions'
import { thunkListProgrammedReads } from '../../../../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './Pagination.styles'
import { thunkListDelegatesByCreatorUserId, thunkListDelegatesByDocId } from '../../../../../../../delegates/store/actions/DelegatesThunkActions'

const Pagination = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const programmedReads = useSelector((state: any) => state.supplies.currentSupplyProgrammedReads)
  const user = useSelector((state: any) => state.user.profile)
  const admin = useSelector((state: any) => state.admin.profile)
  const delegatesInMeList = useSelector((state: any) => state.delegations.delegatesInMeList)


  const {
    supplyData,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setIsLoading
  } = props

  // INI RVD - PPM 1009750
  const [IdDelegatesList, setIdDelegatesList] = useState('')
  const [IdDelegatesInMeList, setIdDelegatesInMeList] = useState('')
  const delegatedCups = delegatesInMeList && delegatesInMeList.find(item => item.cups === supplyData.cups)
  // FIN RVD - PPM 1009750

  const handleClickLeftArrow = () => {
    // actualizamos la página actual
    setCurrentPage(currentPage === 0 ? 0 : (currentPage - 1))
  }

  // INI RVD - PPM 1009750
  useEffect(() => {
    if (user && user.userId) {
      dispatch(thunkListDelegatesByCreatorUserId(user.userId,(response) => {
        if (response) {
          const items = response.delegates.items;
          const userIds = items.map(item => item.userId.toString())
          setIdDelegatesList(userIds)
        }
      }))
    }

    if (delegatedCups) {
      if (user && user.documentNumber) {
        dispatch(thunkListDelegatesByDocId(user.documentNumber,(response) => {
          if (response) {
            const items = response.delegates.items;
            const userIds = items.map(item => item.creatorUserId.toString())
            setIdDelegatesInMeList(userIds)
          }
        }))
      }
    }
   
  }, [user,delegatedCups])
  // FIN RVD - PPM 1009750

  const handleClickRightArrow = () => {
    let currentItems = programmedReads.items.slice(
      (currentPage * itemsPerPage),
      ((currentPage * itemsPerPage) + itemsPerPage)
    ) as any

    let lastItem = programmedReads.items.indexOf(currentItems[currentItems.length - 1]) // índice del último elemento visible (en la página actual)

    if (lastItem === (programmedReads.items.length - 1)) {
      // comprobar si el total de lecturas cargadas es menor al total de lecturas del usuario
      if (programmedReads.items.length < programmedReads.count) {
        // cargar más lecturas mediante una llamada a listProgrammedReads
        setIsLoading(true)

        const meterId = (
          supplyData &&
          supplyData.measurementEquipments &&
          supplyData.measurementEquipments.meters[0] &&
          supplyData.measurementEquipments.meters[0].meter
        ) ?
          supplyData.measurementEquipments.meters[0].meter
        :
          ''

        dispatch(thunkListProgrammedReads(
          meterId,
          (currentPage + 1),
          itemsPerPage,
          (reads) => {
            // INI RVD - PPM 1009750
            let finalReads

            if (reads && reads.count > 0 && reads.items && reads.items.length > 0) {

              if (admin.userId) {
                finalReads = reads
              }
              else {
                const userItems = reads.items.filter((item) => {
                  if (item.actionId.split('/')[0] && item.actionId.split('/')[0] === user.userId) {
                    return item
                  }
                  else if (item.actionId.split('/')[0] && IdDelegatesList && IdDelegatesList.includes(item.actionId.split('/')[0])) {
                    return item
                  }
                  else if (item.actionId.split('/')[0] && delegatedCups && IdDelegatesInMeList.includes(item.actionId.split('/')[0])) {
                    return item
                  }
                })

                finalReads = {
                  count: reads.count,
                  items: userItems
                }
              }
            }
            // FIN RVD - PPM 1009750
            if (finalReads && finalReads.items && finalReads.items.length > 0) {
              dispatch(appendCurrentSupplyProgrammedReads(finalReads.items))

              // avanzar una página
              setCurrentPage(currentPage + 1)
            }

            setIsLoading(false)
          }
        ))
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

export default Pagination
