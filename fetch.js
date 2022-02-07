importScripts('3rdparty/tXml.min.js');

  const prefix = 'feeds/'
  const topics = [
'world',
'uk',
'science',
'global-development',
'tech',
'business',
'obituaries',
'opinion',
'cartoons',
'letters',
'football',
'cricket',
'sport/tennis',
'cycling',
'sport/rugby-union',
'sport/formulaone',
'sport/golf',
'artanddesign',
'books',
'music',
'tv-and-radio',
'film',
'classical',
'stage',
'fashion',
'food',
'lifeandstyle/love-and-sex',
'travel',
'money',
'pictures',
'crosswords',
];

let getItems = function(node) {return node.tagName.toLowerCase() === 'item'};

function getTopicsUntilDone() {
  if (!topics.length) {
    return;
  }
  let topic = topics.shift();
  fetch(prefix + encodeURI(topic.replace(/\//,'')) + '.xml')
    .then(response => response.text())
    .then(str => {
      let newsItems = txml.parse(str, { noChildNodes: [], simplify: true, filter: getItems});
      self.postMessage({ newsItems });
      getTopicsUntilDone();
    });
}
getTopicsUntilDone();
