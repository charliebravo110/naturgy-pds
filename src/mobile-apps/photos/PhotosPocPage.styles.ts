import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    // values taken from the existing code
    marginTop: 128,
    padding: '20px 0',
    [theme.breakpoints.only('xs')]: {
      marginTop: 70,
    },
    maxWidth: 1200,

    // values added
    paddingLeft: '20px',
    paddingRight: '20px',
    '& button': {
      margin: '6px',
    },
    '& ul li': {
      lineHeight: '2em',
    },
  },
  imgThumb: {
    maxWidth: '150px',
    maxHeight: '150px',
    objectFit: 'contain',
  },
}))

export default useStyles
