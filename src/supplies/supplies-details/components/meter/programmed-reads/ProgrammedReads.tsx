import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import NewProgrammedReadForm from './new-programmed-read-form/NewProgrammedReadForm'
import Downloads from './downloads/Downloads'
import Table from './table/Table'

import useStyles from './ProgrammedReads.styles'

const ProgrammedReads = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    supplyData,
    isLoading,
    setIsLoading,
    setIsExportTableDataDialogOpen,
    setIsExportAllDataDialogOpen,
    showProgramingRead
  } = props

  return (
    <Grid container className={classes.container}>
      {/* Muestra la pantalla de mostrar formulario de lectura programada */}
      {showProgramingRead &&
        <NewProgrammedReadForm
          supplyData={supplyData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      }

      <Grid container className={classes.toolbar}>
        <Grid item className={classes.title}>
          {t('supplies.suppliesDetails.components.meter.programmedReads.title')}
        </Grid>
        <Grid item>
          <Downloads
            setIsExportTableDataDialogOpen={setIsExportTableDataDialogOpen}
            setIsExportAllDataDialogOpen={setIsExportAllDataDialogOpen}
            supplyData={supplyData}
          />
        </Grid>
      </Grid>
      <Grid container className={classes.toolbar}>
        <Table supplyData={supplyData} setIsLoading={setIsLoading} />
      </Grid>
    </Grid>
  )
}

export default ProgrammedReads
