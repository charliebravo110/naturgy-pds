import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../../../../common/components/button/Button'
import Dialog from '../../../../common/components/dialog/Dialog'
import TextButton from '../../../../common/components/text-button/TextButton'

import CloseIcon from '../../../../assets/icons/cerrar.svg'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'

import useStyles from './Alert.styles'

// LCS: Importa la función - Wave 3
import { getExpStatus, sendGAEvent, removeEmails } from '../../../../core/utils/gtm';

const Alert = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const {openAlert, setOpenAlert, handleDownloadDocument, numFactura, codExp, status, type, provision} = props

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  const handleDownload = (selloDigital: string) => {
    handleDownloadDocument(numFactura, codExp, selloDigital)
    setOpenAlert(false)
    
    // LCS: Enviar evento de GdC a GA - Wave 3
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();
    // LCS: Enviar evento de GdC a GA - Wave 3
    if(type == 'b'){
      sendGAEvent({
        event: 'browsing',
        section_name: 'mi conexion a la red',
        subsection_name: 'detalle de solicitud',
        click_text: selloDigital === 'SI' ? 'descargar la factura con sello digital' : 'descarga la factura en pdf',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_number: codExp ? codExp : 'no aplica',
        request_status: getExpStatus(provision.dossierStatusId),
        module_name: 'facturas',
        billing_number: numFactura,
        billing_status: status.toLowerCase(),
        browsing_type: sessionStorage.getItem('browsing_type'),
        issue_date: `${day}/${month}/${year}`,
      });
    } else{
      sendGAEvent({
        event: 'download',
        section_name: 'mi conexion a la red',
        subsection_name: 'mis facturas de conexion a la red',
        click_text: selloDigital === 'SI' ? 'descargar la factura con sello digital' : 'descarga la factura en pdf',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        billing_number: numFactura,
        request_number: codExp ? codExp : 'no aplica',
        billing_status: status.toLowerCase(),
        issue_date: `${day}/${month}/${year}`,
        browsing_type: sessionStorage.getItem('browsing_type')
      });
    }
  }

  return (
    <Dialog className={classes.dialog} open={openAlert} onClose={handleCloseAlert} {...props}>
      <DialogContent>
        <TextButton className={classes.closeButton} onClick={handleCloseAlert}>
          <img src={CloseIcon} alt='' />
        </TextButton>
        <Grid
          container
          className={classes.container}
          direction='column'
          justifyContent='center'
          alignItems='center'
          spacing={2}
        >
          <Grid item className={classes.title} md={12}>{t('provisions.billsList.downloadModal.title')}</Grid>

          <Grid item className={classes.subTitle} md={12}>{t('provisions.billsList.downloadModal.question')}</Grid>

          <Grid container md={12} spacing={2} justifyContent='center'>
            <Grid item md={5}>
              <Button
                text={t('provisions.billsList.downloadModal.button1')}
                color='primary'
                size='large'
                variant='contained'
                className={classes.button}
                onClick={() => handleDownload('SI')}
              />
            </Grid>
            <Grid item md={5}>
              <Button
                text={t('provisions.billsList.downloadModal.button2')}
                color='primary'
                size='large'
                variant='contained'
                className={classes.button}
                onClick={() => handleDownload('NO')}
              />
            </Grid>
          </Grid>
          
          <Grid item>
            <Button
              text={t('provisions.billsList.downloadModal.close')}
              color='secondary'
              size='large'
              variant='contained'
              className={classes.button2}
              onClick={handleCloseAlert}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default Alert
