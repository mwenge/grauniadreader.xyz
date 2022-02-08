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
      // Only add stories from the last 24 hrs
      b = b.filter(i => {
        let d = new Date(i["dc:date"]).getTime();
        let n = new Date().getTime();
        // This is the number of ms in 24hrs.
        return (n - d < 86362145);
      });

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
  
  // Calculate the angle of the swipe.
  let [A1x, A1y, A2x, A2y] = [touchstartX, touchstartY, touchendX, touchstartY];
  let [B1x, B1y, B2x, B2y] = [touchstartX, touchstartY, touchendX, touchendY];

  var dAx = A2x - A1x;
  var dAy = A2y - A1y;
  var dBx = B2x - B1x;
  var dBy = B2y - B1y;

  var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
  if (angle < 0) {angle = angle * -1;}
  var degree_angle = angle * (180 / Math.PI);

  console.log(touchstartX, touchendX, touchstartY, touchendY);
  console.log(degree_angle);

  //Only very narrow swipe angles qualify as a left or right swipe.
  if (degree_angle > 20) {
    return;
  }

  let distanceX = Math.abs(touchendX - touchstartX);
  let distanceY = Math.abs(touchendY - touchstartY);
  if (distanceY > distanceX) return;

  if (touchendX < touchstartX) {
    displayItem(newsItems.next());
    return;
  }

  if (touchendX > touchstartX) {
    displayItem(newsItems.previous());
    return;
  }

  if (touchendY === touchstartY) {
    openItem(newsItems.current());
  }
}
let newsItems = makePrevNextArray();
const fetchWorker = new Worker("fetch.js");

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
  window.scrollTo(0,0);
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

