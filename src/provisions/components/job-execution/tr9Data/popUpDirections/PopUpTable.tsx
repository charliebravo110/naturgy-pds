import React, { useEffect, useState } from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import useStyles, { StyledTableCell } from '../popUpDirections/PopUpDirections.styles'
import { Grid, Typography } from '@material-ui/core'
import Pagination from '../../../../../common/components/pagination/Pagination'
import DynamicSearcher from '../../../../../common/components/searcher/DynamicSearcher'
import { useTranslation } from 'react-i18next'

const PopUpTable = (props: any) => {
    const {
        addressList,
        address,
        setAcceptButton,
        setCheckData,
        setIdStreetSelect
    } = props

    const classes = useStyles()
    const { t } = useTranslation()

    const [selectedAddress, setSelectedAddress] = useState(0)
    const [itemsToShow, setItemsToShow] = useState([])

    const rowsPerPage = 5
    const totalPages = itemsToShow.length === 0 ? 1 : Math.ceil(itemsToShow.length / rowsPerPage)
    const [currentPage, setCurrentPage] = useState(1)

    const handleChangePage = (number) => {
        setCurrentPage(number)
    }

    const handleClickCheckbox = (idStreet, streetName, zipCode, streetType) => {
        setCheckData({address: streetName, streetName: streetName, zipCode: zipCode, streetType: streetType})
        setIdStreetSelect(idStreet)
        setSelectedAddress(idStreet)
        setAcceptButton(true)
    }

    const tableHeader = () => {
        return (
            <Grid className={classes.tableHeaderContainer}>
                <Typography className={classes.headerResults}>{!itemsToShow ? addressList.length : itemsToShow.length} {t('provisions.jobExecution.isTr9.popUpDirections.table.results')}</Typography>
                <DynamicSearcher
                    label={t('provisions.jobExecution.isTr9.popUpDirections.table.searchResults')}
                    subtype={'Directions'}
                    finalList={itemsToShow}
                    setFinalList={setItemsToShow}
                    listItems={addressList}
                    style={{width: '20%'}}
                />
            </Grid>
        )
    }

    const pagination = () => {
        if (addressList) {
            return (
                <Grid container className={classes.pagintaionContainer}>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        handleChangePage={handleChangePage}
                    />
                </Grid>
            )
        }
    }

    useEffect(() => {
        setItemsToShow(addressList)
    }, [addressList]);

    if (addressList) {
        return (
            <>
                {tableHeader()}
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>
                                <Typography>{t('provisions.jobExecution.isTr9.popUpDirections.table.name')}</Typography>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Typography>{t('provisions.jobExecution.isTr9.popUpDirections.table.type')}</Typography>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Typography>{t('provisions.jobExecution.isTr9.popUpDirections.table.cp')}</Typography>
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {addressList.length === 0 ? (
                            <TableRow>
                                <StyledTableCell />
                            </TableRow>
                        ) : (
                            itemsToShow
                                .slice((currentPage - 1) * rowsPerPage, (currentPage - 1) * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
                                    <TableRow>
                                        <StyledTableCell style={item && item.proceso && { border: 0 }}>
                                            <div
                                                className={`radioButton ${classes.radioButton} ${item.idStreet === selectedAddress && 'active'} `}
                                                onClick={() => {
                                                    selectedAddress !== item.idStreet && handleClickCheckbox(item.idStreet, item.streetName, item.zipCode, item.streetType)
                                                }}
                                            />
                                            {item.streetName.toUpperCase().split(address.toUpperCase()).map((part, index) => (
                                                <span key={index} className={classes.titleCell}>
                                                    {part.toUpperCase()}
                                                    {index === 0 && <strong>{address.toUpperCase()}</strong>}
                                                </span>
                                            ))}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <span className={classes.textCell}>{item.streetType.toUpperCase()}</span>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <span className={classes.textCell}>{item.zipCode}</span>
                                        </StyledTableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
                {pagination()}
            </>
        )
    } else {
        return (<></>)
    }
}

export default PopUpTable