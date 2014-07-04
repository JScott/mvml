require 'sinatra'
require 'pp'
require './mvml'

set :public, 'webroot'
set :bind, '0.0.0.0'
set :port, ARGV[0] || 6865

get '/' do
  MVML.to_html 'index.mvml'
end

post '/' do
  request.body.rewind
  # TODO: don't crash on error
  MVML.to_html request.body.read
end

get '/raw' do
  content_type 'text/plain'
  File.read 'index.mvml'
end
