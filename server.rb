require 'sinatra'
require 'sinatra/cross_origin'
require_relative './mvml'

configure do
  set :bind, '0.0.0.0'
  set :port, ARGV[0] || 6865
end

get '/' do
  %Q[
  <h1>MVML to HTML interpreter</h1>
  <p>Post MVML to this URL and I'll compile it into WebGL code for you.</p>
  <p>Go <a href='/spec'>here</a> to see the current specifications</p>
  <p>Check out <a href='https://github.com/JScott/mvml'>github.com/JScott/mvml</a> to view the code.</p>
  ]
end

post '/' do
  cross_origin
  request.body.rewind
  mvml = request.body.read
  # TODO: don't crash on bad data
  # TODO: lint the YAML/MVML
  MVML.to_html mvml
end

get '/api' do
  cross_origin
  send_file "#{settings.root}/public/js/mvml-api.js"  
end

get '/physijs_worker' do
  cross_origin
  send_file "#{settings.root}/public/js/Physijs/worker.js"
end

get '/ammo_worker' do
  cross_origin
  send_file "#{settings.root}/public/js/Physijs/ammo.js"
end

get '/spec' do
  cross_origin    
  send_file "#{settings.root}/spec/data/spec.mvml", :type => 'text/mvml'
end
