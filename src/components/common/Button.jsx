import { Link } from 'react-router-dom';

const variants = {
  primary: 'button button-primary',
  gold: 'button button-gold',
  light: 'button button-light',
  outline: 'button button-outline',
  'outline-light': 'button button-outline-light',
  outlineLight: 'button button-outline-light',
  glass: 'button button-outline-light',
};


export default function Button({
  children,
  className = '',
  href,
  variant = 'primary',
  ...props
}) {
  const classes = `${variants[variant] || variants.primary} ${className}`.trim();

  if (href) {
    if (href.startsWith('http')) {
      return (
        <a className={classes} href={href} {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} to={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
