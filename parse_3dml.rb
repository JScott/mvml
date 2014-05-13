#!/usr/bin/env ruby
require 'mongo'
client = MongoClient.new
db = client['3dml']
spaces = db['spaces']
#users = db['users'], etc


