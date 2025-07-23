import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './EstimatedMaximumPower.styles'

const EstimatedMaximumPower = (props: any) => {

  const {
    potContratada,
    potMaxDemanda
  } = props

  const classes = useStyles({})
  const [operator, setOperator] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  const tabletRes = useMediaQuery('(max-width:768px)')
  const mobile = useMediaQuery('(max-width:576px)')
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const estimatedRef = useRef(null)
  const estimatedRefLabel = useRef(null)
  const maxRef = useRef(null)
  const maxRefNeg = useRef(null)

  const charPotConWidth = 16 * (potMaxDemanda.toString()).length

  useEffect(() => {
    const potContratadaNumber = parseFloat(potContratada)
    const potMaxDemandadaNumber = parseFloat(potMaxDemanda)

    const maxNumber = potContratadaNumber >= potMaxDemandadaNumber ? potContratadaNumber : potMaxDemandadaNumber

    if (maxNumber === 0) {

      if (potMaxDemanda !== '') {
        const potMaxDemanda = potMaxDemandadaNumber
        if (potMaxDemanda > 0 && potMaxDemanda <= 1) {
            setOperator(1)
        } else if (potMaxDemanda > 1 && potMaxDemanda <= 5) {
            setOperator(5)         
        } else if (potMaxDemanda > 5 && potMaxDemanda <= 10) {
            setOperator(10)
        } else {
            setOperator(100)
        }
      }

    } else if (maxNumber < 1) {
        setOperator(1)
    } else if (maxNumber >= 1 && maxNumber <= 5) {
        setOperator(5)
    } else if (maxNumber > 5 && maxNumber <= 10) {
        setOperator(10)
    } else if (maxNumber > 10 && maxNumber <= 20) {
        setOperator(20)
    } else if (maxNumber > 20 && maxNumber <= 100) {
        setOperator(100)
    } else if (maxNumber > 100 && maxNumber <= 1000) {
        setOperator(1000)
    } else if (maxNumber > 1000 && maxNumber <= 10000) {
        setOperator(10000)
    } else {
        setOperator(100000)
    }
  })

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      setWindowWidth(window.innerWidth-1)
      window.removeEventListener('resize', handleResize)
    }
    
  })

  useEffect(() => {
    setWindowWidth(window.innerWidth+1)
    if (potMaxDemanda && potContratada && containerRef && estimatedRef && maxRef && operator) {

      const estimated = parseFloat(potMaxDemanda)
      const max = parseFloat(potContratada)

      const containerWidth: any = window.getComputedStyle(containerRef.current).getPropertyValue('width')
      const containerWidthN: any = containerWidth.substring(0, containerWidth.length - 2)

      const estimatedMultiplier = mobile ? 0.87 : tabletRes ? 0.85 : 0.842
      const maxMultiplier = mobile ? 0.87 : tabletRes ? 0.85 : 0.842

      let estimatedWidth: any
      let maxWidth: any

      if (max === 0 || max >= estimated) {

        estimatedWidth = ((containerWidthN * estimated) / operator) * estimatedMultiplier
        maxWidth = ((containerWidthN * (max - estimated)) / operator) * maxMultiplier

      

        if (maxRef.current) {
          if (estimated === max) {
            maxWidth = 1
          }
          maxRef.current.style.width = maxWidth + 'px'
        }

      } else {

        estimatedWidth = ((containerWidthN * estimated) / operator) * estimatedMultiplier
        maxWidth = ((containerWidthN * max) / operator) * maxMultiplier

        if (maxRefNeg && maxRefNeg.current) {
          maxRefNeg.current.style.width = maxWidth + 'px'
        }

      }

      estimatedRef.current.style.width = estimatedWidth + 'px'
      
      if (estimatedRefLabel && estimatedRefLabel.current && parseFloat(potContratada) > parseFloat(potMaxDemanda)) {
        estimatedRefLabel.current.style.width = estimatedWidth + 'px'
      } 

    }
  }, [estimatedRef, estimatedRefLabel, maxRef, operator, windowWidth])

  return (
    potMaxDemanda !== '' &&
    <>
      {
        (mobile || tabletRes) &&
        <Grid container justifyContent='space-between' className={classes.mobileLabelsContainer}>
          <Grid item className={classes.mobileMargin}>
            <Grid container direction='column'>
              <Grid className={classes.infoNumberConsumedMobile}>
                {potMaxDemanda}
                <Grid className={classes.infoW}>
                  {t('supplies.suppliesDetails.components.maxPowerEstimated.kW')}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {
            parseFloat(potContratada) > 0 && (
              <Grid item>
                <Grid container direction='column'>
                  <Grid item>
                    <Grid className={classes.infoNumberMax} style={{ marginLeft: charPotConWidth }}>
                      {potContratada.replace('.', ',')}
                      <Grid className={classes.infoW}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.kW')}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )
          }
        </Grid>
      }
      <Grid container className={classes.graphBlock} justifyContent='center'>
        <Grid container className={(mobile || tabletRes) ? classes.graphContainerMobile : classes.graphContainer} item md={10} sm={10} ref={containerRef}>
          {
            parseFloat(potContratada) < parseFloat(potMaxDemanda) &&
              <div className={classes.graphDifferenceNegative} ref={maxRefNeg}>
                {
                  parseFloat(potContratada) > 0 &&
                  <>
                    <div className={classes.barMax} />
                    <div className={classes.infoMaxNeg}>
                      {
                        parseFloat(potContratada) > 0 && (
                          (!mobile && !tabletRes) &&
                          <Grid container direction='column' alignItems='center'>
                            <Grid item>
                              <Grid className={classes.infoNumberMax} style={{ marginLeft: charPotConWidth }}>
                                {potContratada.replace('.', ',')}
                                <Grid className={classes.infoW}>
                                  {t('supplies.suppliesDetails.components.maxPowerEstimated.kW')}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        )
                      }
                    </div>
                  </>
                }
              </div>
          }
            <div className={((parseFloat(potContratada) < parseFloat(potMaxDemanda)) && (parseFloat(potMaxDemanda) !== 0) && (parseFloat(potContratada) !== 0)) ? classes.graphConsumedNeg : classes.graphConsumed} ref={estimatedRef}>
              <div className={classes.barConsumed} />
              <div className={(parseFloat(potContratada) < parseFloat(potMaxDemanda) && (parseFloat(potContratada) !== 0)) ? classes.infoConsumedNeg : classes.infoConsumed}>
                {
                  (!mobile && !tabletRes) &&
                  <Grid container direction='column' className={classes.estimatedLabel} ref={estimatedRefLabel}>
                    <Grid item>
                      <Grid className={classes.infoNumberConsumed}>
                        {potMaxDemanda}
                        <Grid className={classes.infoW}>
                          {t('supplies.suppliesDetails.components.maxPowerEstimated.kW')}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                }
              </div>
            </div>
          {
            parseFloat(potContratada) >= parseFloat(potMaxDemanda) &&
              <div className={classes.graphDifference} ref={maxRef}>
                {
                  parseFloat(potContratada) > 0 &&
                  <div className={classes.barMax} />
                }
              </div>
          }
          <div className={classes.graphBlank}>
            {
              parseFloat(potContratada) >= parseFloat(potMaxDemanda) &&
              <div className={classes.infoMax}>
                {
                  parseFloat(potContratada) > 0 && (
                    (!mobile && !tabletRes) &&
                    <Grid container direction='column'>
                      <Grid item>
                        <Grid className={classes.infoNumberMax} style={{ marginLeft: charPotConWidth }}>
                          {potContratada.replace('.', ',')}
                          <Grid className={classes.infoW}>
                            {t('supplies.suppliesDetails.components.maxPowerEstimated.kW')}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                }
              </div>
            }
          </div>
        </Grid>
      </Grid>
    </>

  )
}

export default EstimatedMaximumPower
