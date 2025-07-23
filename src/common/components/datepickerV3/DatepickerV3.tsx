import React from 'react'

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import './DatepickerV3.styles.scss'

import CalendarIcon from '../../../assets/icons/input_calendario.svg'

import useStyles from './DatepickerV3.styles'

interface DatepickerProps {
    minDate?: Date;
    maxDate?: Date;
    selectedDate?: Date;
    dateFormat?: string;
    popperPlacement?: string;
    handleChange: Function;
    size: 's' | 'm' | 'l';
}

const CustomInput = (props) => {
    const classes = useStyles({});
    const size = props.size;
    return (
        <input
            className={size === 's' ? classes.s : classes.m}
            type='text'
            value={props.value}
            onClick={props.onClick}
            readOnly={true}
        />
    )
}

const DatepickerV3 = (props: DatepickerProps) => {
    const classes = useStyles({})

    const lang = sessionStorage.getItem('lang') || 'es'

    const {
        minDate,
        maxDate,
        selectedDate,
        dateFormat,
        handleChange,
        size,
        popperPlacement
    } = props

    if (lang === 'es' || lang === 'ga') {
        registerLocale('es', es)
        setDefaultLocale('es')
    }

    return (
        <div className={classes.container}>
            <DatePicker
                customInput={<CustomInput size={size} />}
                selected={selectedDate}
                dateFormat={dateFormat != null ? dateFormat : 'dd MMMM yyyy'}
                locale='es'
                minDate={minDate}
                maxDate={maxDate}
                popperPlacement={popperPlacement ? popperPlacement : 'bottom-start'}
                popperModifiers={{
                    flip: {
                        enabled: false
                    },
                    preventOverflow: {
                        enabled: true,
                        escapeWithReference: true
                    }
                }}
                onChange={date => {
                    handleChange(date)
                }}
                onKeyDown={e => e.preventDefault()}
                {...props}
            />

            <div className={size === 's' ? classes.iconS : classes.icon}>
                <img src={CalendarIcon} alt='' />
            </div>
        </div>
    )
}

export default DatepickerV3
