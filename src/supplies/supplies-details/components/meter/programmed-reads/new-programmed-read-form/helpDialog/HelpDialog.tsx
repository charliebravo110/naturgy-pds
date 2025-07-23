
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Dialog from '../../../../../../../common/components/dialog/Dialog'
import { DialogContent, DialogContentText, DialogActions, Grid, RadioGroup, FormControlLabel, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'

import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'
import ClockIcon from '../../../../../../../assets/icons/seleccionar_hora_naranja.svg'

import WhiteArrowDownIcon from '../../../../../../../assets/icons/flecha_down_blanco.svg'
import WhiteArrowUpIcon from '../../../../../../../assets/icons/flecha_up_blanco.svg'

import Typography from '@material-ui/core/Typography'

import useStyles, { StyledTableCell } from './HelpDialog.styles'
import MUiTable from '@material-ui/core/Table'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

import Checkbox from '../../../../../../../common/components/checkbox/Checkbox'
import Radio from '../../../../../../../common/components/radio/Radio'
import Button from '../../../../../../../common/components/button/Button'
import Datepicker from '../../../../../../../common/components/datepickerV4/Datepicker'


// este dialog muestra un mock de la pagina de programar lecturas
const HelpDialog = (props: any) => {

    const classes = useStyles({})

    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        showing,
        handleReturn,
        recurrenceTypes,
        programmedQuery,

    } = props

    const { t } = useTranslation()
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [programmedReads, setProgrammedReads] = useState<any>([])
    const [isBoxOpen, setIsBoxOpen] = useState(false)

    const handleOpenBox = () => {
    }

    return (
        <Dialog
            open={showing}
            onClose={handleReturn}
            className={classes.dialog}
        >
            <DialogContent className={classes.container}>
                <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleReturn} />

                <Grid container className={classes.container}>
                    <Grid item className={classes.title}>
                        {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.title')}
                    </Grid>

                    <Grid item className={classes.description}>
                        {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.description')}
                    </Grid>
                </Grid>
                <Grid container className={classes.form} spacing={2} justifyContent='space-between'>
                    <Grid item md={4} sm={12} xs={12}>
                        <Grid container>
                            <Grid item className={classes.inputLabel} md={12} sm={12} xs={12}>
                                {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.startDate')}
                            </Grid>

                            <Grid item md={12} sm={12} xs={12} >
                                <Datepicker
                                    selected={startDate}
                                    onChange={(date: Date) => setStartDate(date)}
                                />
                            </Grid>

                            <Grid container>
                                <Grid item className={classes.inputLabel2} md={12} sm={12} xs={12}>
                                    {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.endDate')}
                                </Grid>

                                <Grid item md={12} sm={12} xs={12}>
                                    <Datepicker
                                        selected={endDate}
                                        onChange={(date: Date) => setEndDate(date)}
                                    />
                                </Grid>

                                <Grid item className={classes.textContainer}>
                                    {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.helpDialog.description1')}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item md={4} sm={12} xs={12}>
                        <Grid container>
                            <Grid item className={classes.inputLabel} md={12} sm={12} xs={12}>
                                {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.hour')}
                            </Grid>

                            <Grid item md={12} sm={12} xs={12}>
                                <Datepicker
                                    selected={startDate}
                                    onChange={(date: Date) => setStartDate(date)}
                                    timeIntervals={30}
                                    dateFormat='hh:mm aa'
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item md={4} sm={12} xs={12}>
                        <Grid container className={classes.recurrentContainer} alignItems='center'>
                            <Grid item className={classes.recurrentLabel}>
                                <Checkbox
                                    checked={true}
                                />
                            </Grid>

                            <Grid item>
                                {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.recurrence.label')}
                            </Grid>
                        </Grid>
                        <Grid container alignItems='center'>
                            <RadioGroup
                                className={classes.radioGroup}
                                aria-label='type'
                                name='type'
                            // value={programmedQuery.type}
                            >
                                {
                                    recurrenceTypes && recurrenceTypes.map(item => {
                                        return <FormControlLabel key={item.key} value={item.value.split('|')[0]} control={<Radio />} label={item.value.split('|')[1]} />
                                    })
                                }
                            </RadioGroup>
                            {/* radio buton */}
                        </Grid>

                        <Grid item className={classes.textContainer}>
                            {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.helpDialog.description2')}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container md={12} sm={12} xs={12} className={classes.buttonContainer} spacing={2}>
                    <Grid item md={6} sm={12} xs={12} className={classes.button}>
                        <Button
                            text={t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.button')}
                            color={'primary'}
                            variant={'contained'}
                            fullWidth
                        />
                        <Grid item className={classes.textContainer}>
                            {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.helpDialog.description3')}
                        </Grid>
                    </Grid>

                    <Grid item md={6} sm={12} xs={12} className={classes.button}>
                        <Button
                            text={t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.cancel')}
                            variant={'contained'}
                            fullWidth
                        />
                    </Grid>
                </Grid>

                <Grid container className={classes.toolbar}>
                    <Grid item className={classes.title2}>
                        {t('supplies.suppliesDetails.components.meter.programmedReads.title')}
                    </Grid>
                    {/* //aqui */}
                    <Grid item className={classes.downloadContainer}>
                        <Grid container className={classes.downloadButton} onClick={handleOpenBox}>
                            <Grid item>
                                {t('supplies.suppliesDetails.components.consumption.charts.downloads.export')}
                            </Grid>

                            <Grid item className={classes.arrowIcon}>
                                {
                                    isBoxOpen ?
                                        <img src={WhiteArrowUpIcon} alt='' />
                                        :
                                        <img src={WhiteArrowDownIcon} alt='' />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {
                !mobile ?
                    <Grid container className={classes.tableContainer}>
                        <MUiTable className={classes.messagesTable}>
                            <TableHead className={classes.header}>
                                <TableRow>
                                    <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                                        {t('supplies.suppliesDetails.components.meter.programmedReads.table.date')}
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                                        {t('supplies.suppliesDetails.components.meter.programmedReads.table.hour')}
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                                        {t('supplies.suppliesDetails.components.meter.programmedReads.table.tension')}
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                                        {t('supplies.suppliesDetails.components.meter.programmedReads.table.potenciaInstantanea')}
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                                        {t('supplies.suppliesDetails.components.meter.programmedReads.table.periodo')}
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                                        {t('supplies.suppliesDetails.components.meter.programmedReads.table.lecturaKWh')}
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                                        {t('supplies.suppliesDetails.components.meter.programmedReads.table.estadoConsulta')}
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                                        {t('supplies.suppliesDetails.components.meter.programmedReads.table.state')}
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <StyledTableCell>05 de Septiembre de 2022</StyledTableCell>
                                    <StyledTableCell>13:00</StyledTableCell>
                                    <StyledTableCell>234 </StyledTableCell>
                                    <StyledTableCell>4.5 </StyledTableCell>
                                    <StyledTableCell>
                                        <select className={classes.select}>
                                            <option selected>1.5</option>
                                            <option >2.0</option>
                                            <option >4.0</option>
                                        </select></StyledTableCell>
                                    <StyledTableCell>4.0</StyledTableCell>
                                    <StyledTableCell className={classes.blueColor}>Realizada</StyledTableCell>
                                    <StyledTableCell>Activo</StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell>02 de Septiembre de 2022</StyledTableCell>
                                    <StyledTableCell>11:27</StyledTableCell>
                                    <StyledTableCell>0</StyledTableCell>
                                    <StyledTableCell>0</StyledTableCell>
                                    <StyledTableCell>
                                        <select className={classes.select}>
                                            <option selected>0</option>
                                            <option >0</option>
                                            <option >0</option>
                                        </select></StyledTableCell>
                                    <StyledTableCell>0</StyledTableCell>
                                    <StyledTableCell className={classes.blueColor}>
                                        <img className={classes.icon} src={ClockIcon} alt='' />
                                        En curso.
                                    </StyledTableCell>
                                    <StyledTableCell/>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell>01 de Septiembre de 2022</StyledTableCell>
                                    <StyledTableCell>17:30</StyledTableCell>
                                    <StyledTableCell>235</StyledTableCell>
                                    <StyledTableCell>0</StyledTableCell>
                                    <StyledTableCell>
                                        <select className={classes.select}>
                                            <option selected>0</option>
                                            <option >0</option>
                                            <option >0</option>
                                        </select></StyledTableCell>
                                    <StyledTableCell>0</StyledTableCell>
                                    <StyledTableCell className={classes.blueColor}>Realizada</StyledTableCell>
                                    <StyledTableCell>Activo pero ha saltado el ICP</StyledTableCell>
                                </TableRow>
                            </TableBody>

                        </MUiTable>
                    </Grid>
                :
                    <Grid container className={classes.tableContainer}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Grid className={classes.item}>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.date')}</Typography>
                                    <Typography className={classes.value}>05 de Septiembre de 2022</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.hour')}</Typography>
                                    <Typography className={classes.value}>13:00</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.tension')}</Typography>
                                    <Typography className={classes.value}>234</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.potenciaInstantanea')}</Typography>
                                    <Typography className={classes.value}>4.5</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.periodo')}</Typography>
                                    <Typography className={classes.value}>
                                        <select className={classes.select}>
                                            <option selected>1.5</option>
                                            <option >2.0</option>
                                            <option >4.0</option>
                                        </select>
                                    </Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.lecturaKWh')}</Typography>
                                    <Typography className={classes.value}>4.0</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.estadoConsulta')}</Typography>
                                    <Typography className={classes.blueColor}>Realizada</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.state')}</Typography>
                                    <Typography className={classes.value}>Activo</Typography>
                                </Grid>
                            </Grid>
                            
                            <Grid className={classes.item}>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.date')}</Typography>
                                    <Typography className={classes.value}>02 de Septiembre de 2022</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.hour')}</Typography>
                                    <Typography className={classes.value}>11:27</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.tension')}</Typography>
                                    <Typography className={classes.value}>0</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.potenciaInstantanea')}</Typography>
                                    <Typography className={classes.value}>0</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.periodo')}</Typography>
                                    <Typography className={classes.value}>
                                        <select className={classes.select}>
                                            <option selected>0</option>
                                            <option >0</option>
                                            <option >0</option>
                                        </select>
                                    </Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.lecturaKWh')}</Typography>
                                    <Typography className={classes.value}>0</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.estadoConsulta')}</Typography>
                                    <Typography className={classes.blueColor}><img className={classes.icon} src={ClockIcon} alt='' />En curso.</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.state')}</Typography>
                                    <Typography className={classes.value}/>
                                </Grid>
                            </Grid>
                        
                            <Grid className={classes.item}>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.date')}</Typography>
                                    <Typography className={classes.value}>01 de Septiembre de 2022</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.hour')}</Typography>
                                    <Typography className={classes.value}>17:30</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.tension')}</Typography>
                                    <Typography className={classes.value}>235</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.potenciaInstantanea')}</Typography>
                                    <Typography className={classes.value}>0</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.periodo')}</Typography>
                                    <Typography className={classes.value}>
                                        <select className={classes.select}>
                                            <option selected>0</option>
                                            <option >0</option>
                                            <option >0</option>
                                        </select>
                                    </Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.lecturaKWh')}</Typography>
                                    <Typography className={classes.value}>0</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.estadoConsulta')}</Typography>
                                    <Typography className={classes.blueColor}>Realizada</Typography>
                                </Grid>
                                <Grid className={classes.row}>
                                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.state')}</Typography>
                                    <Typography className={classes.value}>Activo pero ha saltado el ICP</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }

                <Grid container md={12} sm={12} xs={12} className={classes.buttonContainer2} spacing={2}>
                    <Grid item>
                        <Button
                            className={classes.button2}
                            text={t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.helpClose')}
                            variant={'contained'}
                            size={'large'}
                            onClick={handleReturn}
                        />
                    </Grid>

                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default HelpDialog