
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import useStyles from './ActiveUsers.styles';
import Spinner from '../../../../common/components/spinner/Spinner';
import List from './List/List';
import FilterInputs from './filterInputs/FilterInputs';
import XLSX from 'xlsx'
import { validateNIF, validateCIF, validateNIE, validateMail, checkDocumentTypeInString } from '../../../../common/lib/ValidationLib';

import {thunkGetAllLoginUsers, thunkGetLoginUsers } from '../../../actions/UsuariosThunkActions';
import { isMobileApp } from '../../../../mobile-apps/common/detectPlatform';
import createFileAndOpenIt from '../../../../mobile-apps/local-downloads/createFileAndOpenIt';

// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../../../core/utils/gtm';

const ActiveUsers = (props: any) => {

    const classes = useStyles({})
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const searchedUser = useSelector((state: any) => state.admin.searchedUser)
    const adminToken = useSelector((state: any) => state.admin.token)

    //filtros busqueda
    const [credentialDoc, setCredentialDoc] = useState('')
    const [credentialType, setCredentialType] = useState('')
    const [credentialEmail, setCredentialEmail] = useState('')
    const [fechaAlta, setFechaAlta] = useState<Date>()
    const [fechaLastLogin, setFechaLastLogin] = useState<Date>()
    const [enableSearch, setEnableSearch] = useState<boolean>(false)
    const [errorDoc, setErrorDoc] = useState<Boolean>(false)
    const [errorEmail, setErrorEmail] = useState<Boolean>(false)

    const [searcheUsers, setSearchedUsers] = useState([] as any)

    const [startItems, setStartItems] = useState<number>(0)
    const [endItems, setEndItems] = useState<number>(0)
    const [totalItems, setTotalItems] = useState<number>(0)

    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(20)
    const [totalPagesFilter, setTotalPagesFilter] = useState(0)

    const handleChangeInput = (input, value): any => {

        if (input === 'credential') {
            validateCredentials(value, checkDocumentTypeInString(value))
            setCredentialDoc(value)
            setCredentialType(checkDocumentTypeInString(value))

        }
        else if (input === 'email') {
            validateEmail(value)
            setCredentialEmail(value)
        }
    }

    const handleSearchAll = () => {
        setIsLoading(true)
        dispatch(thunkGetAllLoginUsers((response) => {
            if (response) {
                setSearchedUsers(response.usersLogin.items)
                setIsLoading(false)
            }
            else setIsLoading(false)
        }))
        
        // LCS: comprobamos el rol del usuario - Wave 3
        const user_type = sessionStorage.getItem('user_type')
        sendGAEvent({
            event: 'search_registered_users',
            info: {
                email: 'TODOS',
                entry_date: 'TODOS',
                date_last_accessed: 'TODOS',
            },
            user_type: user_type,
            user_id: sessionStorage.getItem('id'),
        });
    }

    const handleSearch = () => {
        setIsLoading(true)
        dispatch(thunkGetLoginUsers(credentialDoc, credentialEmail, fechaAlta, fechaLastLogin, (response) => {
            if (response && response.usersLogin) {
                console.log('items',response.usersLogin.items)
                setSearchedUsers(response.usersLogin.items)
                setCurrentPage(0)
                setIsLoading(false)
            }
            else {
                setSearchedUsers([])
                setIsLoading(false)
            }
        }))

        // LCS: Enviar evento de negocio a GA - Wave 3
        sendGAEvent({
            event: 'search_registered_users',
            info: {
                user_id: sessionStorage.getItem('id'),
                user_type: sessionStorage.getItem('user_type'),
                email: 'TODOS',
                entry_date: 'TODOS',
                date_last_accessed: 'TODOS',
            }
        });
    }

    const handleExport = () => {
        let listData = [] as any
        if (searcheUsers.length > 0) {
            searcheUsers.map((item, index) => (
                listData.push({
                    code: item.document,
                    name: item.name + ' ' + item.surname,
                    email: item.email,
                    fechaRegistro: item.registrationDate,
                    fechaLogin: item.lastLoginDate
                })
            ))
        }
        //funcion para descar un excel con la información de los suplipoints en un excel
        const wb = XLSX.utils.book_new()
        let ws
        //posa un JSON object a una pagina
        ws = XLSX.utils.json_to_sheet(listData, {
            header: [
                'code',
                'name',
                'email',
                'fechaRegistro',
                'fechaLogin',
            ]
        })
        ws['A1'].v = t('gestionUsuarios.management.activeUsers.list.code')
        ws['B1'].v = t('gestionUsuarios.management.activeUsers.list.name')
        ws['C1'].v = t('gestionUsuarios.management.activeUsers.list.email')
        ws['D1'].v = t('gestionUsuarios.management.activeUsers.list.fechaAlta')
        ws['E1'].v = t('gestionUsuarios.management.activeUsers.list.fechaLogin')

        let fileName = 'Usuarios.xlsx'
        XLSX.utils.book_append_sheet(wb, ws, 'Usuarios registrados')
        //crea el llibre 
        XLSX.writeFile(wb, fileName)

        // LCS: Enviar evento de negocio a GA - Wave 3
        sendGAEvent({
            event: 'export_search_registered_users',
            user_id: sessionStorage.getItem('id'),
            user_type: sessionStorage.getItem('user_type'),
            //user_document: sessionStorage.getItem('userDocumentLogin')
        });

        // XLSX.writeFile will attempt to force a client-side download, works for web,
        // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
        if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
         
    }

    const validateCredentials = (value: string, credentialType: string): void => {    
        if (value) {
            switch (credentialType) {
                default:
                    setErrorDoc(true)
                    break
                case 'NIF':
                    setErrorDoc(!validateNIF(value))
                    break
                case 'CIF':
                    setErrorDoc(!validateCIF(value))
                    break
                case 'NIE':
                    setErrorDoc(!validateNIE(value))
            }
        }
        else setErrorDoc(false)
    }
    const validateEmail = (email) => {
        if (email) {
            setErrorEmail(!validateMail(email))
        }
        else setErrorEmail(false)
    }

    return (
        <>
            {
                isLoading &&
                <Spinner fixed={true} />
            }

            <Grid container justify='center' md={12} className={classes.inputsAreaWrapper}>
                <Grid container justify='center' className={classes.inputsArea}>
                    <Grid container direction='row' >
                        <FilterInputs
                            credentialDoc={credentialDoc}
                            setCredentialDoc={setCredentialDoc}
                            credentialEmail={credentialEmail}
                            setCredentialEmail={setCredentialEmail}
                            fechaAlta={fechaAlta}
                            setFechaAlta={setFechaAlta}
                            fechaLastLogin={fechaLastLogin}
                            setFechaLastLogin={setFechaLastLogin}
                            enableSearch={enableSearch}
                            setEnableSearch={setEnableSearch}
                            handleExport={handleExport}
                            errorDoc={errorDoc}
                            setErrorDoc={setErrorDoc}
                            errorEmail={errorEmail}
                            setErrorEmail={setErrorEmail}
                            handleChangeInput={handleChangeInput}
                            handleSearch={handleSearch}
                            handleSearchAll={handleSearchAll}
                            setCurrentPage={setCurrentPage}
                        />
                    </Grid>
                </Grid>
                <Grid container direction='row' md={12} className={classes.listContainer}>
                        <List
                            searcheUsers={searcheUsers}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setItemsPerPage={setItemsPerPage}
                            itemsPerPage={itemsPerPage}
                            totalPagesFilter={totalPagesFilter}
                            setTotalPagesFilter={setTotalPagesFilter}
                        />
                    </Grid>
            </Grid>
        </>
    )

}
export default ActiveUsers;