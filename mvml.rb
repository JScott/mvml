#!/usr/bin/env ruby
require 'erubis'
require 'yaml'
require 'logger'

CONFIG = YAML.load_file 'config.yaml'

log = Logger.new $stdout
log.level = Logger::DEBUG
log.progname = 'MVML'

module MVML
  @@eruby_path = File.expand_path '../index.eruby', __FILE__
  @@default = {
    :title => "MVML space",
    :motd => "",

    :move_speed => 15,
    :turn_speed => 1.5,
    :min_jump_speed => 10,
    :max_jump_speed => 30,
    :start => "(0,0,0)",
		:gravity => 50,

    :color => 0xffffff,
    :scale => "(1,1,1)",
    :position => "(0,0,0)",
    :rotation => "(0,0,0)",
    :texture => nil,
    :physics => true,
    :mass => 1
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
		template['content_server'] = CONFIG['content_server']
    puts @@eruby_path
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
        'min_jump_speed' => @@default[:min_jump_speed],
        'max_jump_speed' => @@default[:max_jump_speed],
        'start' => @@default[:start],
				'gravity' => @@default[:gravity]
      }.merge(player)
    }
  end

  def self.scene_template(scene)
    template = {}
    @@object_types.each do |type|
      template[type[:plural_name]] = new_scene_objects scene, type[:name]
    end
    return template
  end

  def self.new_scene_objects(scene, type)
    objects = scene.select { |object| object.has_key? type }
    objects.collect { |object| self.send "new_#{type}", object }
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

  def self.get_bounding_method(model)
    case model
    when 'box'
      "BoxMesh"
    when 'sphere'
      "SphereMesh"
    when 'plane'
      "BoxMesh" # PlaneMesh is infinite
    else
      "BoxMesh"
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
    object['rotation'] = convert_rotation object['rotation'] unless object['rotation'].nil?
    object['color'] = "\'#{object['color']}\'" if object['color'].class == String
    {
      'color' => @@default[:color],
      'scale' => @@default[:scale],
      'position' => @@default[:position],
      'rotation' => @@default[:rotation],
      'texture' => @@default[:texture],
      'physics' => @@default[:physics],
      'mass' => @@default[:mass]
    }.merge object
  end

  def self.new_mesh(object)
    {
      'path' => object['mesh']
    }.merge new_model(object)
  end

  def self.new_primitive(object)
    {
      'render_call' => get_render_method(object['primitive']),
      'bounding' => get_bounding_method(object['primitive'])
    }.merge new_model(object)
  end

  def self.new_light(object)
  end

  def self.new_audio(object)
  end
end
