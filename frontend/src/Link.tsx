const Link = ({ url, text }) => (
  <a
    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
    href={url}
    target="_blank"
    rel="noreferrer"
  >
    {text}
  </a>
);
export default Link;
