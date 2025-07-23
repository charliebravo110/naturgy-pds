import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import useStyles from './MosaicItem.styles'

const MosaicItem = (props: any) => {
  const classes = useStyles({})

  const {
    read,
    subject,
    date
  } = props

  const [ innerRead, setInnerRead ] = useState(read === 1)
  const [ openView, setOpenView ] = useState(false)

  const formatDateAndTime = (date) => {
    if (date) {
      const year = date.substring(0, 4)
      const month = date.substring(4, 6)
      const day = date.substring(6, 8)
      const hour = date.substring(8, 10)
      const min = date.substring(10, 12)
      const sec = date.substring(12, 14)
      return (day + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec)
    }
  }

  /*const handleOpenView = () => {
    if (!adminCheck() && !innerRead && !openView) {
      setLoading(true)

      const auxList = [{
        type: 'DOSSIER',
        code: provisions.currentProvision.dossierCod,
        date,
        indRead: 1
      }] as any

      dispatch(thunkGetCommunicationNotifications(auxList, (response) => {
        if (response) {
          setInnerRead(true)

          setOpenView(!openView)

          // actualizar el elemento en communicationsList
          const communicationItem = provisions.currentProvision.communicationList.find(i => i.sendDate === date)

          const communicationItemIndex = provisions.currentProvision.communicationList.indexOf(communicationItem)

          dispatch(setCommunicationData({ indRead: 1 }, communicationItemIndex))

          // modificar el número del Budget
          dispatch(setCurrentProvisionCommunicationListBudget(provisions.currentProvision.communicationListBudget - 1))

          setLoading(false)
        }
      }))
    } else {
      setOpenView(!openView)
    }
  }*/

  /*const handleDownloadDocument = () => {
    setLoading(true)

    dispatch(thunkGetDocument(attachment, (response) => {
      if (response && response.documento) {
        const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`

        const downloadLink = window.document.createElement('a')

        downloadLink.href = linkSource
        downloadLink.download = response.documento.nombre
        downloadLink.click()
      }

      setLoading(false)
    }))
  }*/

  return (
    <>
      <Grid container className={`${classes.container} ${!openView ? 'border' : ''}`}>
        <Grid container direction='column'>

          <Grid item>
            <Typography className={`${classes.responseDate} ${innerRead ? 'read' : ''}`}>
              {formatDateAndTime(date)}
            </Typography>
          </Grid>

          <Grid item>
            <Typography className={`${classes.responseSubject} ${innerRead ? 'read' : ''}`}>
              {subject}
            </Typography>
          </Grid>
          
        </Grid>
      </Grid>
    </>
  )
}

export default MosaicItem
