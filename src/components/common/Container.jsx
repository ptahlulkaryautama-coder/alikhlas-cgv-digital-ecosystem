export default function Container({ as: Tag = 'div', className = '', size = 'lg', ...props }) {
  const sizeClass = size === 'xl' ? 'container-xl' : 'container';
  return <Tag className={`${sizeClass} ${className}`.trim()} {...props} />;
}
