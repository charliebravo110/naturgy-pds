import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../common/components/dialog/Dialog'

import useStyles from './ConnectTimeDialog.styles'
import Content from './content/Content'

const ConnectTimeDialog = (props: any) => {
//TODO afegir dialog que es mostri als 30 segons d'haver començat la petició
    const classes = useStyles({})

    const {
        connectingTimout,
        readingError,
        handleReturn,
        setIsLoadingMR,
        setQuestionPendingVal
    } = props

    return (
        <Dialog className={classes.dialog} open={connectingTimout}>
            <DialogContent className={classes.container}>
                <Content
                    handleReturn={handleReturn}
                    readingError={readingError}
                    setIsLoadingMeterReadings={setIsLoadingMR}
                    setQuestionPendingValue={setQuestionPendingVal}
                />
            </DialogContent>
        </Dialog>
    )

}

export default withRouter(ConnectTimeDialog)