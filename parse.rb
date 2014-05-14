#!/usr/bin/env ruby
require 'erubis'
require 'yaml'
#require 'mongo'
#client = MongoClient.new
#db = client['3dml']
#spaces = db['spaces']

#users = db['users'], etc

mvml = YAML.load_file 'index.mvml'

eruby = Erubis::Eruby.new File.read('index.eruby')

template_vars = {}
template_vars['title'] = mvml['title']
template_vars['objects'] = {}
# + audio, lights

puts eruby.result(template_vars)