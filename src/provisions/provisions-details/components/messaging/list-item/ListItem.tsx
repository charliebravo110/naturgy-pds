import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TableRow from '@material-ui/core/TableRow'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'

import UfdImg from '../../../../../assets/icons/simbolo_ufd.svg'
import AttachFileIcon from '../../../../../assets/icons/ico_clip_documento_adjunto.svg'
import DocumentIcon from '../../../../../assets/icons/ico_documento.svg'

import { adminCheck } from '../../../../../common/lib/ValidationLib'

import { setCommunicationData, setCurrentProvisionCommunicationListBudget } from '../../../../store/actions/ProvisionsActions'
import { thunkGetCommunicationNotifications, thunkGetDocument } from '../../../../store/actions/ProvisionsThunkActions'

import useStyles, { StyledTableCell } from './ListItem.styles'
import { isMobileApp, isWeb } from '../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../mobile-apps/local-downloads/createFileAndOpenIt'

const ListItem = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const provisions = useSelector((state: any) => state.provisions)

  const {
    read,
    subject,
    date,
    attachment,
    setLoading
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

  const handleOpenView = () => {
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
  }

  const handleDownloadDocument = () => {
    setLoading(true)

    dispatch(thunkGetDocument(attachment, (response) => {
      if (response && response.documento) {
        const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`

        if (isWeb()) {
          const downloadLink = window.document.createElement('a')
          downloadLink.href = linkSource
          downloadLink.download = response.documento.nombre
          downloadLink.click()
        } else {
          // downloadLink.click() will attempt to force a client-side download, works for web,
          // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
          createFileAndOpenIt({ fileName: response.documento.nombre, contentAsBase64: linkSource })
        }
      }

      setLoading(false)
    }))
  }

  return (
    <>
      <TableRow className={`${classes.row} ${!openView ? 'border' : ''}`}>
        <StyledTableCell>
          <div className={`${classes.responseStatus} ${innerRead ? 'read' : ''}`} />
        </StyledTableCell>

        <StyledTableCell>
          <div className={classes.largeCell}>
            <Typography className={`${classes.responseSubject} ${innerRead ? 'read' : ''}`}>
              {subject}
            </Typography>
          </div>
        </StyledTableCell>

        <StyledTableCell>
          <div className={classes.mediumCell}>
            <Typography className={`${classes.responseDate} ${innerRead ? 'read' : ''}`}>
              {formatDateAndTime(date)}
            </Typography>
          </div>
        </StyledTableCell>

        <StyledTableCell>
          <div className={classes.cell}>
            {
              (attachment && attachment !== '') &&
                <Grid className={classes.responseLink}>
                  <img src={AttachFileIcon} alt='' />
                </Grid>
            }
          </div>
        </StyledTableCell>

        <StyledTableCell>
          <div>
            <Grid
              container
              alignItems='center'
              className={classes.responseLink}
              onClick={handleOpenView}
            >
              {
                openView ?
                  <>
                    <span>{t('provisions.provisionsDetails.messaging.view.close')}</span>
                    <ExpandLessIcon className={classes.expandIcon} />
                  </>
                :
                  <>
                    <span>{t('provisions.provisionsDetails.messaging.view.open')}</span>
                    <ExpandMoreIcon className={classes.expandIcon} />
                  </>
              }
            </Grid>
          </div>
        </StyledTableCell>
      </TableRow>

      {
        openView &&
          <TableRow className={classes.viewRow}>
            <StyledTableCell colSpan={5} className={classes.viewCell}>
              <Grid container className={classes.viewContainer}>
                <Grid container>
                  <Grid item md={1} sm={1} xs={1}>
                    <img src={UfdImg} alt='' />
                  </Grid>

                  <Grid item md={11} sm={11} xs={11} className={classes.message}>
                    {subject}
                  </Grid>
                </Grid>

                {
                  (attachment && attachment !== '') &&
                    <Grid container className={classes.documents}>
                      <Grid item md={1} sm={1} xs={1} />

                      <Grid item md={11} sm={11} xs={11}>
                        <Grid container direction='column'>
                          <Grid container alignItems='center' className={classes.documentContainer}>
                            <Grid item>
                              <img className={classes.documentIcon} src={DocumentIcon} alt='' />
                            </Grid>

                            <Grid item>
                              <div
                                className={`${classes.documentName} ${classes.downloadDocument}`}
                                onClick={handleDownloadDocument}
                              >
                                {t('provisions.documentation.downloadDocument')}
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                }
              </Grid>
            </StyledTableCell>
          </TableRow>
      }
    </>
  )
}

export default ListItem
