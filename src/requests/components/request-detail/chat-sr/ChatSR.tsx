import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@material-ui/core'

import Button from '../../../../common/components/button/Button'
import campanaIcono from '../../../../assets/icons/camapana.svg'
import ApplicantDataIcon from '../../../../assets/icons/datos_solicitante.svg'
import UfdIcon from '../../../../assets/icons/simbolo_ufd.svg'
import Tooltip from '../../../../common/components/tooltip/Tooltip'

import useStyles from './ChatSR.styles'
import { /* formatDate, */ completeDate, formatMonth, completeDateWithSlash } from '../../../../common/lib/FormatLib';
import { adminCheck } from '../../../../common/lib/ValidationLib';
import { useDispatch } from 'react-redux'
import { thunkUpdateRequest } from '../../../store/actions/RequestsThunkActions'

const ChatSR = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    setIsLoading,
    requestDetail,
    setShowPopupReiteracion,
    events,
    user,
    setAddCommentDone
  } = props

  const dispatch = useDispatch()

  const [allowReiteracion, setAllowReiteracion] = useState(false)
  const [showToolTipReiteracion, setShowToolTipReiteracion] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [allowComments, setAllowComments] = useState(false)
  const [showToolTipComments1, setShowToolTipComments1] = useState(false)
  const [showToolTipComments2, setShowToolTipComments2] = useState(false)

  const closeResponse = t('requests.newRequestDetail.chatSr.ufdResponses.closeResponse')
  const genericResponse = t('requests.newRequestDetail.chatSr.ufdResponses.genericResponse')

  const getUfdResponse = (type: string, value: string) => {
    return (type === 'CAMBIO DE ESTADO' && value === 'CERRADA') ? closeResponse : genericResponse
  }

  /*
  const checkForCommentToday = (array) => {
    const today = formatDate(new Date())
    let found = false
    array.forEach(obj => {
      if (obj.type === 'COMENTARIO' && obj.formattedDate === today) {
        found = true
      }
    })
    return found
  }
  */

  const checkForCommentToday = (array) => {
    const now = new Date()
    const today = now.getTime() - (24 * 60 * 60 * 1000)
    let found = false
    array.forEach(obj => {
      if (obj.eventTypeName === 'APORTAR INFORMACION') {
        const auxFormattedDate = obj.creationDateEvent ? obj.creationDateEvent.substring(0, 10) : ''
        const formattedDate = auxFormattedDate ? auxFormattedDate.split('-')[0] + auxFormattedDate.split('-')[1] + auxFormattedDate.split('-')[2] : auxFormattedDate
        const formattedHour = obj.creationDateEvent ? obj.creationDateEvent.substring(11, 19).replaceAll(':', '') : ''
        const formattedDateAndHour = (formattedDate && formattedHour) ? formattedDate + formattedHour : ''
        const date = new Date(completeDate(formattedDateAndHour))
        if (date.getTime() >= today)
          found = true
      }
    })
    return found
  }

  const checkFiveOrMoreComments = (array) => {
    const comments = array.filter(obj => obj.eventTypeName === 'APORTAR INFORMACION')
    return comments.length >= 5
  }

  const formatDateStr = (item) => `${parseInt(item.formattedDate.split('/')[0]).toString()} ${t('common.conjunctions.de')} ${ formatMonth(item.formattedDate.split('/')[1])} ${item.formattedDate.split('/')[2]} - ${item.formattedHour}h`;
  const formatClosingDateStr = (date) => `${parseInt(date.split('/')[0]).toString()} ${t('common.conjunctions.de')} ${ formatMonth(date.split('/')[1])} ${date.split('/')[2]}`


  const checkReiteracion = (array) => {
    const now = new Date()
    const lastWeek = now.getTime() - (7 * 24 * 60 * 60 * 1000)
    let hasReiteration = false

    // array.forEach((obj) => {
    //   if (obj.eventTypeName === 'REITERACIÓN') { 
    //     const date = new Date(completeDateWithSlash(obj.creationDate))
    //     if (date.getTime() >= lastWeek) { 
    //       hasReiteration = true
    //     }
    //   }
    // })
    array.map((item) => {
      if (item.eventTypeName === 'REITERACIÓN') {
        const auxFormattedDate = item.creationDateEvent ? item.creationDateEvent.substring(0, 10) : ''
        const formattedDate = auxFormattedDate ? auxFormattedDate.split('-')[0] + auxFormattedDate.split('-')[1] + auxFormattedDate.split('-')[2] : auxFormattedDate
        const formattedHour = item.creationDateEvent ? item.creationDateEvent.substring(11, 19).replaceAll(':', '') : ''
        const formattedDateAndHour = (formattedDate && formattedHour) ? formattedDate + formattedHour : ''
        if (formattedDateAndHour && formattedDateAndHour !== '') {
          const date = new Date(completeDate(formattedDateAndHour))
          if (date.getTime() >= lastWeek) { 
            hasReiteration = true
          }
        }
      }
    })
    return hasReiteration
  }

  const handleSendComment = () => {
    if (inputValue && inputValue !=='') {
      setIsLoading(true)
      const auxSurname1 = user.surName.includes(' ') ? user.surName.split(' ')[0] : user.surName
      const auxSurname2 = user.surName.includes(' ') ? user.surName.split(' ')[1] : ''
      const data = {
        customer: {
          documentType: user.documentType,
          docNumber: user.documentNumber,
          name: user.name,
          surname: auxSurname1,
          surname2: auxSurname2,
          mail: user.email,
          phonemob: user.phone,
          phone: user.phone
        },
        codSR: requestDetail.codSR,        
        docNumber: user.documentNumber,
        // descriptionEvent: 'APORTAR INFORMACION',
        comment: inputValue
      }      
      dispatch(thunkUpdateRequest(data, (response) => {
        if (response && response.resultado === '0' && response.codigoSR) {
          setAddCommentDone(true)
          setInputValue('')
        }
        setIsLoading(false)
      }))
    }
  }

  // Mostramos el nombre del documento parseando la información que nos devuelve ZEUS
  const docNameFormat = (docName) => {
    if (docName.includes(':')) {
      const auxDocName = docName.split(':')
      const auxResponse = auxDocName[1]
      return (auxResponse.includes('_') && docName.split('_')[5]) ? docName.split('_')[5] : docName
    }
    else {
      return docName
    }
  }

  useEffect(() => {
    if (requestDetail.status === 'EN CURSO' && !adminCheck()) {
      const hasReiteracion = checkReiteracion(events)
      const hasDayComment = checkForCommentToday(events)
      const hasFiveComments = checkFiveOrMoreComments(events)
      setAllowReiteracion(!hasReiteracion)
      setShowToolTipReiteracion(hasReiteracion)
      setAllowComments(!(hasFiveComments || hasDayComment))
      setShowToolTipComments1(hasDayComment)
      setShowToolTipComments2(hasFiveComments)
    } else {
      setAllowReiteracion(false)
      setShowToolTipReiteracion(false)
      setAllowComments(false)
      setShowToolTipComments1(false)
      setShowToolTipComments2(false)
    }
  }, [requestDetail,events])

  return (
    <Grid container className={classes.generalCont}>
      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item className={classes.titleTxt}>
          {t('requests.newRequestDetail.chatSr.additionalComments')}
        </Grid>
        <Grid item onClick={() => {allowReiteracion && setShowPopupReiteracion(true)}}>
           {showToolTipReiteracion ?
            <Tooltip title={t('requests.newRequestDetail.chatSr.tooltips.noReiteracion')} placement='bottom' arrow={true}>
              <div className={`${classes.requestStatusButton} ${!allowReiteracion && 'disabled'}`}>
                {t('requests.newRequestDetail.chatSr.buttons.requestStatus')}
                <img className={classes.bellIcon} src={campanaIcono} alt='' />
              </div>
            </Tooltip>
          : 
            <div className={`${classes.requestStatusButton} ${!allowReiteracion && 'disabled'}`}>
              {t('requests.newRequestDetail.chatSr.buttons.requestStatus')}
              <img className={classes.bellIcon} src={campanaIcono} alt='' />
            </div>
         } 
        </Grid>
      </Grid>

      <Grid container className={classes.commentBar}>
        <Grid item xs={12} md={9}>
          <input 
            className={classes.input}
            placeholder={t('requests.newRequestDetail.chatSr.writeComments')}
            value={inputValue}
            onChange={({ target }) => {
              const value = target.value
              setInputValue(value)
            }}
            disabled={!allowComments}
          />
        </Grid>
        <Grid item>
          {showToolTipComments2 ?
            <Tooltip title={t('requests.newRequestDetail.chatSr.tooltips.noComments2')} placement='bottom' arrow={true}>
              <Grid item>
                <Button
                  text={t('requests.newRequestDetail.chatSr.buttons.sendComment')}
                  color={'primary'}
                  size={'large'}
                  variant={'contained'}
                  onClick={handleSendComment}
                  disabled={!allowComments}
                />
              </Grid>
            </Tooltip>
          : showToolTipComments1 ?
            <Tooltip title={t('requests.newRequestDetail.chatSr.tooltips.noComments1')} placement='bottom' arrow={true}>
              <Grid item>
                <Button
                  text={t('requests.newRequestDetail.chatSr.buttons.sendComment')}
                  color={'primary'}
                  size={'large'}
                  variant={'contained'}
                  onClick={handleSendComment}
                  disabled={!allowComments}
                />
              </Grid>
            </Tooltip>
          :
            <Button
              text={t('requests.newRequestDetail.chatSr.buttons.sendComment')}
              color={'primary'}
              size={'large'}
              variant={'contained'}
              onClick={handleSendComment}
              disabled={!allowComments}
            />
          } 
        </Grid>
      </Grid>

      {((events && events.length > 0) || (requestDetail && requestDetail.closingDate)) &&
        <Grid container className={classes.chatCont}>
          {(events && events.length > 0) && events.map((item, i) => 
            <Grid container key={i}>
              <Grid container justifyContent='center' className={classes.dateBubbleCont}>
                <Grid item className={`${classes.dateBubble} v1`}>{formatDateStr(item)}</Grid>
                <Grid item className={`${classes.chatArrow} v1`} />
              </Grid>
              
              <Grid container className={`${classes.chatBubbleCont} v1`}>
                {item.eventTypeName === 'REITERACIÓN' &&
                  <Grid item>
                    <div>
                      <img src={campanaIcono} alt='' />
                    </div>
                  </Grid>
                }
                <Grid item xs={9} md={8} className={`${classes.chatBubble} v1`}>
                  {item.eventTypeName === 'REITERACIÓN' ?
                    <div className={classes.infoText}>
                      {t('requests.newRequestDetail.chatSr.chat.reiteration')}
                    </div>
                  :
                    item.eventTypeName === 'REAPERTURA' &&
                      <div className={classes.infoText}>
                        {t('requests.newRequestDetail.chatSr.chat.reopen')}
                      </div>
                  }
                  <div>                    
                    {item.eventTypeName === 'APORTAR NUEVO DOCUMENTO' ?
                      <>
                        {t('requests.newRequestDetail.chatSr.chat.document')}
                        {' '}
                        <span className={classes.docName}>{docNameFormat(item.descriptionEvent)}</span>
                      </>
                    :
                      // Comentario del evento (descriptionEvent)
                      // No mostrar cuando: se trate de un comentario asociado a un REITERACIÓN o a una REAPERTURA NO realizada por el usuario
                      !(!adminCheck() && (item.eventTypeName === 'REITERACIÓN' || item.eventTypeName === 'REAPERTURA') && item.codCreatedBy !== 'SEGAT') &&
                        item.descriptionEvent
                    }
                  </div>
                </Grid>
                <Grid item className={item.codCreatedBy === 'SEGAT' ? classes.chatIconItem : `${classes.chatIconItem} invisible`}>
                  <div className={`${classes.chatIconCont} v1`}>
                    <img className={classes.userIcon} src={ApplicantDataIcon} alt='' />
                  </div>
                </Grid>
              </Grid>

              {/* Mensaje de cortesía para eventos que sean del usuario */}
              {item.codCreatedBy === 'SEGAT' &&
                <Grid container className={`${classes.chatBubbleCont} v2`}>
                  <Grid item className={`${classes.chatIconItem} ufd`}>
                    <div className={classes.chatIconCont}>
                      <img className={classes.ufdIcon} src={UfdIcon} alt='' />
                    </div>
                  </Grid>
                  <Grid item xs={9} md={8} className={`${classes.chatBubble} v2`}>
                    <div>
                      <span className={classes.ufdMessage}>{getUfdResponse(item.eventTypeName, item.newValueEvent)}</span>
                    </div>
                  </Grid>
                </Grid>
              }
            </Grid>
          )}

          {(requestDetail && requestDetail.closingDate && requestDetail.status === 'CERRADA') && 
            <>
              <Grid container justifyContent='center' className={classes.dateBubbleCont}>
                <Grid item className={`${classes.dateBubble} v2`}>{formatClosingDateStr(requestDetail.closingDate)}</Grid>
                <Grid item className={`${classes.chatArrow} v2`} />
              </Grid>
              <Grid container className={`${classes.chatBubbleCont} v2`}>
                <Grid item className={`${classes.chatIconItem} ufd`}>
                  <div className={classes.chatIconCont}>
                    <img className={classes.ufdIcon} src={UfdIcon} alt='' />
                  </div>
                </Grid>
                <Grid item xs={9} md={8} className={`${classes.chatBubble} v2`}>
                  <div>
                    <span className={classes.ufdMessage}>{t('requests.newRequestDetail.chatSr.ufdResponses.closeResponse')}</span>
                  </div>
                </Grid>
              </Grid>
            </>
          }
        </Grid>   
      }
    </Grid>
  )
}

export default ChatSR