import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import Input from '@material-ui/core/Input';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import useStyles, { StyledTableCell } from './ListSupply.styles';
import StarIcon from '@material-ui/icons/Star';
import EditIcon from '../../assets/icons/editar.svg'
import ConsumptionIcon from '../../assets/icons/ico_listado_consumo.svg';
import GenerationIcon from '../../assets/icons/ico_listado_generacion.svg';
import Grid from '@material-ui/core/Grid';
import { thunkUpdateSupply } from '../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions';
import { appendSuppliesList, resetSuppliesList } from '../../supplies/store/actions/SuppliesActions';
import ArrowTooltip from '../../common/components/tooltip/arrow/ArrowTooltip'
import { Typography, useMediaQuery, useTheme } from '@material-ui/core';

const ListSupply = (props: any) => {

  const {
    listItems,
  } = props;

  const classes = useStyles({});
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const user = useSelector((state: any) => state.user.profile);
  const userToken = useSelector((state: any) => state.user.token);

  const [supplyList, setSupplyList] = useState(listItems);
  const [isModifyingNameIndex, setIsModifyingNameIndex] = useState(null);

  // JAG - 20230109 - ppm_1008179 - Solo mostramos los suministros Activos Contratados 
  const onlySupplyActives = supplyList.filter(item => item.descStatus == 'ACTIVO CONTRATADO');

  let oldSupplyName;

  const getCurrentFavSupply = () => {
    let currentFavSupply;
    supplyList.forEach(supply => {
      if (supply.icon !== undefined && supply.icon.includes('fav')) {
        currentFavSupply = supply;
      }
    });
    return currentFavSupply;
  }

  const changeFav = (newFavSupply) => {
    const lastFavSupply = getCurrentFavSupply();

    let auxSupplyList = [...supplyList];
    auxSupplyList.forEach((supply, index) => {
      if (supply.cups === newFavSupply.cups) {
        if (lastFavSupply !== undefined && lastFavSupply.cups === newFavSupply.cups) {
          auxSupplyList[index].icon = '';
        } else {
          auxSupplyList[index].icon = 'fav';
        }
      } else {
        auxSupplyList[index].icon = '';
      }
    });

    setSupplyList(auxSupplyList);

    if (lastFavSupply !== undefined) {
      updateSupply(lastFavSupply);
    }
    updateSupply(newFavSupply);
    dispatch(resetSuppliesList())
    dispatch(appendSuppliesList(auxSupplyList))
  }

  const updateSupply = async (supply) => {
    dispatch(thunkUpdateSupply(supply.cups, user.documentNumber, supply.name, supply.icon, userToken, () => {
    }));
  }

  const handleOnClickSupplyName = (name, index) => {
    oldSupplyName = name;
    setIsModifyingNameIndex(index);
  }

  const handleOnBlurSupplyName = (e, supply) => {
    const newName = e.target.value;

	if (newName === '' || oldSupplyName === newName) {
      setIsModifyingNameIndex(null);
      return null;
    }

	supply.name = newName;

	updateSupply(supply);
    setIsModifyingNameIndex(null);
    showSupplyData(supply);
  }

  const showSupplyData = (supply) => {
    props.handleShowSupplyData(supply);
  }

  return (
    mobile ?
      <Grid container spacing={2}>
        {onlySupplyActives.map((supply, index) => ( /* JAG - 20230109 - ppm_1008179 - Solo mostramos los suministros Activos Contratados */
          <Grid item key={index} lg={4} md={6} sm={6} xs={12}>
			      <Grid className={classes.item}>
              <Grid className={classes.row}>
                <Typography className={classes.title}>{t('dashboard.puntossuministro.name')}</Typography>
                <Typography className={classes.value}>
                  {isModifyingNameIndex === index ?
                    <Input inputProps={{maxLength : 25}} className={classes.supplyName} onBlur={(e) => handleOnBlurSupplyName(e, supply)} autoFocus/>
                    :
                    <span className={classes.supplyName} onClick={() => handleOnClickSupplyName(supply.name, index)}>
                      {supply.name ? supply.name : ''}
                    </span>
                  }
                  <img className={classes.buttonIcon} src={EditIcon} alt='' />
                </Typography>
              </Grid>
              <Grid className={classes.row}>
                <Typography className={classes.title}>{t('dashboard.puntossuministro.Cups')}</Typography>
                <Typography className={classes.value}>{supply.cups ? supply.cups : ''}</Typography>
              </Grid>	
              {supply.address &&
                <Grid className={classes.row}>
                  <Typography className={classes.title}>{t('dashboard.puntossuministro.address')}</Typography>
                  <Typography className={classes.value}>
                    {(supply.address.street ? supply.address.street : '') + ' ' + (supply.address.number ? supply.address.number : '')  + ', ' + ' ' + (supply.address.town ? supply.address.town : '') + ', ' + ' ' + ', ' + (supply.address.province ? supply.address.province : '') + ' ' + (supply.address.zipCode ? supply.address.zipCode : '')}
                  </Typography>
                </Grid>
              }
              <Grid className={classes.row}>
                <Typography className={classes.title}>{t('dashboard.puntossuministro.supplyType')}</Typography>
                <Typography className={classes.value}>
				          {supply.isGenerator === '0' ?
                    <>
                    <img src={ConsumptionIcon} alt='' />{t('dashboard.puntossuministro.consumption')}
                    </>
				          :
                    <>
                    <img src={GenerationIcon} alt='' />{t('dashboard.puntossuministro.generation')}
                    </>
                  }
                </Typography>
              </Grid>
              <Grid className={classes.row}>
                <Typography className={classes.title}>{t('dashboard.puntossuministro.favorite')}</Typography>
                <Typography className={classes.value}>
                  <div onClick={() => changeFav(supply)}>
                    <ArrowTooltip title={t('dashboard.puntossuministro.favoriteTooltip')} placement='top'>
                      {supply.icon !== undefined && supply.icon.includes('fav') ?
                        <StarIcon htmlColor='#e57200'/>
                        :
                        <StarIcon color='disabled'/>
                      }
                    </ArrowTooltip>
                  </div>
                </Typography>
              </Grid>
              <Grid className={classes.row}>
                <Typography className={classes.title} onClick={() => showSupplyData(supply)}>{t('dashboard.puntossuministro.see')}</Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    :
      <Table className={classes.table2}>
        <TableHead>
          <TableRow>
            <StyledTableCell>{t('dashboard.puntossuministro.name')}</StyledTableCell>
            <StyledTableCell/>
            <StyledTableCell>{t('dashboard.puntossuministro.Cups')}</StyledTableCell>
            <StyledTableCell>{t('dashboard.puntossuministro.address')}</StyledTableCell>
            <StyledTableCell>{t('dashboard.puntossuministro.supplyType')}</StyledTableCell>
            <StyledTableCell>{t('dashboard.puntossuministro.favorite')}</StyledTableCell>
            <StyledTableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          {onlySupplyActives.map((supply, index) => ( /* JAG - 20230109 - ppm_1008179 - Solo mostramos los suministros Activos Contratados */
            <TableRow key={index} className={classes.row}>
              <StyledTableCell className={classes.supplyNameCell}>
                {isModifyingNameIndex === index ?
                  <Input inputProps={{maxLength : 25}} className={classes.supplyName} onBlur={(e) => handleOnBlurSupplyName(e, supply)} autoFocus/>
                :
                  <span className={classes.supplyName} onClick={() => handleOnClickSupplyName(supply.name, index)}>
                    {supply.name ? supply.name : ''}
                  </span>
                }
              </StyledTableCell>
              <StyledTableCell>
                <img className={classes.buttonIcon} src={EditIcon} alt='' />
              </StyledTableCell>
              <StyledTableCell className={classes.cupsCell} onClick={() => showSupplyData(supply)}>
                <span className={classes.cups}>{supply.cups ? supply.cups : ''}</span>
              </StyledTableCell>
              <StyledTableCell className={classes.addressCell}>
                {supply.address &&
                    (supply.address.street ? supply.address.street : '') + ' ' + (supply.address.number ? supply.address.number : '')  + ' ' + (supply.address.town ? supply.address.town : '') + ', ' + ' ' + ', ' + (supply.address.province ? supply.address.province : '') + ' ' + (supply.address.zipCode ? supply.address.zipCode : '')
                  }
              </StyledTableCell>
              <StyledTableCell>
                <Grid container alignItems='center'>
                  <Grid item className={classes.supplyTypeIcon}>
                    {supply.isGenerator === '0' ?
                      <img src={ConsumptionIcon} alt='' />
                    :
                      <img src={GenerationIcon} alt='' />
                    }
                  </Grid>
                  <Grid item className={classes.supplyTypeLabel}>
                    {supply.isGenerator === '0' ?
                      t('dashboard.puntossuministro.consumption')
                    :
                      t('dashboard.puntossuministro.generation')
                    }
                  </Grid>
                </Grid>
              </StyledTableCell>
              <StyledTableCell className={classes.Star}>
                <div className={classes.favorite} onClick={() => changeFav(supply)}>
                  <ArrowTooltip title={t('dashboard.puntossuministro.favoriteTooltip')} placement='top'>
                    {supply.icon !== undefined && supply.icon.includes('fav') ?
                      <StarIcon htmlColor='#e57200'/>
                    :
                      <StarIcon color='disabled'/>
                  }
                  </ArrowTooltip>
                </div>
              </StyledTableCell>
              <StyledTableCell className={classes.buttonCell}>
                <Grid item className={classes.selectPds} onClick={() => showSupplyData(supply)}>
                  {t('dashboard.puntossuministro.see')}
                </Grid>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  )
}

export default ListSupply
