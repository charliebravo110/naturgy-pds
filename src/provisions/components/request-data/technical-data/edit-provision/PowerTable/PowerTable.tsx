import React, { useEffect } from 'react'
import { withRouter } from 'react-router'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import useStyles, { StyledTableCell } from './PowerTable.styles'
import Grid from '@material-ui/core/Grid'
import Input from '../../../../../../common/components/input/Input'
import InputTabla from '../../../../../../common/components/inputTabla/InputTabla'



const PowerTable = (props: any) => {
    const classes = useStyles({})
    const { t } = useTranslation()


    const provisions = useSelector((state: any) => state.provisions)

    const {
        state,
        mobile,
        suppliesList,
        notNecessary,
        techData,
        powerList,
        setPowerListI,
        setTechDataI,
        checkPowerRequested,
        techDataErrors,
        powerListErrors,
        setPowerListErrors,
        typesSelect,
        setTotalBuildableArea,
        setTotalPowerRequested,
        setShowDialog,
        setDialogText
    } = props


    return (
        <>
            {
                mobile ?
                    (
                        <Grid container spacing={1} direction='column' className={classes.inputContainer}>
                            <Grid item>
                                <Typography>
                                    {t('provisions.newProvision.requestData.supplyType.modification.table.tableHead.col1')}
                                </Typography>
                            </Grid>
                            <Grid item className={classes.input}>
                                {
                                    state === 0 && !notNecessary ?
                                        <InputTabla
                                        
                                            value={techData.totalPower}
                                            onChange={(e) => {
                                                setTechDataI({ ...techData, totalPower: e.target.value })
                                                setPowerListI(powerList.map(item => {
                                                    return {
                                                        ...item,
                                                        requestPower: e.target.value,
                                                        subtotalPower: e.target.value
                                                    }
                                                }))
                                            }}
                                            onBlur={(e) => { checkPowerRequested(e) }}
                                            helperText={techDataErrors.totalPower.bool && techDataErrors.totalPower.msg}
                                            error={techDataErrors.totalPower.bool}
                                        />
                                        :
                                        <Typography className={classes.text}>{techData.totalPower}</Typography>
                                }
                            </Grid>
                            <Grid container spacing={2} direction='column' className={classes.inputContainer2}>
                                <Grid item>
                                    <Typography className={classes.label}>
                                        {t('provisions.newProvision.requestData.supplyType.modification.table.tableHead.col2')}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography className={classes.text}>
                                        {suppliesList && suppliesList[0] && suppliesList[0].maxAvalaibleVoltage}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>


                        // <Grid>hello</Grid>
                    ) :
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    {t('provisions.newProvision.requestData.supplyType.modification.table.tableHead.col1')}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {t('provisions.newProvision.requestData.supplyType.modification.table.tableHead.col2')}
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <StyledTableCell>
                                    <div className={classes.inputTable}>
                                        {
                                            state === 0 && !notNecessary ?
                                                <InputTabla
                                                    
                                                    value={techData.totalPower}
                                                    onChange={(e) => {
                                                        setTechDataI({ ...techData, totalPower: e.target.value })
                                                        setPowerListI(powerList.map(item => {
                                                            return {
                                                                ...item,
                                                                requestPower: e.target.value,
                                                                subtotalPower: e.target.value
                                                            }
                                                        }))
                                                    }}
                                                    onBlur={(e) => { checkPowerRequested(e) }}
                                                    helperText={techDataErrors.totalPower.bool && techDataErrors.totalPower.msg}
                                                    error={techDataErrors.totalPower.bool}
                                                />
                                                :
                                                <Typography className={classes.text}>{techData.totalPower}</Typography>
                                        }
                                    </div>

                                </StyledTableCell>
                                <StyledTableCell>
                                    <Typography className={classes.text}>
                                        {suppliesList && suppliesList[0] && suppliesList[0].maxAvalaibleVoltage}
                                    </Typography>
                                </StyledTableCell>
                            </TableRow>

                        </TableBody>

                    </Table>
            }
        </>
    )
}

export default withRouter(PowerTable)
