'use strict';

const { parse, URL } = require('url');
const encodeURL = require('./encode_url');
const prettyUrls = require('./pretty_urls');

/**
 * Usage:
 *     const fullUrlFor = require('hexo-util').full_url_for(config);
 *     fullUrlFor('/a/path')
 *     // https://example.com/blog/a/path
 */
function fullUrlForHelper(input) {
  // For legacy support. Remove this on the next major release.
  if (this && typeof this.config === 'object') {
    const func = fullUrlForHelper(this.config);
    return func(input);
  }

  // If `input` is a Hexo instance, use `hexo.config`
  const config = typeof input.config === 'object' ? input.config : input;
  const { url, pretty_urls } = config;
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
  const pathRegex = /^(\/\/|http(s)?:)/;

  return (path = '/') => {
    if (pathRegex.test(path)) return path;

    const data = new URL(path, `http://${sitehost}`);

    // Exit if input is an external link or a data url
    if (data.hostname !== sitehost || data.origin === 'null') return path;

    path = encodeURL(url + `/${path}`.replace(/\/{2,}/g, '/'));

    path = prettyUrls(path, prettyUrlsOptions);

    return path;
  };
}

module.exports = fullUrlForHelper;
