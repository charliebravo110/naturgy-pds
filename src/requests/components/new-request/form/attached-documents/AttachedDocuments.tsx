import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import DocumentIcon from '../../../../../assets/icons/plano_documento_adjunto.svg'

import useStyles from './AttachedDocuments.styles'

const AttachedDocuments = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const requests = useSelector((state: any) => state.requests)

  return (
    <div className={classes.container}>
      <Grid container className={classes.attachedDocuments}>
        <div className={classes.label}>{t('requests.newRequest.form.attachedDocuments.label')}</div>

        <Grid container className={classes.list}>
          <Grid item md={9} sm={12} xs={12}>
            {
              requests.newRequestData.documents.map(
                (item, index) => {
                  return (
                    <Grid key={index} container className={classes.document}>
                      <Grid item>
                        <Grid container spacing={2}>
                          <Grid item>
                            <img src={DocumentIcon} alt='' />
                          </Grid>

                          <Grid item>{item.nombreArchivo}</Grid>
                        </Grid>
                      </Grid>

                      {/* <Grid item className={classes.removeContainer}>
                        <img src={RemoveIcon} alt='' onClick={() => handleRemoveAttachedDocument(item)} />
                      </Grid> */}
                    </Grid>
                  )
                }
              )
            }
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default AttachedDocuments
