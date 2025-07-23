import Grid from '@material-ui/core/Grid';
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import useStyles from './Search.styles';
import FilterInputs from './FilterInputs';
import XLSX from 'xlsx'
import Spinner from '../../../common/components/spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import List from './List';
import { thunkGetMasterData, thunkGetPaydata } from '../../../provisions/store/actions/ProvisionsThunkActions';
import { Dialog, DialogContent, Typography, useMediaQuery } from '@material-ui/core';
import TextButton from '../../../common/components/text-button/TextButton';
import CloseIcon from '../../../assets/icons/cerrar.svg'
import Button from '../../../common/components/button/Button';
import Mosaic from './Mosaic';
import { formatDateAndHourStringWithBars } from '../../../common/lib/FormatLib'
import { isMobileApp } from '../../../mobile-apps/common/detectPlatform';
import createFileAndOpenIt from '../../../mobile-apps/local-downloads/createFileAndOpenIt';

export const Search = () => {
    
    const classes = useStyles({})
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const mobileRes = useMediaQuery('(max-width:576px)')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const searchedUser = useSelector((state: any) => state.admin.searchedUser)
    const adminToken = useSelector((state: any) => state.admin.token)
    const today = new Date()
    let sixDaysAgo = new Date(today.setDate(today.getDate() - 6));
    

    //filtros busqueda
    const [expedienteDoc, setExpedienteDoc] = useState('')
    const [credentialId, setCredentialId] = useState('')
    const [credentialCodOK, setCredentialCodOK] = useState('')
    const [fechaAlta, setFechaAlta] = useState<Date>(sixDaysAgo)
    const [fechaLast, setFechaLast] = useState<Date>(new Date())
    const [codOk, setCodOk] = useState('')
    const [enableSearch, setEnableSearch] = useState<boolean>(false)
    const [errorDoc, setErrorDoc] = useState<Boolean>(false)
    const [errorId, setErrorId] = useState<Boolean>(false)
    const [exportLimit, setExportLimit] = useState(1001)
    const [searchedCardpayments, setSearchedCardpayments] = useState([] as any)
    const [filteredData, setFilteredData] = useState(searchedCardpayments);
    const [enableExport, setEnableExport] = useState(false)
    const [startItems, setStartItems] = useState<number>(0)
    const [endItems, setEndItems] = useState<number>(0)
    const [totalItems, setTotalItems] = useState<number>(0)

    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(20)
    const [totalPagesFilter, setTotalPagesFilter] = useState(0)
    const [Open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeInput = (input, value): any => {
        if (input === 'expediente') {
            setExpedienteDoc(value)
        }
        else if (input === 'id') {            
            setCredentialId(value)            
        } else if (input === 'codok') {
            setCredentialCodOK(value)
        }
    }

    const setData = ((data) => {
        data.map((item) => {
            // Modificamos el formato de las fechas y la hora
            item.requestTimestamp = formatDateAndHourStringWithBars(new Date(item.requestTimestamp))
            // Modificamos el formato del importe
            item.amount = formatNumberES(item.amount)
        })
        setSearchedCardpayments(data)
    })

    const handleSearch = () => {
        setIsLoading(true)
        dispatch(thunkGetPaydata(expedienteDoc, credentialId, fechaAlta, fechaLast,credentialCodOK, (response) => {
            if (response && response.cardPayments) {
                setData(response.cardPayments.items)
                setCurrentPage(0)
                setIsLoading(false)
                if (response.cardPayments.items.length >= exportLimit) {
                    setOpen(true)
                }
            }
            setIsLoading(false)
        }))
    }

    const handleExport = () => {
        let listData = [] as any
        if (filteredData.length > 0) {
            filteredData.map((item, index) => (
                listData.push({
                    fecha: item.requestTimestamp,
                    expediente: item.dossierNumber,
                    orderId: item.orderId,
                    amount: item.amount,
                    docId: item.custNum,
                    status:item.status,
                    codKO:item.result
                })
            ))
        }
        //funcion para descar un excel con la información de los suplipoints en un excel
        const wb = XLSX.utils.book_new()
        let ws
        //posa un JSON object a una pagina
        ws = XLSX.utils.json_to_sheet(listData, {
            header: [
                'fecha',
                'expediente',
                'orderId',
                'amount',
                'docId',
                'status',
                'codKO',
            ]
        })
        ws['A1'].v =t('controlMensajeria.payData.Fecha') 
        ws['B1'].v =t('controlMensajeria.payData.Expediente')
        ws['C1'].v =t('controlMensajeria.payData.Id de orden') 
        ws['D1'].v =t('controlMensajeria.payData.Cantidad') 
        ws['E1'].v =t('controlMensajeria.payData.Identificación') 
        ws['F1'].v =t('controlMensajeria.payData.Estado') 
        ws['G1'].v =t('controlMensajeria.payData.CodigoKO') 

        let fileName = 'Pagos.xlsx'
        XLSX.utils.book_append_sheet(wb, ws, 'Pagos')
        //crea el llibre 
        XLSX.writeFile(wb, fileName)

       // XLSX.writeFile will attempt to force a client-side download, works for web,
       // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
       if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
        
    }

    const formatNumberES = (numero) => {
        // Dividimos el importe entre 100 para que nos lo muestre en euros, ya que viene informado en céntimos
        let sNumero=(parseInt(numero)/100).toString()

        if (sNumero.includes('.')) {
            const splitAmount = sNumero.split('.')

            // Ponemos los puntos de los miles en caso de ser necesario (ej: 1.000€)
            if (splitAmount[0].length > 3) {
                splitAmount[0] = splitAmount[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }
            // Añadimos un cero al final si después de la coma sólo hay un número (ej: 10,5€ = 10,50€)
            if (splitAmount[1].length < 2) {
                splitAmount[1] = splitAmount[1] + '0'
            }

            const finalValue = splitAmount[0] + ',' + splitAmount[1]
            return finalValue
        }
        else {
            return sNumero
        }
    }

    useEffect(() => {
        if (filteredData.length>0) {
            setEnableExport(true)
        } else {
            setEnableExport(false)
        }
    }, [filteredData])

    useEffect(() => {
        setTotalPagesFilter(filteredData.length === 0 ? 1 : Math.ceil(filteredData.length / itemsPerPage))
        setTotalItems(filteredData.length)
    
        handleSetItems()
      }, [filteredData.length, itemsPerPage])
    
      useEffect(() => {
        handleSetItems()
      }, [currentPage, itemsPerPage, filteredData.length])
    
      const handleSetItems = () => {
        let AendItems = (currentPage + 1) * itemsPerPage
        let AstartItems = AendItems - itemsPerPage + 1
    
        if (AendItems > filteredData.length) {
          AendItems = filteredData.length
        }
        
        setEndItems(AendItems)
        setStartItems(AstartItems)
      }
    
    useEffect(() => {      
        dispatch(thunkGetMasterData('CARDPAYMENTS', 'ES', 'MAX_CARDPAYMENTS_LIST', (response) => {
            if (response) {
                setExportLimit(response[0].value)
            }
        }))     
    }, [])

    return (
        <Grid container className={classes.generalCont}>
            {
                isLoading &&
                <Spinner fixed={true} />
            }
            {
                <Dialog className={classes.dialog} open={Open}>
                    <DialogContent>
                        <TextButton className={classes.closeButton} onClick={handleClose}>
                            <img src={CloseIcon} alt='' />
                        </TextButton>
                        <Grid container className={classes.container} direction='column' justify='center' alignItems='center' spacing={2}> 
                            <Grid container className={classes.text} spacing={1}>
                                <Grid item xs={12} sm={2} md={2} className={classes.alertBlock} />
                                <Grid item xs={12} sm={12} md={12}>
                                    <Typography className={classes.text}>{t('controlMensajeria.payData.formatExport')}</Typography>
                                </Grid>
                            </Grid>
                            <Button fullWidth className={classes.input} text={t('controlMensajeria.payData.Export')} color={'primary'} size={'large'}  variant={'contained'}  onClick={handleExport} />
                        </Grid>
                    </DialogContent>
                </Dialog>
            }
            <Grid container>
                <FilterInputs
                    expedienteDoc={expedienteDoc}
                    setExpedienteDoc={setExpedienteDoc}
                    credentialId={credentialId}
                    setCredentialId={setCredentialId}
                    credentialCodOK={credentialCodOK}
                    setCredentialCodOK={setCredentialCodOK}
                    fechaAlta={fechaAlta}
                    setFechaAlta={setFechaAlta}
                    fechaLast={fechaLast}
                    setFechaLast={setFechaLast}
                    enableSearch={enableSearch}
                    setEnableSearch={setEnableSearch}
                    handleExport={handleExport}
                    errorDoc={errorDoc}
                    setErrorDoc={setErrorDoc}
                    errorId={errorId}
                    setErrorId={setErrorId}
                    handleChangeInput={handleChangeInput}
                    handleSearch={handleSearch}
                    setCurrentPage={setCurrentPage}
                    enabledExport={enableExport}
                />
                {
                    (!mobileRes) ?
                        <List 
                            searcheUsers={searchedCardpayments} 
                            currentPage={currentPage} 
                            setCurrentPage={setCurrentPage} 
                            setItemsPerPage={setItemsPerPage} 
                            itemsPerPage={itemsPerPage} 
                            totalPagesFilter={totalPagesFilter} 
                            setTotalPagesFilter={setTotalPagesFilter} 
                            exportLimit={exportLimit}
                            filteredData={filteredData}
                            setFilteredData={setFilteredData}
                            startItems={startItems}
                            endItems={endItems}
                            totalItems={totalItems}
                        /> 
                    :
                        <Mosaic 
                            searcheUsers={searchedCardpayments}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setItemsPerPage={setItemsPerPage}
                            itemsPerPage={itemsPerPage}
                            totalPagesFilter={totalPagesFilter}
                            setTotalPagesFilter={setTotalPagesFilter}
                            exportLimit={exportLimit}
                            filteredData={filteredData}
                            setFilteredData={setFilteredData}
                            startItems={startItems}
                            endItems={endItems}
                            totalItems={totalItems}
                        />
                }
            </Grid>
        </Grid>
    )

}
