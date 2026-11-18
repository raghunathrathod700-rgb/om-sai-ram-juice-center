import { useEffect } from 'react';

/** Per-page <title> + meta description (no extra library needed). */
const PageMeta = ({ title, description }) => {
  useEffect(() => {
    const previousTitle = document.title;
    const tag = document.querySelector('meta[name="description"]');
    const previousDescription = tag ? tag.getAttribute('content') : '';

    if (title) document.title = `${title} | Om Sai Ram Juice Center`;
    if (description && tag) tag.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      if (tag) tag.setAttribute('content', previousDescription);
    };
  }, [title, description]);

  return null;
};

export default PageMeta;
