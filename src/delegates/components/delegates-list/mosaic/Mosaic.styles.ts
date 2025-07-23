import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  table: {
    width: '100%',
    fontSize: 14,
    borderRadius: 4,
    overflow: 'hidden'
  },
  item: {
    backgroundColor: '#F8F7F6',
    textAlign: 'center',
    padding: '12px 20px 2px',
    borderRadius: 4
  },
  row: {
    marginTop: 14
  },
  title: {
    color: '#1674D1',
    fontSize: 'inherit',
    fontWeight: 'bold'
  },
  value: {
    fontSize: 'inherit',
    marginTop: 6,
    '&.bold' : {
      fontWeight: 'bold'
    }
  },
  editButton: {
    display: 'flex',
    color: '#1674D1',
    textDecoration: 'none',
    '& img': {
      paddingRight: 5
    }
  }
})

export default useStyles
