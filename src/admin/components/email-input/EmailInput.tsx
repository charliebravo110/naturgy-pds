import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import Input from '../../../common/components/input/Input'

import useStyles from './EmailInput.styles'

const EmailInput = (props: any) => {
    const { email, setEmail, error, selectedInput, selectInput } = props

    const classes = useStyles({})

    const [ inactive, setInactive ] = useState(false)

    useEffect(() => {
        if (selectedInput === 1 || selectedInput === 3 || selectedInput === 4 || selectedInput === 5) {
            setInactive(true)
        } else {
            setInactive(false)
        }
    }, [selectedInput])

    return (
        <Grid container item xs={11} sm={10} md={8} spacing={1} className={`${classes.inputsWrapper} ${(inactive) && classes.inactive}`}>
            <p className={classes.inputTitle}>Email</p>
            <Input
                className={classes.input}
                showValidationIcon
                error={email !== '' && error}
                value={email}
                onChange={({ target }) => {
                    setEmail(target.value)
                    selectInput(2)
                }}
            />
        </Grid>
    )
  }

  export default EmailInput