require 'sinatra'
require './mvml'

set :bind, '0.0.0.0'
set :port, ARGV[0] || 6865

get '/' do
  %Q[
	<h1>MVML to HTML interpreter</h1>
	<p>Post MVML to this URL and I'll compile it into WebGL code for you.</p>
	<p>Check out <a href='https://github.com/JScott/mvml'>github.com/JScott/mvml</a> to view the code.</p>
	]
end

post '/' do
  request.body.rewind
  mvml = request.body.read
  # TODO: don't crash on bad data
  # TODO: lint the YAML/MVML
  MVML.to_html mvml
end
