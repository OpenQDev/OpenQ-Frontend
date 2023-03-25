import React from 'react';
import DOMPurify from 'dompurify';
const GithubHtmlRenderer = ({ html, className }) => {
  const purified = DOMPurify.sanitize(html);
  return <div className={className} dangerouslySetInnerHTML={{ __html: purified }} />;
};
export default GithubHtmlRenderer;
