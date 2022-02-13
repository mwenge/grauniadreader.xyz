const sortOrder = [
  'ireland',
  'irish',
  'tanzania',
  'world news',
  'tech',
  'books',
  'film',
  'cinema',
  'sport',
  'obituaries',
];

function makePrevNextArray(a = [], start = 0, step = 1) {
  let nextIndex = start;
  let uniqueEntries = new Map();

  const rangeIterator = {
    next: function() {
      if (nextIndex < a.length - 1) {
        nextIndex += step;
      }
      return a[nextIndex]
    },
    peekNext: function() {
      if (nextIndex < a.length - 1) {
        return a[nextIndex + step]
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
      // Add a category that each item matches, if applicable.
      b = b.map( i => {
        let categories = Array.isArray(i.category) ? i.category : [i.category];
        for (var v of sortOrder) {
            let re = new RegExp(v ,"gi");
            if (categories.some(e => re.test(e))) {
              i.matchedCategory = v;
              break;
            }
        }
        return i;
      });

      // Only add stories in our selected categories
      b = b.filter(i => i.matchedCategory);

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

      // Sort the updated list of news items, with the exception of the 
      // first one, by preferred category order.
      a = a.concat(b);
      let tip = a.shift();
      a.sort((a,b) => {
        let i = sortOrder.indexOf(a.matchedCategory);
        let j = sortOrder.indexOf(b.matchedCategory);
        if (i < j) return -1;
        if (i > j) return 1;
        return 0;
      }); 
      a.unshift(tip);
      console.log(a.map(i=> [i.title, i.matchedCategory]));
    },
    length: function() {
      return a.length;
    },
    categories: function() {
      return Array.from(new Set(a.map(i => i.category).flat()));
    },
  };
  return rangeIterator;
}
export { makePrevNextArray };
