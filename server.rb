require 'sinatra'
require './mvml'

set :public, 'webroot'
set :bind, '0.0.0.0'
set :port, 80

get '/' do
  MVML.to_html 'index.mvml'
end
