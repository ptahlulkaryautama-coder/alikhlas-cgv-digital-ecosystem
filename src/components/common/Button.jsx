const variants = {
  primary: 'button button-primary',
  gold: 'button button-gold',
  light: 'button button-light',
  outline: 'button button-outline',
  glass: 'button button-glass',
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
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
