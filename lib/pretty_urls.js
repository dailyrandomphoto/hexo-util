'use strict';

function prettyUrls(url, options = {}) {
  const indexPattern = /index\.html$/;
  if (options.trailing_index === false) url = url.replace(indexPattern, '');
  if (options.trailing_html === false && !indexPattern.test(url)) {
    url = url.replace(/\.html$/, '');
  }

  return url;
}

module.exports = prettyUrls;
