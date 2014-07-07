#!/usr/bin/env ruby
require 'erubis'
require 'yaml'
require 'logger'

log = Logger.new $stdout
log.level = Logger::DEBUG
log.progname = 'MVML'

module MVML
  @@eruby_path = 'index.eruby'
  @@default = {
    :title => "MVML space",
    :motd => "",

    :move_speed => 15,
    :turn_speed => 1.5,
    :start => "(0,0,0)",

    :color => 0xffffff,
    :scale => "(1,1,1)",
    :position => "(0,0,0)",
    :rotation => "(0,0,0)",
    :texture => nil
  }
	@@object_types = [
		{name: 'primitive', plural_name: 'primitives'},
		{name: 'mesh', plural_name: 'meshes'},
		{name: 'light', plural_name: 'lights'},
		{name: 'audio', plural_name: 'audio'}
	]

  def self.default
    @@default
  end

  def self.to_html(mvml_string, output_path=nil)
		template = parse mvml_string
		eruby = Erubis::Eruby.new File.read(@@eruby_path)
    html = eruby.result template
    unless output_path.nil?
      File.open(output_path, 'w') do |file|
        file.write html
      end
    end
    return html
  end

  def self.parse(mvml_string)
		mvml = YAML.load mvml_string
		template = {}
		unless mvml.nil?
			template = base_template mvml
      template.merge! player_template(mvml['player'] || {})
			template.merge! scene_template(mvml['scene'] || {})
		end
		return template
  end

	def self.base_template(mvml)
    {
			'title' => mvml['title'] || @@default[:title],
			'motd' => mvml['motd'] || @@default[:motd]
		}
	end

  def self.player_template(player)
    {
      'player' => {
        'move_speed' => @@default[:move_speed],
        'turn_speed' => @@default[:turn_speed],
        'start' => @@default[:start]
      }
    }.merge player
  end

  def self.scene_template(scene)
    template = {}
    @@object_types.each do |type|
      template[type[:plural_name]] = new_scene_objects scene, type[:name]
    end
    return template
  end

  def self.new_scene_objects(scene, type)
    list.select! { |object| object.has_key? type }
    list.collect { |object| self.send "new_#{type}", object }
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
