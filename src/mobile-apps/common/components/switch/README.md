This switch component was created because the customized one in `src/common/components/switch` is not compatible with the design received for the mobile apps development.

Differences:
The one in `src/common/components/switch` is inside a grid and has 'Yes' and 'No' labels:
```

  return (
    <Grid container alignItems='center' className={classes.container}>
      <Typography>{t('common.buttons.yes')}</Typography>
      <CustomSwitch {...props} />
      <Typography>{t('common.buttons.no')}</Typography>
    </Grid>
  )
  ```


This one (`src/mobile-apps/common/components/switch`) is just the switch:
```
 return <CustomSwitch {...props} />
```

Also the visual design of the switch itself (in the `src/common/components/switch` component) does not match the design received via figma for the mobile apps development (it is not round, so it has been adjusted).