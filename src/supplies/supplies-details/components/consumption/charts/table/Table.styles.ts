import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: 780,
    overflow: 'auto',
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20,
    '&::-webkit-scrollbar': {
      width: 8
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 69, 113, .6)',
      borderRadius: 4,
    }
  },
  table: {
    borderCollapse: 'collapse',
    borderStyle: 'hidden',
    '& td': {
      color: '#1674D1',
      border: 'dashed 2px #E1E9EE'
    }
  },
  header: {
    '& th': {
      color: 'rgba(0, 69, 113, 1)',
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  index: {
    width: '24%'
  },
  valueCell: {
    width: '35%'
  },
  value: {
    alignItems: 'center'
  },
  alert: {
    width: 16
  },
  icon: {
    height: 16,
    marginLeft: 10
  },
  color: {
    '&.green': {
      color: '#bfbf60'
    },
    '&.red': {
      color: '#d3222a'
    }
  }
}))

export default useStyles
