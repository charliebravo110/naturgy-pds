import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { thunkListDelegates, thunkDeleteDelegatesList, thunkGetDelegations } from '../../store/actions/DelegatesThunkActions'
import { resetDelegatesList } from '../../store/actions/DelegatesActions'
import { SecurityHOC } from '../../../common/HOC/SecurityHOC'
import Searcher from '../../../common/components/searcher/Searcher'
import List from './list/List'
import Mosaic from'./mosaic/Mosaic'
import NoDelegates from './no-delegates/NoDelegates'
import Spinner from '../../../common/components/spinner/Spinner'
import RemoveManager from '../dialogs/remove-manager/RemoveManager'

import AddIcon from '../../../assets/icons/plus_thicker.svg'
import RemoveIcon from '../../../assets/icons/eliminar.svg'

import useStyles from './DelegatesList.styles'

// LCS: Importar la función - Wave 3
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm'

const DelegatesList = (props: any) => {
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.only('xs'))
    const [ loaded, setLoaded ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ searchedDelegates, setSearchedDelegates ] = useState('')
    const [ selectedDelegates, setSelectedDelegates ] = useState<string[]>([])
    const [ deletePopupOpen, setDeletePopupOpen ] = useState(false)
    const [ deletePopupState, setDeletePopupState ] = useState(1)

    let delegates = useSelector((state: any) => state.delegates.delegatesList)
    let user = useSelector((state: any) => state.user)
    let adminToken = useSelector((state: any) => state.admin.token)
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const delegatesText = props.delegateType === 'US_MANAGER' ? 'managers' : 'consultants'

    const classes = useStyles({})

    const handleCheckbox = ({target}) => {
        if(target.checked){
            setSelectedDelegates([ ...selectedDelegates, target.value ])
        }else{
            setSelectedDelegates(selectedDelegates.filter(value => value !== target.value))
        }
    }

    const handleChangeSearch = (e) => {
        const value = e.toLowerCase()
        handleSearch(value)
    }

    const handleSearch = (value) => {
        const matches = delegates.filter(delegate => (
            delegate.name.toLowerCase().includes(value) ||
            delegate.email.toLowerCase().includes(value) ||
            delegate.documentNumber.toLowerCase().includes(value)
        ))

        if(value === ''){
            setSearchedDelegates('')
        }else{
            setSearchedDelegates(matches)
        }

        setCurrentPage(1)
        
        // LCS: Enviar evento de GdC a GA - Wave 3
        sendGAEvent({
            event: 'search',
            section_name: 'mis suministros',
            subsection_name: props.delegateType === 'US_MANAGER' ? 'mis gestores' : 'mis asesores',
            search_term: value,
            element_type: 'consulta de informacion',          
            page_url: removeEmails(window.location.href),
            browsing_type: sessionStorage.getItem('browsing_type')
        })
    }

    const handleChangePage = (number) => {
        setSelectedDelegates([])

        setCurrentPage(number)
    }

    const closeDeletePopup = () => {
        setDeletePopupOpen(false)
        setDeletePopupState(1)
    }

    const checkDelegationsAndDelete = async() =>{

        let userHasDelegations = false

        const checkDelegations = async(delegate) => {
            await dispatch(thunkGetDelegations(delegate, (response) => {
                if(response.delegations && response.delegations.items.length > 0){
                    userHasDelegations = true
                }
            }))
        }

        for (let i = 0; i < selectedDelegates.length; i++) {
            await checkDelegations(selectedDelegates[i])
        }

        if (userHasDelegations){
            setDeletePopupState(2)
        }else{
            setDeletePopupOpen(false)
            setLoaded(false)
            await dispatch(thunkDeleteDelegatesList(selectedDelegates))
            dispatch(thunkListDelegates(props.delegateType, null, null))
            setLoaded(true)
        }
    }

    useEffect(() => {
        // LCS: Enviar evento de GdC a GA - Wave 3
        sendGAEvent({
        event: 'view',
        content_group: props.delegateType === 'US_MANAGER' ? 'mis gestores' : 'mis asesores',
        page_url: removeEmails(window.location.href),
        user_id: sessionStorage.getItem('id'),
        previous_path: removeEmails(sessionStorage.getItem("previousPage")),
        user_type: sessionStorage.getItem('user_type'),
        browsing_type: sessionStorage.getItem('browsing_type'),
        element_type: 'medicion de pagina',
        ga_client_id: sessionStorage.getItem('ga_client_id'),
        cups: 'no aplica',
        supply_type: 'no aplica'
        });
        sessionStorage.setItem("previousPage", window.location.href);
    },[])

    useEffect(() => {
        if(user.token !== ''){
            const getDelegates = async() => {
                await dispatch(thunkListDelegates(props.delegateType, null, null))
                setLoaded(true)
            }
            getDelegates()
        }

        return function() {dispatch(resetDelegatesList())}
    }, [dispatch, props.delegateType, user.token])

   // LCS: Enviar evento de GdC a GA - Wave 3
    const sendGAEventRemoveSelected = ():void => {
        sendGAEvent({
            event: 'browsing',
            section_name: 'mis suministros',
            subsection_name: (delegatesText === 'managers' ? 'mis gestores' : 'mis asesores'),
            click_text: 'dar de baja a los seleccionados',
            element_type: 'consulta de informacion',
            page_url:window.location.href,
            click_url: 'no aplica',
            browsing_type: sessionStorage.getItem('browsing_type'),
        })
    }

    // LCS: Enviar evento de GdC a GA - Wave 3
    const sendGAEventAddManager = ():void => {
        sendGAEvent({
            event: 'browsing',
            section_name: 'mis suministros',
            subsection_name: (delegatesText === 'managers' ? 'mis gestores' : 'mis asesores'),
            click_text: (delegatesText === 'managers' ? 'añadir nuevo gestor' : 'añadir nuevo asesor'),
            element_type: 'consulta de informacion',
            page_url: removeEmails(window.location.href),
            click_url: window.location.href + '/add',
            browsing_type: sessionStorage.getItem('browsing_type'),
        })
    }

    return (
        <Grid container justifyContent='center' alignItems='center' className={classes.container}>
            <Grid item xs={11} md={10} className={classes.maxWidthForBigScreens} >
                <RemoveManager
                  open={deletePopupOpen}
                  closeFunction={closeDeletePopup}
                  state={deletePopupState}
                  deleteFunction={checkDelegationsAndDelete}
                  managerInfo={props.delegateType}
                />
                <Grid item className={classes.headerTitle}>
                    {t(`delegates.${delegatesText}.title`)}
                </Grid>
                <Grid container justifyContent='space-between'>
                    {
                        delegates[0] ?
                        <Link 
                            to={`/${delegatesText}/add`} 
                            className={`${classes.newDelegate} ${adminToken && 'disabled'}`} 
                            onClick={sendGAEventAddManager}
                        >
                            <img src={AddIcon} alt='+' />
                            {t(`delegates.${delegatesText}List.add`)}
                        </Link>
                        :
                        <span />
                    }
                    <Link to={'/supplies'} className={classes.return}>
                        {t('delegates.delegatesList.return')}
                    </Link>
                </Grid>

                {
                    loaded ? (
                        delegates[0] ?
                        <Grid item className={classes.delegatesContainer} >
                            <Grid container justifyContent='space-between' className={classes.searchBar} >
                                <div
                                    className={`${classes.removeDelegate} ${(selectedDelegates.length === 0 || adminToken) && 'disabled'}`}
                                    onClick={() => {
                                    if (selectedDelegates.length > 0 && !adminToken) {
                                        sendGAEventRemoveSelected();
                                        setDeletePopupOpen(true);
                                    }
                                    }}
                                >
                                    <img src={RemoveIcon} alt='+' />
                                    {t('delegates.delegatesList.remove')}
                                </div>
                                <Searcher
                                    label={t('delegates.delegatesList.searchDelegates')}
                                    handleChangeSearch={handleChangeSearch}
                                />
                            </Grid>
                            {
                                mobile ?
                                    <Mosaic
                                        delegatesText={delegatesText}
                                        listItems={searchedDelegates ? searchedDelegates : delegates}
                                        currentPage={currentPage}
                                        handleCheckbox={handleCheckbox}
                                        handleChangePage={handleChangePage}
                                        adminToken={adminToken}
                                    />
                                :
                                    <List
                                        delegatesText={delegatesText}
                                        listItems={searchedDelegates ? searchedDelegates : delegates}
                                        currentPage={currentPage}
                                        handleCheckbox={handleCheckbox}
                                        handleChangePage={handleChangePage}
                                        adminToken={adminToken}
                                    />
                            }
                        </Grid>
                        :
                        <NoDelegates history={props.history} delegates={delegatesText} />
                    )
                    :
                    <Spinner />

                }
            </Grid>
        </Grid>
    )
  }

  export default SecurityHOC(DelegatesList)
