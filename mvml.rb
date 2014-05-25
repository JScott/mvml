#!/usr/bin/env ruby
require 'erubis'
require 'yaml'

module MVML
  @@eruby_path = 'index.eruby'
  @@default = {
    :color => 0xffffff,
    :scale => "(1,1,1)",
    :position => "(0,0,0)",
    :rotation => "(0,0,0)",
    :texture => nil
  }

  def self.default
    @@default
  end

  def self.to_html(file, output_path=nil)
    template = parse file
    eruby = Erubis::Eruby.new File.read(@@eruby_path)
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
    lists = ['primitives', 'meshes', 'lights', 'audio']
    lists.each { |name| template[name] = [] }
    mvml['scene'].each do |object|
      template['primitives'].push(new_primitive(object)) if object.has_key? 'primitive'
      template['meshes'].push(new_mesh(object)) if object.has_key? 'mesh'
      #template['lights'].push(new_light(object)) if object.has_key? 'light'
      #template['audio'].push(new_audio(object)) if object.has_key? 'audio'
    end
    lists.each { |name| template[name].compact! }
    return template
  end


  def self.get_render_method(model)
    case model
    when 'box'
      "BoxGeometry(1,1,1)"
    when 'sphere'
      "SphereGeometry(1)"
    when 'plane'
      "PlaneGeometry(1,1)"
    else
      "BoxGeometry(1,1,1)"
    end
  end

  def self.convert_rotation(rotation)
    rotation = rotation.slice(1...-1).gsub(' ', '').split ','
    rotation.map! do |rotation| 
      rotation.to_f * Math::PI / 180.0
    end
    "(#{ rotation.join ',' })"
  end

  def self.new_model(object)
    rotation = @@default[:rotation]
    rotation = convert_rotation object['rotation'] unless object['rotation'].nil?
    color = object['color']
    color = "\'#{color}\'" if color.class == String
    {
      :color => color || @@default[:color],
      :scale => object['scale'] || @@default[:scale],
      :position => object['position'] || @@default[:position],
      :rotation => rotation,
      :texture => object['texture'] || @@default[:texture]
    }
  end

  def self.new_mesh(object)
    {
      :path => object['mesh']
    }.merge new_model(object)
  end

  def self.new_primitive(object)
    {
      :render_call => get_render_method(object['primitive']) 
    }.merge new_model(object)
  end

  def self.new_light(object)
  end

  def self.new_audio(object)
  end
end
