import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import Spinner from '../../../../common/components/spinner/Spinner'
import Button from '../../../../common/components/button/Button'
import Datepicker from '../../../../common/components/datepicker/Datepicker'
import CloseIcon from '../../../../assets/icons/cerrar.svg'
import NoItemsIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'

import Checkbox from '../../../supplies-list/managed-by-me/components/checkbox/Checkbox'

import {
  setMessage
} from '../../../../common/store/actions/ErrorActions'

import {
  thunkCreateDelegations
} from '../../../store/actions/SuppliesThunkActions'

import { formatDateHyphens } from '../../../../common/lib/FormatLib'

import useStyles, { StyledTableCell } from './Content.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Modal = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const user = useSelector((state: any) => state.user)
  const supplies = useSelector((state: any) => state.supplies)
  const delegations = useSelector((state: any) => state.delegations)

  const {
    history,
    handleCloseDialog,
//    suppliesList,
//    setSuppliesList,
    selectedItemsList,
    setSelectedItemsList,
    delegatesList,
    loadingDelegatesList,
    delegateRole,
    handleOpenAlert,
  } = props

  const [ selectedManager, setSelectedManager ] = useState(-1)
  const [ selectedConsultants, setSelectedConsultants ] = useState([] as any)

  const [ creatingDelegation, setCreatingDelegation ] = useState(false)

  const [ startDate, setStartDate ] = useState('')
  const [ endDate, setEndDate ] = useState('')

  const currentUrl = history.location.pathname

  const handleSelectConsultants = (dni: string) => {
    if (selectedConsultants.includes(dni)) {
      const itemIndex = selectedConsultants.indexOf(dni)

      let auxSelectedItemsList = [ ...selectedConsultants ]

      auxSelectedItemsList.splice(itemIndex, 1)

      setSelectedConsultants(auxSelectedItemsList)
    } else {
      setSelectedConsultants([
        ...selectedConsultants,
        dni
      ])
    }
  }

  const handleAcceptDialog = () => {
    setCreatingDelegation(true)

    let items = [] as any

    selectedItemsList.map(
      (item, index) => {
        let matchedItem = supplies.list.filter(supply => supply.cups === item)[0]

        if (!matchedItem) {
          matchedItem = delegations.delegatesInMeList.filter(supply => supply.cups === item)[0]
        }

        if (matchedItem) {
          if (selectedConsultants.length > 0) {
            selectedConsultants.map(
              (consultant) => {
                let auxItem = {
                  userId: Number(user.profile.userId),
                  delegateId: delegatesList[Number(consultant)].delegateId,
                  cups: item,
                  userDocumentNumber: user.profile.documentNumber,
                  delegateDocumentNumber: delegatesList[Number(consultant)].documentNumber,
                  startDate: formatDateHyphens(startDate),
                  endDate: formatDateHyphens(endDate),
                  address: matchedItem.address ? (matchedItem.address.street ? matchedItem.address.street : '') + ' ' + (matchedItem.address.number ? matchedItem.address.number : '') + ', ' + (matchedItem.address.province ? matchedItem.address.province : '') + ' ' + (matchedItem.address.zipCode ? matchedItem.address.zipCode : '') : '',
                  status: 'P',
                  isGenerator: matchedItem.isGenerator,
                  isMigrated: matchedItem.isMigrated,
                  contractCode: matchedItem.contractCode
                }

                return items.push(auxItem)
              }
            )
          } else {
            let auxItem = {
              userId: Number(user.profile.userId),
              delegateId: delegatesList[selectedManager].delegateId,
              cups: item,
              userDocumentNumber: user.profile.documentNumber,
              delegateDocumentNumber: delegatesList[selectedManager].documentNumber,
              startDate: formatDateHyphens(startDate),
              endDate: formatDateHyphens(endDate),
              address: matchedItem.address ? (matchedItem.address.street ? matchedItem.address.street : '') + ' ' + (matchedItem.address.number ? matchedItem.address.number : '') + ', ' + (matchedItem.address.province ? matchedItem.address.province : '') + ' ' + (matchedItem.address.zipCode ? matchedItem.address.zipCode : '') : '',
              status: 'P',
              isGenerator: matchedItem.isGenerator,
              isMigrated: matchedItem.isMigrated,
              contractCode: matchedItem.contractCode
            }

            items.push(auxItem)
          }
        }

        return null
      }
    )

    if (items.length > 0) {
      dispatch(thunkCreateDelegations(items, (response) => {
        if (response && response.codResult && response.codResult === '1002') {
          const fails = response.msgResult.split(',')

          const errors = {
            '1001': [] as any,
            '1002': [] as any,
            '1003': [] as any,
            '1004': [] as any,
            '1005': [] as any
          }

          fails && fails.length > 0 && fails.map(
            (item) => {
              const data = item.split('-')

              return errors[data[0]].push(data[1])
            }
          )

          let finalString = ''

          if (errors['1001'].length > 0) {
            finalString += t('errors.createDelegations.1002.1001.string1') + errors['1001'].join(', ') + t('errors.createDelegations.1002.1001.string2')
          }

          if (errors['1002'].length > 0) {
            finalString += t('errors.createDelegations.1002.1002.string1') + errors['1002'].join(', ') + t('errors.createDelegations.1002.1002.string2')
          }

          if (errors['1003'].length > 0) {
            finalString += t('errors.createDelegations.1002.1003.string1') + errors['1003'].join(', ') + t('errors.createDelegations.1002.1003.string2')
          }

          if (errors['1004'].length > 0) {
            finalString += t('errors.createDelegations.1002.1004.string1') + errors['1004'].join(', ') + t('errors.createDelegations.1002.1004.string2')
          }

          if (errors['1005'].length > 0) {
            finalString += t('errors.createDelegations.1002.1005.string1') + errors['1005'].join(', ') + t('errors.createDelegations.1002.1005.string2')
          }

          dispatch(setMessage(finalString))
        }

        setCreatingDelegation(false)

        if (response && response.result && response.result.codResult === '0000') {
          handleOpenAlert()
        }

        handleCloseDialog && handleCloseDialog()

        setSelectedItemsList && setSelectedItemsList([])
      }))
    } else {
      setCreatingDelegation(false)
    }
  }

 // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventAltaAsesorGestor = (tipo: any):void => {
    let matchedItem = supplies.list.filter(supply => supply.cups === selectedItemsList[0])[0]
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      click_text: 'dar de alta a un ' + tipo,
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemsList[0],
      supply_type: matchedItem.isGenerator === '0' ? 'consumo' : 'generacion',
      click_url: window.location.host + (tipo==='asesor' ? '/consultants/add' : '/managers/add'),
      browsing_type: sessionStorage.getItem('browsing_type')
    })
  }

 // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventSelectManager = ():void => {
    let matchedItem = supplies.list.filter(supply => supply.cups === selectedItemsList[0])[0]
    sendGAEvent({
      event: 'delegated_manager',
      section_name: 'mis suministros',
      click_text: 'aceptar',
      element_type: 'conversion de accion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemsList[0],
      supply_type: matchedItem.isGenerator === '0' ? 'consumo' : 'generacion',
      browsing_type: sessionStorage.getItem('browsing_type'),
      title_screen: 'listado de gestores',
    })
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
   const sendGAEventSelectConsultant = ():void => {
    let matchedItem = supplies.list.filter(supply => supply.cups === selectedItemsList[0])[0]
    sendGAEvent({
      event: 'delegated_consultant',
      section_name: 'mis suministros',
      click_text: 'aceptar',
      element_type: 'conversion de accion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemsList[0],
      supply_type: matchedItem.isGenerator === '0' ? 'consumo' : 'generacion',
      browsing_type: sessionStorage.getItem('browsing_type'),
      title_screen: 'listado de asesores',
    })
  }

  const sendGAEventSelectManagerConsultant = (tipo: any):void => {
    if (tipo === 'gestor') {
      sendGAEventSelectManager()
    } else {
      sendGAEventSelectConsultant()
    }
  }


  return (
    <>
        {
          loadingDelegatesList ?
            <Spinner />
          :
            <>
              {
                creatingDelegation &&
                  <Spinner />
              }

              <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />

              {
                delegatesList.length === 0 ?
                  <Grid container className={classes.noItems}>
                    <Grid item>
                      <img src={NoItemsIcon} alt='' />

                      <Grid container>
                        <Grid container className='row title'>{delegateRole === 'US_MANAGER' ? t('common.delegatesNotResults.managers.title') : t('common.delegatesNotResults.consultants.title')}</Grid>

                        <Grid container className='row description'>{delegateRole === 'US_MANAGER' ? t('common.delegatesNotResults.managers.description') : t('common.delegatesNotResults.consultants.description')}</Grid>

                        <Grid container className='row button'>
                          <Button
                            text={delegateRole === 'US_MANAGER' ? t('common.delegatesNotResults.managers.button') : t('common.delegatesNotResults.consultants.button')}
                            color='primary'
                            size='large'
                            variant='contained'
                            onClick={() => {
                              sendGAEventAltaAsesorGestor(delegateRole === 'US_MANAGER' ? 'gestor' : 'asesor');                              
                              if (delegateRole === 'US_MANAGER') {
                                history.push({
                                  pathname: '/managers/add',
                                  state: {
                                    redirect: currentUrl
                                  }
                                })
                              } else {
                                history.push({
                                  pathname: '/consultants/add',
                                  state: {
                                    redirect: currentUrl
                                  }
                                })
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                :
                  <Grid container className={classes.managers}>
                    {
                      delegateRole === 'US_MANAGER' ?
                        <>
                          <Grid container className='title'>{t('delegations.delegatesDialog.managers.title')}</Grid>

                          <Grid container className='description'>{t('delegations.delegatesDialog.managers.description')}</Grid>

                          {
                            mobile ?
                              <Grid container className='list'>
                                {
                                  delegatesList.map(
                                    (item, index) => (
                                      <Grid className='manager' key={index}>
                                        <div
                                          className={`radioButton ${classes.radioButton} ${selectedManager === index && 'active'}`}
                                          onClick={() => { setSelectedManager(index)}}
                                        />

                                        <div className='name'>{item.name}</div>

                                        <div className='email'>{item.email}</div>

                                        <div className='dni'><span>{t('delegations.delegatesDialog.managers.nif')}:</span> {item.documentNumber}</div>
                                      </Grid>
                                    )
                                  )
                                }
                              </Grid>
                            :
                              <Table className={classes.table}>
                                <TableHead>
                                  <TableRow>
                                    <StyledTableCell>{t('delegations.delegatesDialog.managers.name')}</StyledTableCell>

                                    <StyledTableCell>{t('delegations.delegatesDialog.managers.email')}</StyledTableCell>

                                    <StyledTableCell>{t('delegations.delegatesDialog.managers.nif')}</StyledTableCell>

                                    <StyledTableCell />
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {
                                    delegatesList.map(
                                      (item, index) => (
                                        <TableRow key={index} className='row'>
                                          <StyledTableCell>{item.name}</StyledTableCell>

                                          <StyledTableCell>{item.email}</StyledTableCell>

                                          <StyledTableCell>{item.documentNumber}</StyledTableCell>

                                          <StyledTableCell>
                                            <div
                                              className={`${classes.radioButton} ${selectedManager === index && 'active'}`}
                                              onClick={() => setSelectedManager(index)}
                                            />
                                          </StyledTableCell>
                                        </TableRow>
                                      )
                                    )
                                  }
                                </TableBody>
                              </Table>
                          }
                        </>
                      :
                        <>
                          <Grid container className='title'>{t('delegations.delegatesDialog.consultants.title')}</Grid>

                          <Grid container className='description'>{t('delegations.delegatesDialog.consultants.description')}</Grid>

                          {
                            mobile ?
                              <Grid container className='list'>
                                {
                                  delegatesList.map(
                                    (item, index) => (
                                      <Grid className='manager' key={index}>
                                        <div className={classes.checkbox}>
                                          <Checkbox selected={selectedConsultants.includes(index)} handleClick={() => {handleSelectConsultants(index)}} />
                                        </div>

                                        <div className='name'>{item.name}</div>

                                        <div className='email'>{item.email}</div>

                                        <div className='dni'><span>{t('delegations.delegatesDialog.consultants.nif')}:</span> {item.documentNumber}</div>
                                      </Grid>
                                    )
                                  )
                                }
                              </Grid>
                            :
                              <Table className={classes.table}>
                                <TableHead>
                                  <TableRow>
                                    <StyledTableCell>{t('delegations.delegatesDialog.consultants.name')}</StyledTableCell>

                                    <StyledTableCell>{t('delegations.delegatesDialog.consultants.email')}</StyledTableCell>

                                    <StyledTableCell>{t('delegations.delegatesDialog.consultants.nif')}</StyledTableCell>

                                    <StyledTableCell />
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {
                                    delegatesList.map(
                                      (item, index) => (
                                        <TableRow key={index} className='row'>
                                          <StyledTableCell>{item.name}</StyledTableCell>

                                          <StyledTableCell>{item.email}</StyledTableCell>

                                          <StyledTableCell>{item.documentNumber}</StyledTableCell>

                                          <StyledTableCell>
                                            <Checkbox selected={selectedConsultants.includes(index)} handleClick={() => handleSelectConsultants(index)} />
                                          </StyledTableCell>
                                        </TableRow>
                                      )
                                    )
                                  }
                                </TableBody>
                              </Table>
                          }
                        </>
                    }

                    {
                      (selectedManager !== -1 || selectedConsultants.length > 0) &&
                        <Grid container className={classes.periods}>
                          <div className='title'>{t('delegations.delegatesDialog.rangeDates')}</div>

                          <Grid container>
                            <Grid item className={classes.dateContainer}>
                              <div className='label'>{t('delegations.delegatesDialog.startDate')}:</div>

                              <Datepicker date={startDate} setDate={setStartDate} maxDate={endDate === '' ? true : endDate} />
                            </Grid>

                            <Grid item className={`${classes.dateContainer} ${classes.endDateContainer}`}>
                              <div className='label'>{t('delegations.delegatesDialog.endDate')}:</div>

                              <Datepicker date={endDate} setDate={setEndDate} minDate={startDate} maxDate={true} />
                            </Grid>
                          </Grid>
                        </Grid>
                    }

                    <Grid container className='buttons'>
                      <Button
                        text={t('common.buttons.cancel')}
                        color='inherit'
                        size='large'
                        variant='contained'
                        onClick={handleCloseDialog}
                      />

                      <Button
                        text={t('common.buttons.accept')}
                        color='primary'
                        size='large'
                        variant='contained'
                        disabled={
                          startDate === '' ||
                          endDate === '' ||
                          (delegateRole === 'US_MANAGER' && selectedManager === -1) ||
                          (delegateRole === 'US_CONSULTANT' && selectedConsultants.length === 0)
                        }
                        onClick={() => {sendGAEventSelectManagerConsultant((delegateRole === 'US_MANAGER' ? 'gestor' : 'asesor')); handleAcceptDialog()}}
                        
                      />
                    </Grid>
                  </Grid>
              }
            </>
        }
    </>
  )
}

export default Modal
