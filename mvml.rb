#!/usr/bin/env ruby
require 'erubis'
require 'yaml'
#require 'mongo'
#client = MongoClient.new
#db = client['3dml']
#spaces = db['spaces']

#users = db['users'], etc

module MVML
  attr_accessor :default, :template_path
  @template_path = 'index.eruby'
  @default = {
    :color => "0xffffff",
    :scale => "1,1,1", # providing an extra param to planes...
    :position => "0,0,0",
    :rotation => "0,0,0"
  }

  def self.to_html(file, output_path=nil)
    template = parse file
    eruby = Erubis::Eruby.new File.read(@template_path)
    html = eruby.result template
    unless output_path.nil?
      File.open(output_path, 'w') do |file|
        file.write html
      end
    end
    return html
  end

  def self.read(file)
    YAML.load_file file
  end

  def self.parse(file)
    mvml = read file
    template = {}
    template['title'] = mvml['title']
    template['objects'] = []
    mvml['scene'].each do |object|
      template['objects'].push(new_model(object)) if object.has_key? 'model'
      template['objects'].push(new_light(object)) if object.has_key? 'light'
      template['objects'].push(new_audio(object)) if object.has_key? 'audio'
    end
    template['objects'].compact!
    return template
  end


  def self.get_render_method(model)
    case model
    when 'box'
      "BoxGeometry"
    when 'plane' 
      "PlaneGeometry"
    else
      # a model
    end
  end

  def self.convert_rotation(rotation)
    return @default[:rotation] if rotation.nil?
    rotation = rotation.split ','
    rotation.map! do |rotation| 
      rotation.to_f * Math::PI / 180.0
    end
    rotation.join ','
  end

  def self.new_model(object)
    {
      :render_call => get_render_method(object['model']),
      :color => object['color'] || @default[:color],
      :scale => object['scale'] || @default[:scale],
      :position => object['position'] || @default[:position],
      :rotation => convert_rotation(object['rotation'])
    }
  end

  def self.new_light(object)
  end

  def self.new_audio(object)
  end
end
