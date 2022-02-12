#!/usr/bin/env python3
import requests
import itertools
import os

output_dir = 'feeds'
try: 
    os.makedirs(output_dir)
except:
    print("'Feeds' folder already exists")

prefix = "https://www.theguardian.com/"
topics = [
'world',
'uk',
'tech',
'science',
'artanddesign',
'books',
'music',
'tv-and-radio',
'film',
'classical',
'stage',
'opinion',
'football',
'cricket',
'sport/tennis',
'cycling',
'sport/rugby-union',
'sport/formulaone',
'sport/golf',
'obituaries',
'business',
'cartoons',
'letters',
'fashion',
'food',
'lifeandstyle/love-and-sex',
'travel',
'money',
'global-development',
'pictures',
'crosswords',
]
#just a random link of a dummy file

# Change the working directory to the locaiton of the script
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

urls = [ (''.join(l), l[1]) for l in zip(itertools.repeat(prefix), topics, itertools.repeat("/rss"))]

for url, prefix in urls:
    r = requests.get(url)

    with open(output_dir + os.sep + prefix.replace('/','') + '.xml', 'wb') as f:
        f.write(r.content) 
