#!/usr/bin/env python3
import requests
import itertools
import os

output_dir = 'feeds'
prefix = "https://www.theguardian.com/"
topics = [
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
]
#just a random link of a dummy file

urls = [ (''.join(l), l[1]) for l in zip(itertools.repeat(prefix), topics, itertools.repeat("/rss"))]

for url, prefix in urls:
    r = requests.get(url)

    with open(output_dir + os.sep + prefix.replace('/','') + '.xml', 'wb') as f:
        f.write(r.content) 
