import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Toolbar from '../toolbar/Toolbar'
import List from '../list/List'
import Mosaic from '../mosaic/Mosaic'
import NoItemsAlert from '../../../components/no-items-alert/NoItemsAlert'

import { validateCupsNumber } from '../../../../../common/lib/ValidationLib'

import {
  setDelegatesInMeDelegations,
  resetDelegatesInMeDelegations,
} from '../../../../store/actions/SuppliesActions'
import { thunkListSupplies } from '../../../store/actions/SuppliesListThunkActions'

import useStyles from './DelegatesInMe.styles'

import { thunkListDelegates } from '../../../../../delegates/store/actions/DelegatesThunkActions'
import { thunkGetDelegationsInMe } from '../../../store/actions/SuppliesListThunkActions'

import { setDelegationsToDelete } from '../../../../store/actions/SuppliesActions'
import { thunkGetContractsSupply, thunkGetContractsUserDelegates } from '../../../../store/actions/SuppliesThunkActions'
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

const DelegatesInMe = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const documentNumber = useSelector((state: any) => state.user.profile.documentNumber)
  let supplantedUser = sessionStorage.getItem('supplantedUser')
  let delegationsToDelete = useSelector((state: any) => state.delegations.delegationsToDelete)

  const {
    selectedTab,
    delegationsDelegatesInMeList,
    setIsLoading,
    setBajaDelegation,
    contractsEnabled
  } = props

  const delegations = useSelector((state: any) => state.delegations)
  const delegationsInManagersList = useSelector((state: any) => state.delegations.delegationsInManagersList)
  const delegatesInMeList = useSelector((state: any) => state.delegations.delegatesInMeList)
  const supplies = useSelector((state: any) => state.supplies)

  let defaultSupplyName = t('delegations.supplyPointDefaultName')

  const [selectedItemsList, setSelectedItemsList] = useState([] as any)
  const [delegationSearchResult, setDelegationSearchResult] = useState('')
  const [view, setView] = useState(0)

  // paginación
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [totalPages, setTotalPages] = useState(0)
  const [finalList, setFinalList] = useState(delegationsDelegatesInMeList)

  const [contractsCall, setContractsCall] = useState(true)
  const [contractList, setContractList] = useState([])

  // LCS: Carga de componente - Wave GdC
  useEffect(() => {
    sendGAEvent({
      event: 'component_loaded',
      info: {
        reactComponent: 'DelegatesInMe.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  useEffect(() => {
    if (finalList.length > 20) {
      setTotalPages(delegationsDelegatesInMeList.length === 0 ? 1 : Math.ceil(delegationsDelegatesInMeList.length / itemsPerPage))
    } else {
      setTotalPages(1)
    }

    // eslint-disable-next-line
  }, [delegationsDelegatesInMeList, itemsPerPage, finalList])


  useEffect(() => {
    if (contractsEnabled) {

      if (contractsCall && delegatesInMeList.length > 0) {
  
        const processDelegatesDocuments = async () => {
          let accumulatedSolicitud = [];
          let accumulatedRespCupsDocs = [];
          let equivalentContract;
          let matchingContract;
          let matchingProcess;
  
          
            await new Promise<void>((resolve) => {
              dispatch(thunkGetContractsUserDelegates(documentNumber, (response) => {
                if (response?.resp?.solicitudes?.solicitud) {
                  accumulatedSolicitud = accumulatedSolicitud.concat(response.resp.solicitudes.solicitud);
                }
                resolve();
              }));
            });


            const activeSolicitud = accumulatedSolicitud.filter(solicitud => solicitud.cdaStatus === '0')
          

            const documentos = activeSolicitud.map(item => item.cdaDocumento).join(', ');
            const cups = activeSolicitud.map(item => item.cdaCups).join(', ');

  
  
          if (documentos.length > 0 && cups.length > 0) {
          
              await new Promise<void>((resolve) => {                
                
                dispatch(thunkGetContractsSupply(documentos, cups, (response) => {
                  if (response?.resp?.respCupsDocs?.respCupsDoc) {
                    accumulatedRespCupsDocs = accumulatedRespCupsDocs.concat(response.resp.respCupsDocs.respCupsDoc);
                  }
                  resolve();
                }));

    
              });

            
            
    
            const newContracts = [];
            //delegatesInMeList
            for (const item of delegatesInMeList) {
              matchingContract = accumulatedRespCupsDocs.find(doc => doc.cdaCups === item.cups);
              if (matchingContract) {
                equivalentContract = activeSolicitud.find(doc => doc.cdaCups === matchingContract.cdaCups);
                if (equivalentContract) {
                  matchingProcess = matchingContract.procesos.proceso.find(proceso => proceso.cdaSolicitud === equivalentContract.cdaSolicitud);
    
                  if (matchingProcess) {
                    newContracts.push({
                      cups: matchingContract.cdaCups,
                      proceso: matchingProcess
                    });
                  }
                }
              }
            }
    
            // Actualizar el estado en una sola llamada
            setContractList(prevList => [...prevList, ...newContracts]);
            
          }
  
        };
  
        // Ejecutamos la función asíncrona
        processDelegatesDocuments().then(() => {
          setContractsCall(false);
        });
  
      }

    } 
  }, [contractsCall, delegatesInMeList]);
  
  const [showingDialog, setShowingDialog] = useState(false)

  const [delegatesList, setDelegatesList] = useState([] as any)

  const [delegateRole, setDelegateRole] = useState('')

  const [loadingDelegatesList, setLoadingDelegatesList] = useState(true)

  const handleDelegateOrAuthorize = (role: string) => {
    setShowingDialog(true)

    setDelegateRole(role)

    dispatch(thunkListDelegates(role, setLoadingDelegatesList, (response) => {
      if (response && response.result.codResult === '0000') {
        if (response.delegates.items.length === 0) {
          setDelegatesList([])
        } else {
          setDelegatesList(response.delegates.items)
        }
      } else {
        setShowingDialog(false)
      }
    }))
  }

  const handleClickDelegate = (active: boolean, role: string) => {
    if (active) {
      handleDelegateOrAuthorize(role)
    }
  }

  const handleClickCheckbox = (cups: any) => {

    if (cups) {

      if (selectedItemsList.includes(cups)) {

        const itemIndex = selectedItemsList.indexOf(cups)

        let auxSelectedItemsList = [...selectedItemsList]

        auxSelectedItemsList.splice(itemIndex, 1)

        setSelectedItemsList(auxSelectedItemsList)
      } else {

        setSelectedItemsList([
          ...selectedItemsList,
          cups
        ])
      }
    } else if (delegationsDelegatesInMeList.length > 0) {

      if (selectedItemsList.length < delegationsDelegatesInMeList.length) {

        let auxSelectedItemsList = delegationsDelegatesInMeList.map(item => item.cups)

        setSelectedItemsList(auxSelectedItemsList)
      } else {

        setSelectedItemsList([])
      }
    }

  }

  const handleChangeView = (newView) => {
    setView(newView)

    setCurrentPage(1)
  }
  const handleChangePage = (newPage) => {
    setCurrentPage(newPage)
  }
  const handleChangeSearch = (value) => {
    handleSearch(value.toLowerCase())
  }
  const handleSearch = (value) => {
    const cups = value.toUpperCase()

    if (cups !== '') {
      if (validateCupsNumber(cups)) {
        setIsLoading(true)

        setCurrentPage(0)

        // llamada al servicio listSupplies
        dispatch(thunkListSupplies(
          defaultSupplyName,
          //1, // offset
          //15, // limit
          //cups === '' ? null : cups, // búsqueda por cups
          //false, // proveniente de una busqueda
          //0, // offset [delegatePoints]
          //1, // limit [delegatePoints]
          true, // proveniente de cupsSearch para la busqueda [delegatePoints]
          false, // accion contra supplyPoints
          true, // accion contra delegatePoints
          (response) => {
            // callback
            if (response) {
              const searchedCups = response.delegatepoints && response.delegatepoints.filter(item => item.cups === cups)
              // se setea la nueva lista si se ha encontrado el CUPS del usuario
              if (searchedCups && searchedCups.length > 0) {
                // resetear lista de suministros
                dispatch(resetDelegatesInMeDelegations())
                dispatch(setDelegatesInMeDelegations(searchedCups))
              }
            }

            setIsLoading(false)
          }
        ))
      }
    } else {
      // solo se resetea la lista si se ha realizado una busqueda
      if (delegations.delegatesInMeList.length === 1) {
        setIsLoading(true)

        dispatch(resetDelegatesInMeDelegations())

        dispatch(thunkListSupplies(
          defaultSupplyName,
          //1,
          //15,
          //null,
          //false,
          //0, // offset [delegatePoints]
          //15, // limit [delegatePoints]
          false, // proveniente de cupsSearch para la busqueda [delegatePoints]
          false, // accion contra supplyPoints
          true, // accion contra delegatePoints
          (response) => {
            // callback
            setIsLoading(false)
          }
        ))
      }
    }
  }

  const findDelegationsToDelete = () => {

    //vamos a rellenar el array de las delegaciones a borrar
    if (selectedItemsList.length > 0) {
      let delegationsToDeleteArray = []
      let k = 0;
      for (let i = 0; i < selectedItemsList.length; i++) {
        for (let j = 0; j < delegationsDelegatesInMeList.length; j++) {
          if (selectedItemsList[i] === delegationsDelegatesInMeList[j].cups) {
            //Ahora vamos a buscar el delgation_id

            let startDateOrig = delegationsDelegatesInMeList[j].startDate
            let startDateFormat = startDateOrig.substr(8, 2) + '/' +
              startDateOrig.substr(5, 2) + '/' + startDateOrig.substr(0, 4)
            let endDateOrig = delegationsDelegatesInMeList[j].endDate
            let endDateFormat = endDateOrig.substr(8, 2) + '/' +
              endDateOrig.substr(5, 2) + '/' + endDateOrig.substr(0, 4)

            dispatch(thunkGetDelegationsInMe(
              delegationsDelegatesInMeList[j].cups,
              startDateFormat,
              endDateFormat,
              delegationsDelegatesInMeList[j].holderDocumentNumber,
              true,
              (response) => {
                // callback
                if (response.delegations && response.delegations.items.length > 0) {

                  for (let x = 0; x < response.delegations.items.length; x++) {
                    if (!delegationsToDeleteArray.includes(response.delegations.items[x].delegationId))
                      delegationsToDeleteArray.push(response.delegations.items[x].delegationId)
                  }

                  if (++k == selectedItemsList.length) {
                    dispatch(setDelegationsToDelete(delegationsToDeleteArray))
                    setBajaDelegation(true);
                  }
                }
              })
            )

          }

        }
      }

    } else {
      if (delegationsToDelete.length > 0) {
        dispatch(setDelegationsToDelete([]))
      }

    }

  }
  return (
    <>
      <Toolbar
        view={view}
        handleChangeView={handleChangeView}
        handleChangeSearch={handleChangeSearch}
        handleSearch={handleSearch}
        mobile={mobile}
        setCurrentPage={setCurrentPage}
        supplies={supplies}
        delegationsInManagersList={delegationsInManagersList}
        delegatesInMeList={delegationsDelegatesInMeList}
        history={props.history}
        handleClickDelegate={handleClickDelegate}
        selectedItemsList={selectedItemsList}
        handleClickCheckbox={handleClickCheckbox}
        finalList={finalList}
        setFinalList={setFinalList}
        openBajaDelegation={() => {
          if (selectedItemsList.length > 0 && !supplantedUser) {
            findDelegationsToDelete()
          }
        }}
      />

      <Grid container className={classes.table}>
        {
          (finalList.length === 0 || (delegationSearchResult && delegationSearchResult.length === 0)) ?
            <NoItemsAlert
              defaultMessage={t('delegations.delegatesInMe.defaultMessage')}
              searchMessage={t('delegations.delegatesInMe.searchMessage')}
            />
            :
            (view === 0 && !mobile) ?
              <List
                listItems={finalList}
                setFinalList={setFinalList}
                selectedItemsList={selectedItemsList}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                handleClickCheckbox={handleClickCheckbox}
                handleChangePage={handleChangePage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalPages={totalPages}
                selectedTab={selectedTab}
                setIsLoading={setIsLoading}
                view={view}
                contractList={contractList}
              />
              :
              <Mosaic
                listItems={finalList}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                handleChangePage={handleChangePage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalPages={totalPages}
                handleClickCheckbox={handleClickCheckbox}
                selectedItemsList={selectedItemsList}
                selectedTab={selectedTab}
                setIsLoading={setIsLoading}
                view={view}
                contractList={contractList}
              />
        }
      </Grid>
    </>
  )
}

export default DelegatesInMe

