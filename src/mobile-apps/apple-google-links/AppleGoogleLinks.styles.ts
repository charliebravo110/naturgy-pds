import { makeStyles } from '@material-ui/core/styles'
import satelite_horizontal from '../../assets/img/satelite_horizontal.svg'
import { COLOR_CLIENT_NAVY } from '../common/configAndConstants'

const useStyles = makeStyles((theme) => ({
  container: {
    //mobile first
    padding: '16px 0 0 0',
    [theme.breakpoints.up('sm')]: {
      padding: '32px',
    },
  },
  content: {
    backgroundColor: COLOR_CLIENT_NAVY,
    color: 'white',
    width: '100%',
    //mobile first
    padding: '23px 15px 32px 17px',
    [theme.breakpoints.up('sm')]: {
      padding: '32px',
    },

    '& > h3': {
      fontSize: '24px',
      fontWeight: '400',
      marginTop: '0',
      marginBottom: '0',
    },
    '& > h4': {
      fontSize: '20px',
      fontWeight: '400',
      marginTop: '16px',
    },

    '& > ul': {
      paddingInlineStart: '30px',
    },

    '& > ul > li': {
      lineHeight: '22px',
      paddingBottom: '10px',
    },

    // orange moon
    backgroundImage: `url(${satelite_horizontal})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '160px',
    backgroundPositionY: 'bottom',
    backgroundPositionX: '10%',
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap', // for very narrow phones
    justifyContent: 'space-evenly',
  },
}))

export default useStyles
