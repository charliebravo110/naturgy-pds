export default interface ButtonConfig {
  color?: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
  disableFocusRipple?: boolean | undefined;
  name?: string;
  fullWidth?: boolean | undefined;
  href?: string | undefined;
  size?: 'small' | 'medium' | 'large' | undefined;
  disabled?: boolean | undefined;
  variant: 'text' | 'outlined' | 'contained' | undefined
  className?: string | undefined;
  text?: any | undefined;
  onClick?: any;
  startIcon?: any;
  id?: any;
  style?:any;
  img?: any
}
