#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.api import urlfetch

import re
import logging
from django.utils import simplejson

title = "<title>(.+)</title>"
description = "<meta name=(\"|\')description(\"|\') content=\"([^\"\']+)"
favicon = "<link rel=\"(shortcut ){0,1}icon\"([^>]+)"

def parseFavIcon(match):
  logging.info(match)
  linkTag = match.group(0)
  #find the href
  
  hrefMatch = re.search("href=(\'|\")([^\"\']+)", linkTag)
  sizesMatch = re.search("sizes=(\'|\")(\d{0,3})", linkTag)
  
  size = "16"
  
  if sizesMatch:
    size = sizesMatch.group(2)
  
  href = hrefMatch.group(2)
  return (size, href)

class FetchInformationHandler(webapp.RequestHandler):
  def get(self):
    url = self.request.get("url")
    meta = {}
    
    fetcheddata = urlfetch.fetch(url)
    meta["web_url"] = fetcheddata.final_url or url
    meta["urls"] = [meta["web_url"]]
    
    if fetcheddata.status_code == 200:
      # parse the data to get the basic information out.
      html = fetcheddata.content
      
      # get the data
      titleMatch = re.search(title, html, flags=re.IGNORECASE)
      if titleMatch:
        meta["name"] = titleMatch.group(1) # only consider the first title
        
      descriptionMatch = re.search(description, html, flags=re.IGNORECASE)
      if descriptionMatch:
        meta["description"] = descriptionMatch.group(3)
       
      # parse the fav icons 
      meta["icons"] = dict([parseFavIcon(m) 
        for m in re.finditer(favicon, html, flags=re.IGNORECASE)
          if m is not None])
    else:
      self.response.status_code = fetcheddata.status_code

    self.response.headers['Content-Type'] = "application/json"
    self.response.out.write(simplejson.dumps(meta))

def main():
  application = webapp.WSGIApplication([
  ('/api/fetch', FetchInformationHandler)
  ], debug=True)
  util.run_wsgi_app(application)

if __name__ == '__main__':
  main()
