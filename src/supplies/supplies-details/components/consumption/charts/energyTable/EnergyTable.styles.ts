import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  containerAutoConsumption: {
    border: 'solid 2px #E1E9EE',
    marginTop: 20,
    marginRight: 100,
    marginLeft: 100,
    '&::-webkit-scrollbar': {
      width: 8
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 69, 113, .6)',
      borderRadius: 4,
    }
  },
  energyTitle: {
    textAlign: 'center',
    color: 'rgba(0, 69, 113, 1)',
    width: '100%',
    fontSize: 20,
    marginTop: 30,
    marginBottom: 10
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
  headerAutoConsumption: {
    '& th': {
      color: 'rgba(0, 69, 113, 1)',
      fontSize: 19,
      fontWeight: 'bold',
      paddingTop: '16px',
      paddingRight: '16px',
      paddingBottom: '16px'
    }
  },
  bodyAutoConsumption: {
    '& td': {
    textAlign: 'center',
    color: 'rgba(0, 69, 113, 1)',
    fontSize: 14,
    padding: 5,
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
  cellEHCR: {
    backgroundColor: '#f2fafb',
    '&.min': {
      color: '#bfbf60'
    },
    '&.max': {
      color: '#d3222a'
    }
  },
  cellEHAC: {
    backgroundColor: '#fafbf2',
    '&.min': {
      color: '#bfbf60'
    },
    '&.max': {
      color: '#d3222a'
    }
  },
  cellEHCCA: {
    backgroundColor: '#f2f7fc',
    '&.min': {
      color: '#bfbf60'
    },
    '&.max': {
      color: '#d3222a'
    }
  },
  cellEHEX: {
    backgroundColor: '#fef8f2',
    '&.min': {
      color: '#bfbf60'
    },
    '&.max': {
      color: '#d3222a'
    }
  },
  cellEHNG: {
    backgroundColor: '#fbf6f6',
    '&.min': {
      color: '#bfbf60'
    },
    '&.max': {
      color: '#d3222a'
    }
  },
  cellEHCSA: {
    backgroundColor: '#fbf7fe',
    '&.min': {
      color: '#bfbf60'
    },
    '&.max': {
      color: '#d3222a'
    }
  },
  cellEHNGi: {
    backgroundColor: '#b5474c',
    '&.min': {
      color: '#bfbf60'
    },
    '&.max': {
      color: '#d3222a'
    }
  },
  headerCell: {
    paddingLeft: '16px'
  },
  simpleCell: {
    paddingLeft: '0px'
  }
}))

export default useStyles