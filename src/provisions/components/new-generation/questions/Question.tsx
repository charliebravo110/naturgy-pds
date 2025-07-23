import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import {
  DialogContent,
  Typography,
  Divider,
  Box,
  Link,
  Container,
  Paper,
  DialogTitle,
  useMediaQuery,
} from '@material-ui/core';


import CloseIcon from '../../../../assets/icons/cerrar.svg';

import Dialog from '../../../../common/components/dialog/Dialog';
import TextButton from '../../../../common/components/text-button/TextButton';

import Button from '../../../../common/components/button/Button';
import { useHistory } from 'react-router';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {
  setDossierSubtype,
  setDossierType,
} from '../../../store/actions/ProvisionsActions';
import { useDispatch } from 'react-redux';

import useStyles from '../questions/Question.styles';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { SecurityHOC } from '../../../../common/HOC/SecurityHOC';
import ArrowTooltip from '../../../../common/components/tooltip/arrow/ArrowTooltip';
import InfoIcon from '../../../../assets/icons/info.svg'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Question = (props: any) => {
  const classes = useStyles({});
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let history = useHistory();
  const mobileRes = useMediaQuery('(max-width:576px)')

  const [showFirstInfo, setShowFirstInfo] = useState(false);
  const [showSecondQuestion, setShowSecondQuestion] = useState(false);
  const [showThirdQuestion, setShowThirdQuestion] = useState(false);
  const [ShowRequestBtn, setShowRequestBtn] = useState(false);
  const [ShowDialog, setShowDialog] = useState(false);
  const [firstAnswer, setFirstAnswer] = useState('')
  const [secondAnswer, setSecondAnswer] = useState('')
  const [thirdAnswer, setThirdAnswer] = useState('')

  useEffect (() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'nueva conexion a la red',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  return (
    <Box className={classes.block}>
      <Container className={classes.borderColor}>
        <Typography variant='h3' className={classes.title}>
          {t('provisions.newGeneration.popupMessages.request')}
        </Typography>

        <Grid container direction='row' alignItems='center'>
          <Link
            className={classes.title}
            underline='none'
            onClick={() => {
              history.push('/provisions/what-to-do');
            }}
          >
            <TextButton className={classes.buttons}>
              <Grid item>
                <ArrowBackIos fontSize='medium' />
              </Grid>
              <Grid item>
                <Typography>
                  {t('provisions.newGeneration.popupMessages.back')}
                </Typography>
              </Grid>
            </TextButton>
          </Link>
        </Grid>

        <Paper variant='outlined' square>
          <Grid
            container
            className={classes.container}
            spacing={2}
            direction='row'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item container xs className={classes.titles}>
              <Typography className={classes.bold}  variant='h5'>
                {t('provisions.newGeneration.popupMessages.msg1')}
              </Typography>
              <ArrowTooltip title={t('faq.info')} placement='bottom'>
                <img src={InfoIcon} alt='' className={classes.delegatesInfoButton} />
              </ArrowTooltip>
            </Grid>
            
            <Grid item className={classes.popButtons}>
              <Button
                text={t('provisions.newGeneration.popupMessages.affirmative')}
                color={firstAnswer === 'Y' ? 'primary' : 'inherit'}
                size='medium'
                variant='contained'
                className={`${classes.button} yes`}
                onClick={() => {
                  setShowSecondQuestion(true);
                  setShowFirstInfo(false);
                  setFirstAnswer('Y')
                  setSecondAnswer('')
                  // LCS: Enviar evento de GdC a GA - Wave 3
                  sendGAEvent({
                    event: 'request_funnel',
                    section_name: 'mi conexion a la red',
                    title_screen: 'solicitud de autoconsumo',
                    click_text: 'si',
                    element_type: 'consulta de informacion',
                    page_url: removeEmails(window.location.href),
                    request_type: 'quiero una conexion de autoconsumo',
                    question: '¿tu autoconsumo tendra excedentes?',
                    browsing_type: sessionStorage.getItem('browsing_type')
                  })
                }}
              />
              <Button
                text={t('provisions.newGeneration.popupMessages.negative')}
                color={firstAnswer === 'N' ? 'primary' : 'inherit'}
                size='medium'
                variant='contained'
                className={classes.button}
                onClick={() => {
                  setShowFirstInfo(true);
                  setShowSecondQuestion(false);
                  setShowThirdQuestion(false);
                  setShowRequestBtn(false);
                  setFirstAnswer('N')
                  setSecondAnswer('')
                  // LCS: Enviar evento de GdC a GA - Wave 3
                  sendGAEvent({
                    event: 'request_funnel',
                    section_name: 'mi conexion a la red',
                    title_screen: 'solicitud de autoconsumo',
                    click_text: 'no',
                    element_type: 'consulta de informacion',
                    page_url: removeEmails(window.location.href),
                    request_type: 'quiero una conexion de autoconsumo',
                    question: '¿tu autoconsumo tendra excedentes?',
                    browsing_type: sessionStorage.getItem('browsing_type')
                  })
                }}
              />
            </Grid>

            {showSecondQuestion && (
              <>
                <Grid item xs={12}>
                  <Divider variant='middle' />
                </Grid>
              <div className={classes.responsive}>
                <Grid item xs className={classes.titles}>
                  <Typography className={classes.bold} variant='h5'>
                    {t('provisions.newGeneration.popupMessages.msg2')}
                  </Typography>
                </Grid>
                <Grid item className={classes.popButtons} style={{margin: 'auto'}}>
                  <Button
                    text={t(
                      'provisions.newGeneration.popupMessages.affirmative'
                    )}
                    color={secondAnswer === 'Y' ? 'primary' : 'inherit'}
                    size='medium'
                    variant='contained'
                    className={`${classes.button} yes`}
                    onClick={() => {
                      setShowThirdQuestion(true);
                      setShowRequestBtn(false);
                      setSecondAnswer('Y')
                      setThirdAnswer('')
                      // LCS: Enviar evento de GdC a GA - Wave 3
                      sendGAEvent({
                        event: 'request_funnel',
                        section_name: 'mi conexion a la red',
                        title_screen: 'solicitud de autoconsumo',
                        click_text: 'si',
                        element_type: 'consulta de informacion',
                        page_url: removeEmails(window.location.href),
                        request_type: 'quiero una conexion de autoconsumo',
                        question: '¿la potencia que solicitas es menor o igual a 15kW?',
                        browsing_type: sessionStorage.getItem('browsing_type')
                      })
                    }}
                  />
                  <Button
                    text={t('provisions.newGeneration.popupMessages.negative')}
                    color={secondAnswer === 'N' ? 'primary' : 'inherit'}
                    size='medium'
                    variant='contained'
                    className={classes.button}
                    onClick={() => {
                      setShowRequestBtn(true);
                      setShowThirdQuestion(false);
                      setSecondAnswer('N')
                      setThirdAnswer('')
                      // LCS: Enviar evento de GdC a GA - Wave 3
                      sendGAEvent({
                        event: 'request_funnel',
                        section_name: 'mi conexion a la red',
                        title_screen: 'solicitud de autoconsumo',
                        click_text: 'no',
                        element_type: 'consulta de informacion',
                        page_url: removeEmails(window.location.href),
                        request_type: 'quiero una conexion de autoconsumo',
                        question: '¿la potencia que solicitas es menor o igual a 15kW?',
                        browsing_type: sessionStorage.getItem('browsing_type')
                      })
                    }}
                  />
                </Grid>
              </div>
              </>
            )}

            {showThirdQuestion && (
              <>
                <Grid item xs={12}>
                  <Divider variant='middle' />
                </Grid>

                <Grid item xs className={classes.titles}>
                  <Typography className={classes.bold} variant='h5'>
                    {t('provisions.newGeneration.popupMessages.msg4')}
                  </Typography>
                </Grid>
                <Grid item className={classes.popButtons}>
                  <Button
                    text={t(
                      'provisions.newGeneration.popupMessages.affirmative'
                    )}
                    color={thirdAnswer === 'Y' ? 'primary' : 'inherit'}
                    size='medium'
                    variant='contained'
                    className={`${classes.button} yes`}
                    onClick={() => {
                      setShowFirstInfo(true);
                      setShowRequestBtn(false);
                      setThirdAnswer('Y')
                      // LCS: Enviar evento de GdC a GA - Wave 3
                      sendGAEvent({
                        event: 'request_funnel',
                        section_name: 'mi conexion a la red',
                        title_screen: 'solicitud de autoconsumo',
                        click_text: 'si',
                        element_type: 'consulta de informacion',
                        page_url: removeEmails(window.location.href),
                        request_type: 'quiero una conexion de autoconsumo',
                        question: '¿el autoconsumo estara en suelo urbano?',
                        browsing_type: sessionStorage.getItem('browsing_type')
                      })
                    }}
                  />
                  <Button
                    text={t('provisions.newGeneration.popupMessages.negative')}
                    color={thirdAnswer === 'N' ? 'primary' : 'inherit'}
                    size='medium'
                    variant='contained'
                    className={classes.button}
                    onClick={() => {
                      setShowRequestBtn(true);
                      setShowFirstInfo(false);
                      setThirdAnswer('N')
                      // LCS: Enviar evento de GdC a GA - Wave 3
                      sendGAEvent({
                        event: 'request_funnel',
                        section_name: 'mi conexion a la red',
                        title_screen: 'solicitud de autoconsumo',
                        click_text: 'no',
                        element_type: 'consulta de informacion',
                        page_url: removeEmails(window.location.href),
                        request_type: 'quiero una conexion de autoconsumo',
                        question: '¿el autoconsumo estara en suelo urbano?',
                        browsing_type: sessionStorage.getItem('browsing_type')
                      })
                    }}
                  />
                </Grid>
              </>
            )}

            {showFirstInfo && (
              <>
                <Grid item xs={12}>
                  <Divider variant='middle' />
                </Grid>

                <Grid item xs={12} className={classes.text}>
                  <Container>
                    <Typography variant='h6'>
                      {t('provisions.newGeneration.popupMessages.msg0') + ' '}
                      <Link>
                        <a className={classes.link} target='_blank' href='https://www.ufd.es/nueva-conexion-de-autoconsumo/'>                          
                          {t('provisions.newGeneration.popupMessages.here')}
                        </a>
                      </Link>
                    </Typography>
                    <TextButton className={classes.margin}>
                      <Link
                        underline='none'
                        onClick={() => {setShowDialog(true)}}
                      >
                        <InfoOutlinedIcon fontSize='medium' />
                        <Typography>
                          {t('provisions.newGeneration.popupMessages.info')}
                        </Typography>
                      </Link>
                    </TextButton>
                  </Container>
                </Grid>

              </>
            )}

            {ShowRequestBtn && (
              <>
                <Grid item xs={12} className={classes.text}>
                  <Container>
                    <Typography variant='h6'>
                      {t('provisions.newGeneration.popupMessages.msg10')}
                    </Typography>
                  </Container>
                </Grid>

                <Grid
                  item
                  xs={4}
                  container
                  justifyContent='center'
                  alignItems='center'
                >
                  <Button
                    text={t('provisions.newGeneration.popupMessages.buttonReq')}
                    color='primary'
                    size='large'
                    variant='contained'
                    onClick={() => {
                      dispatch(setDossierType('DOSTYP002'));
                      dispatch(setDossierSubtype('DOSSUB000'));
                      // LCS: Enviar evento de GdC a GA - Wave 3
                      sendGAEvent({
                        event: 'request_funnel',
                        section_name: 'mi conexion a la red',
                        title_screen: 'solicitud de autoconsumo',
                        click_text: 'solicitar acceso y conexion',
                        element_type: 'consulta de informacion',
                        page_url: removeEmails(window.location.href),
                        request_type: 'quiero una conexion de autoconsumo',
                        question: '¿el autoconsumo estara en el suelo urbano?',
                        browsing_type: sessionStorage.getItem('browsing_type')
                      })
                      history.push('/provisions/new-generation/keep-in-mind');
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Container>

      <div>
        <Dialog
          onClose={() => {}}
          fullWidth
          maxWidth='lg'
          open={ShowDialog}
          className={classes.dialogform}
          fullScreen
        >
          <DialogContent
           className={classes.dialogcontentborder}
           
          >
            <Grid
              container
              justifyContent='flex-end'
              className={classes.gridfix}
            >
              <TextButton
                onClick={() => {
                  setShowDialog(false);
                }}
              >
                <img src={CloseIcon} alt='' />
              </TextButton>
            </Grid>

            <DialogTitle className={classes.title}>
              <Typography variant='h3'>
                {t('provisions.newGeneration.popupMessages.info')}
              </Typography>
            </DialogTitle>

            <Grid container justifyContent='center' alignItems='center'>
              <Grid item xs={7}>
                <Box marginBottom={2}>
                  <Typography>
                    {t('provisions.newGeneration.popupMessages.msg5')}
                    <Link
                      onClick={() => {history.push('/provisions/new-provision')}}
                    >
                      <TextButton>{t('provisions.newGeneration.popupMessages.clickHere')}</TextButton>
                    </Link>
                  </Typography>
                </Box>

                <Box marginBottom={2}>
                  <Typography>
                    <b>{t('provisions.newGeneration.popupMessages.msg6b')}</b>
                    {t('provisions.newGeneration.popupMessages.msg6') + ' '}
                    <Link
                      onClick={() => {
                        dispatch(setDossierType('DOSTYP002'))
                        dispatch(setDossierSubtype('DOSSUB000'));
                        history.push('/provisions/new-generation/keep-in-mind')
                      }}
                    >
                      <TextButton> {t('provisions.newGeneration.popupMessages.clickHere')}  </TextButton>
                    </Link>
                  </Typography>
                </Box>

                <Box marginBottom={2}>
                  <Typography>
                    {t('provisions.newGeneration.popupMessages.msg91')}
                    <b>{t('provisions.newGeneration.popupMessages.msg91b')}</b>
                    {t('provisions.newGeneration.popupMessages.msg91c')}

                    <Link>
                      <a className={classes.link} target='_blank' href='https://www.ufd.es/nueva-conexion-de-generacion/que-documentacion-necesito'>
                        {t('provisions.newGeneration.popupMessages.Doc')}
                      </a>
                    </Link>
                    <Link>
                      <a className={classes.link} target='_blank' href='https://www.ufd.es/instaladores/autoconsumo'>
                        {t('provisions.newGeneration.popupMessages.Req')}
                      </a>
                    </Link>
                    {t('provisions.newGeneration.popupMessages.msg92b')}
                    {t('provisions.newGeneration.popupMessages.msg92')}
                    <Link
                      onClick={() => {
                        history.push('/requests/add');
                      }}
                    >
                      {' '}
                     <TextButton> {t('provisions.newGeneration.popupMessages.clickHere')}  </TextButton>
                    </Link>
                  </Typography>
                </Box>

                <Box marginBottom={2}>
                  <Typography>
                    {' '}
                    {t('provisions.newGeneration.popupMessages.msg7a')}
                    <b>{t('provisions.newGeneration.popupMessages.msg7b')}</b>
                    {t('provisions.newGeneration.popupMessages.msg7c')}
                    <Link>
                      <a className={classes.link} target='_blank' href='https://www.ufd.es/instaladores/solicitar-corte-programado'>
                        {t('provisions.newGeneration.popupMessages.here')}
                      </a>
                    </Link>
                  </Typography>
                </Box>

                <Box marginBottom={2}>
                  <Typography>
                    {t('provisions.newGeneration.popupMessages.msg8a')}
                    <b>{t('provisions.newGeneration.popupMessages.msg8b')}</b>
                    {t('provisions.newGeneration.popupMessages.msg8c')}

                    <Link
                      onClick={() => {
                        // dispatch(setDossierType('DOSTYP003'));
                        // dispatch(setDossierSubtype(''));
                        // dispatch(setCurrentProvision({}));
                        // dispatch(setCadastreDataCoordinates({ x: '', y: '' }));
                        // dispatch(setCadastreDataItem({}));
                        history.push({
                          pathname:
                            '/provisions/edit-installations/keep-in-mind',
                        });
                      }}
                    >
                    <TextButton>  {t('provisions.newGeneration.popupMessages.clickHere')}  </TextButton>
                    </Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    </Box>
  );
};

export default SecurityHOC(Question);
