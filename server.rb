require 'sinatra'
require 'pp'
require './mvml'
require 'yaml'

set :public, 'webroot'
set :bind, '0.0.0.0'
set :port, ARGV[0] || 6865

get '/' do
  MVML.to_html YAML.load_file('index.mvml')
end

post '/' do
  request.body.rewind
  mvml = request.body.read
  # TODO: don't crash on bad data
  # TODO: lint the YAML/MVML
  MVML.to_html YAML.load(mvml)
end

get '/raw' do
  content_type 'text/plain'
  File.read 'index.mvml'
end
