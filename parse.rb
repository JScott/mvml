#!/usr/bin/env ruby
require 'erubis'
require 'yaml'
#require 'mongo'
#client = MongoClient.new
#db = client['3dml']
#spaces = db['spaces']

#users = db['users'], etc

default = {
  :color => "0xffffff",
  :scale => "1,1,1", # providing an extra param to planes...
  :position => "0,0,0",
  :rotation => "0,0,0"
}

mvml = YAML.load_file 'index.mvml'

eruby = Erubis::Eruby.new File.read('index.eruby')

template_vars = {}
template_vars['title'] = mvml['title']
template_vars['objects'] = []
mvml['scene'].each do |object|
  if object.has_key? 'model'
    render_call = case object['model']
    when 'box'
      "BoxGeometry"
    when 'plane' 
      "PlaneGeometry"
    else
      # a model
    end

    rotation = default[:rotation]
    if object.has_key? 'rotation'
      rotation = object['rotation'].split ','
      rotation.map! do |rotation| 
        rotation.to_f * Math::PI / 180
      end
      rotation = rotation.join ','
    end
    puts rotation
    
    template_vars['objects'].push({
      :render_call => render_call,
      :color => object['color'] || default[:color],
      :scale => object['scale'] || default[:scale],
      :position => object['position'] || default[:position],
      :rotation => rotation
    })
  end
  if object.has_key? 'light'
  end
  if object.has_key? 'audio'
  end
end
# + audio, lights

#puts eruby.result(template_vars)
puts mvml
File.open('index.html', 'w') { |file|
  file.write eruby.result(template_vars)
}