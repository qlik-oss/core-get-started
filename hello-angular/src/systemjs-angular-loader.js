const templateUrlRegex = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*)/gm;
const stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
const stringRegex = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

module.exports.translate = function (load) {
  const url = document.createElement('a');
  url.href = load.address;

  const basePathParts = url.pathname.split('/');

  basePathParts.pop();
  let basePath = basePathParts.join('/');

  let baseHref = document.createElement('a');
  baseHref.href = this.baseURL;
  baseHref = baseHref.pathname;

  basePath = basePath.replace(baseHref, '');

  load.source = load.source
    .replace(templateUrlRegex, (match, quote, url) => {
      let resolvedUrl = url;

      if (url.startsWith('.')) {
        resolvedUrl = basePath + url.substr(1);
      }

      return `templateUrl: "${resolvedUrl}"`;
    })
    .replace(stylesRegex, (match, relativeUrls) => {
      const urls = [];

      while ((match = stringRegex.exec(relativeUrls)) !== null) {
        if (match[2].startsWith('.')) {
          urls.push(`"${basePath}${match[2].substr(1)}"`);
        } else {
          urls.push(`"${match[2]}"`);
        }
      }

      return `styleUrls: [${urls.join(', ')}]`;
    });

  return load;
};
