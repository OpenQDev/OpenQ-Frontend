import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
const GithubHtmlRenderer = ({ html, className }) => {
  const [purified, setPurified] = useState('');
  useEffect(() => {
    setPurified(DOMPurify.sanitize(html));
  }, [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: purified }} />;
};
export default GithubHtmlRenderer;
