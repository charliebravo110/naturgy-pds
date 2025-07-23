import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#959595',
    filter: 'grayscale(1)',
    alignItems: 'center',
    marginTop: 24
  },
  item: {
    paddingLeft: 24,
    borderLeft: 'solid 1px #959595',
    marginLeft: 28,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      borderLeft: 0,
      margin: '14px 0 0 0'
    },
    '&:first-child': {
      paddingLeft: 0,
      borderLeft: 0,
      marginLeft: 0
    }
  },
  itemContainer: {
    alignItems: 'center'
  },
  icon: {
    '&.documentation': {
      height: 20
    },
    '&.claim': {
      height: 24,
      '& img': {
        width: 24,
        height: 24
      }
    },
    '& img': {
      width: 20,
      height: 20
    }
  },
  label: {
    maxWidth: 292,
    fontSize: 14,
    marginLeft: 8
  }
}))

export default useStyles
