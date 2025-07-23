import { StyleSheet, Font } from '@react-pdf/renderer'

import FSEmeric from '../../../../../assets/fonts/fsemeric/FSEmeric.ttf'
import FSEmericBold from '../../../../../assets/fonts/fsemeric/FSEmeric-SemiBold.ttf'

Font.register({ family: 'FSEmeric', fonts: [
  { src: FSEmeric },
	{ src: FSEmericBold, fontWeight: 700 }
]})

const useStyles = StyleSheet.create({
  page: {
    position: 'relative',
    color: '#004571',
    fontFamily: 'FSEmeric',
    fontSize: 12,
    paddingTop: 64,
    paddingRight: 54,
    paddingBottom: 64,
    paddingLeft: 54
  },
  sidebar: {
    position: 'absolute',
    top: '94%',
    left: 16,
    width: '1.2em',
    fontSize: 8,
    transform: 'rotate(-90deg)'
  },
  header: {
    display: 'flex',
    fontSize: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 18,
    borderStyle: 'solid',
    borderColor: '#BFB8AE',
    borderBottomWidth: 1,
    marginBottom: 18
  },
  bold: {
    fontWeight: 700
  },
  boldSmall: {
    fontWeight: 700,
    fontSize: 5
  },
  boldMedium: {
    fontWeight: 700,
    fontSize: 9
  },
  small: {
    fontSize: 5
  },
  medium: {
    fontSize: 9
  },
  logo: {
    width: 65
  },
  pageNumberContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  pageNumber: {
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 18,
    color: 'rgba(0, 0, 0, 0.87)'
  },
  contractData: {
    marginTop: -18,
    fontSize: 10    
  },
  contractDataTitle: {
    color: '#E57200',
    fontWeight: 700,
    marginTop: 8
  },
  contractDataItem: {
    marginTop: 8
  },
  dates: {
    fontSize: 10
  },
  datesItem: {
    marginTop: 8
  },
  contractInvoices: {
    marginTop: 32,
    marginBottom: 20,
  },
  contractInvoicesSelfConsumption: {
    marginTop: 32,
  },
  contractInvoicesTitle: {
    color: '#E57200',
    fontWeight: 700,
    fontSize: 10,
  },
  contractInvoicesTable: {
    display: 'flex',
    width: 'auto',
    minHeight: 220,
    fontSize: 6,
    textAlign: 'center',
    marginTop: 8
  },
  contractInvoicesTableSelfConsumption: {
    display: 'flex',
    width: 'auto',
    minHeight: 100,
    fontSize: 6,
    textAlign: 'center',
    marginTop: 8
  },
  contractInvoicesTableHeader: {
    backgroundColor: '#ECEAE7',
    padding: 4,
    // paddingTop: 4,
    // paddingBottom: 4,
    // paddingLeft: 16
  },
  contractInvoicesTableHeaderRow: {
    flexDirection: 'row'
  },
  contractInvoicesTableHeaderRowCell76: {
    width: '12.28%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell11: {
    width: '11.11%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell46: {
    width: '4.69%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell106: {
    width: '10.69%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell76Colored: {
    width: '12.28%',
    backgroundColor: '#F6F5F3',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell76V2: {
    width: '13.28%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell11V2: {
    width: '11.11%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell30: {
    width: '12.28%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell15: {
    width: '24.56%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell23: {
    width: '36.84%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell22: {
    width: '22.22%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell23V2: {
    width: '13.28%',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell50: {
    width: '50%',
    padding: 4
  },
  contractInvoicesTableHeaderRowCell25: {
    width: '25%',
    padding: 4
  },
  contractInvoicesTableHeaderRowCell50Colored: {
    width: '50%',
    backgroundColor: '#F6F5F3',
    padding: 4
  },
  contractInvoicesTableHeaderRowCell25Colored: {
    width: '25%',
    backgroundColor: '#F6F5F3',
    padding: 4
  },
  contractInvoicesTableContainer: {
    // paddingTop: 4,
    // paddingBottom: 4,
    // paddingLeft: 16
    padding: 4
  },
  contractInvoicesTableContainerRow: {
    flexDirection: 'row'
  },
  contractInvoicesTableContainerRowCell76: {
    width: '12.28%',
    padding: 2
  },
  contractInvoicesTableContainerRowCell11: {
    width: '11.11%',
    padding: 2
  },
  contractInvoicesTableContainerRowCell76V2: {
    width: '13.28%',
    padding: 2
  },
  contractInvoicesTableContainerRowCell11V2: {
    width: '11.11%',
    padding: 2
  },
  contractInvoicesTableContainerRowCell53: {
    width: '49.12%',
    padding: 2
  },
  contractInvoicesTableContainerRowCell44: {
    width: '44.44%',
    padding: 2
  },
  contractInvoicesTableContainerRowCell30: {
    width: '12.28%',
    padding: 2
  },
  contractInvoicesTableContainerRowCell76Colored: {
    width: '12.28%',
    backgroundColor: '#FCF1E5',
    padding: 2
  },
  contractInvoicesTableContainerRowCell56: {
    width: '4.69%',
    padding: 2
  },
  contractInvoicesTableContainerRowCell96: {
    width: '10.69%',
    padding: 2
  },
  contractInvoicesTableContainerRowCell25: {
    width: '25%',
    padding: 4
  },
  contractInvoicesTableContainerRowCell50Colored: {
    width: '50%',
    backgroundColor: '#FCF1E5',
    padding: 4,
    paddingRight: 8
  },
  contractInvoicesTableContainerRowCell25Colored: {
    width: '25%',
    backgroundColor: '#FCF1E5',
    padding: 4
  },
  contractInvoicesTableFooter: {
    fontSize: 12,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 16,
    borderStyle: 'solid',
    borderColor: '#BFB8AE',
    borderBottomWidth: 3,
    marginBottom: 10
  },
  contractInvoicesTableFooterRow: {
    flexDirection: 'row'
  },
  contractInvoicesTableFooterRowCell50: {
    width: '50%',
    padding: 4
  },
  contractInvoicesTableFooterRowCell25: {
    width: '25%',
    padding: 4
  },
  sign: {
    width: '32%',
    textAlign: 'center',
    marginTop: 32
  },
  signImage: {
    width: 75,
    marginBottom: 6,
    marginLeft: 40
  },
  signTexts: {
    width: '100%'
  },
  signText: {
    fontSize: 10,
    marginTop: 6
  },
  sateliteVertical: {
    position: 'absolute',
    width: 70,
    bottom: 0,
    right: 0
  },
  sateliteHorizontal: {
    position: 'absolute',
    width: 230,
    bottom: 0,
    left: 15
  },
  summaryBox: {
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderStyle: 'solid',
    borderColor: '#BFB8AE',
    borderWidth: 1,
    textAlign: 'center',
  },
  summaryHeader: {
    backgroundColor: '#ECEAE7',
  },
  summaryTitleCont: {
    padding: 4,
  },
  splitSummary: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  halfHeader: {
    width: '50%',
    padding: 4,
  },
  halfSummaryData: {
    width: '50%',
    padding: 4,
  },
  halfSummaryDataColored: {
    width: '50%',
    backgroundColor: '#FCF1E5',
    padding: 4,
  },
  red: {
    marginBottom: '100px',
    fontSize: 8
  },
}) as any

export default useStyles
