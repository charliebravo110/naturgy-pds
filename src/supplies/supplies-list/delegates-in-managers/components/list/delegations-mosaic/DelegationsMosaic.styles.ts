import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  table: {
    width: '100%',
    fontSize: 14,
    borderRadius: 4,
    overflow: 'hidden'
  },
  item: {
    backgroundColor: '#F8F7F6',
    textAlign: 'center',
    padding: '12px 12px 26px',
    borderRadius: 4
  },
  row: {
    marginTop: 14
  },
  title: {
    color: '#004571',
    fontSize: 'inherit',
    fontWeight: 'bold',
    lineHeight: 1
  },
  value: {
    fontSize: 'inherit',
    marginTop: 6,
    '&.bold' : {
      fontWeight: 'bold'
    },
    '& a': {
      color: '#1674D1'
    }
  },
  button: {
    marginTop: 26
  },
  editButton: {
    display: 'flex',
    color: '#1674D1',
    justifyContent: 'center',
    '& p': {
      marginTop: 0,
      marginBottom: 0
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  delegates: {
    background: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: 20
  },
  supplyTypeIcon: {
    '& img': {
      width: 16,
      height: 16
    }
  },
  supplyTypeLabel: {
    marginLeft: 2
  },
  periodDate: {
    display: 'block',
    fontSize: 'inherit',
    marginTop: 6,
    '&.bold' : {
      fontWeight: 'bold'
    },
    '& a': {
      color: '#1674D1'
    }
  },
  managerName: {
    fontWeight: 'bold',
    color: '#E97000'
  },
  consultantName: {
    fontWeight: 'bold',
    color: '#004571'
  }
}))

export default useStyles
