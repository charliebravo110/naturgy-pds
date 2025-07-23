import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'

import FaqInfo from '../../interfaces/FaqInfo'

import svgRespuesta from '../../../assets/icons/respuesta.svg'
import arrowDown from '../../../assets/icons/flecha_down_blue.svg'

import useStyles from './FaqItem.styles'

const FaqItem = (props: any) => {
    const classes = useStyles({})
    const [ opened, setOpened ] = useState(false)

    const faqInfo: FaqInfo = props.faqInfo

    return (
        <Grid container justifyContent='center' className={classes.faqItem} key={faqInfo.id + ' faq'} >
            <Grid 
                container 
                alignItems='flex-start' 
                className={classes.question} 
                onClick={() => setOpened(!opened)}
            >
                <Grid item xs={2} sm={1} >
                    <img src={svgRespuesta} alt='FAQ' />
                </Grid>
                <Grid container item xs={9} sm={10} alignItems='center' className={classes.questionText} >
                    {faqInfo.question}
                </Grid>
                <Grid item xs={1} className={classes.arrow} >
                    {!opened && <img src={arrowDown} alt='arrow' className={classes.arrowIcon} />}
                    {opened && <img src={arrowDown} alt='arrow' className={`${classes.arrowIcon} ${classes.arrowIconUp}`} />}
                </Grid>
                
            </Grid>
            
            {opened && <Grid item xs={11} md={10} className={classes.answer}>{faqInfo.answer}</Grid>}
        </Grid>  
    )
  }
  
  export default FaqItem