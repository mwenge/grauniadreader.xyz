function makePrevNextArray(a = [], start = 0, step = 1) {
  let nextIndex = start;
  let uniqueEntries = new Map();

  const rangeIterator = {
    next: function() {
      if (nextIndex < a.length) {
        nextIndex += step;
      }
      return a[nextIndex]
    },
    previous: function() {
      if (nextIndex == start)
        return a[nextIndex]
      if (nextIndex > start) {
        nextIndex -= step;
      }
      return a[nextIndex]
    },
    current: function() {
      return a[nextIndex]
    },
    add: function(b) {
      // Only add stories we don't already have.
      b = b.filter(i => !uniqueEntries.has(i.title));
      b.forEach(i => uniqueEntries.set(i.title, 1));
      a = a.concat(b);
    },
    length: function() {
      return a.length;
    },
  };
  return rangeIterator;
}

document.body.addEventListener('touchstart', function (event) {
  touchstartX = event.changedTouches[0].screenX;
  touchstartY = event.changedTouches[0].screenY;
}, false);

document.body.addEventListener('touchend', function (event) {
  touchendX = event.changedTouches[0].screenX;
  touchendY = event.changedTouches[0].screenY;
  handleGesture();
}, false);


function handleGesture() {
  if (touchendX < touchstartX) {
    displayItem(newsItems.next());
    console.log('Swiped Left');
    return;
  }

  if (touchendX > touchstartX) {
    displayItem(newsItems.previous());
    console.log('Swiped Right');
    return;
  }

  if (touchendY < touchstartY) {
    console.log('Swiped Up');
  }

  if (touchendY > touchstartY) {
    console.log('Swiped Down');
  }

  if (touchendY === touchstartY) {
    openItem(newsItems.current());
    console.log('Tap');
  }
}
let newsItems = makePrevNextArray();
const fetchWorker = new Worker("fetch.js");
fetchWorker.postMessage("1");

hotkeys('left,right,enter', function (event, handler){
  switch (handler.key) {
    case 'left':
      displayItem(newsItems.previous());
      break;
    case 'right':
      displayItem(newsItems.next());
      break;
    case 'enter':
      openItem(newsItems.current());
      break;
    default:
      displayItem(newsItems.next());
      break;
  }
});

function displayItem(item) {
  function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  if (!item) {
    return;
  }
  let display = [
    {el: headline, it: item.title},
    {el: text, it: htmlDecode(item.description)},
    {el: byline, it: item['dc:creator']},
    {el: dateline, it: item.pubDate},
  ];
  display.forEach(d => {
    d.el.innerHTML = d.it;
  });
  photo.src = htmlDecode(item['media:content'][1]._attributes.url);
}

function openItem(item) {
  window.open(item.link, '_blank').focus()
}

fetchWorker.onmessage = (event) => {
  const items = event.data;
  let firstItem = newsItems.length() === 0;
  newsItems.add(items.newsItems.item);
  if (firstItem) {
    displayItem(newsItems.current());
  }
};

