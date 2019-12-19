'use strict';

const { parse, URL } = require('url');
const encodeURL = require('./encode_url');
const relative_url = require('./relative_url');
const prettyUrls = require('./pretty_urls');

/**
 * Usage:
 *     const config = {root: '/blog/'};
 *     const urlFor = require('hexo-util').url_for(config);
 *     urlFor('/a/path')
 *     // /blog/a/path
 */
function urlForHelper(input) {
  // For legacy support. Remove this on the next major release.
  if (this && typeof this.config === 'object') {
    const func = urlForHelper(this.config);
    return func.call(this, input, arguments[1]);
  }

  // If `input` is a Hexo instance, use `hexo.config`
  const config = typeof input.config === 'object' ? input.config : input;
  const { root, url, pretty_urls, relative_link } = config;
  if (!url) {
    throw new TypeError('Invalid url: ' + url);
  }
  const sitehost = parse(url).hostname;
  if (!sitehost) {
    throw new TypeError('Invalid url: ' + url);
  }
  const prettyUrlsOptions = Object.assign({
    trailing_index: true,
    trailing_html: true
  }, pretty_urls);
  const pathRegex = /^(#|\/\/|http(s)?:)/;
  return function(path = '/', options) {
    if (pathRegex.test(path)) return path;

    const data = new URL(path, `http://${sitehost}`);

    // Exit if input is an external link or a data url
    if (data.hostname !== sitehost || data.origin === 'null') return path;

    options = Object.assign({
      relative: relative_link
    }, options);

    // Resolve relative url
    if (options.relative) {
      return relative_url(this.path, path);
    }

    // Prepend root path
    path = encodeURL((root + path).replace(/\/{2,}/g, '/'));

    path = prettyUrls(path, prettyUrlsOptions);

    return path;
  };
}

module.exports = urlForHelper;
