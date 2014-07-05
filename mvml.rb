#!/usr/bin/env ruby
require 'erubis'
require 'logger'
require 'yaml'

class Logger
	def fn(name, *params)
		log_string = "called #{name}"
	  params.each do |param|
			log_string += "\n#{param.class} - #{param}\n"
		end
		puts log_string
		#log.debug log_string
	end
end

def log_fn(name, *params)
		log_string = "called #{name}"
	  params.each do |param|
			log_string += "\n#{param.class} - #{param}\n"
		end
		puts log_string
end

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

  def self.default
    @@default
  end

  def self.to_html(mvml_string, output_path=nil)
		#log.fn 'to_html', mvml, output_path
		log_fn 'to_html', mvml_string, output_path
    #puts "to_html\n#{mvml}\n#{output_path}"
		template = parse YAML.load(mvml_string)
    eruby = Erubis::Eruby.new File.read(@@eruby_path)
    html = eruby.result template
    unless output_path.nil?
      File.open(output_path, 'w') do |file|
        file.write html
      end
    end
    return html
  end

  def self.parse(mvml)
		# TODO: Merge default, blank MVML with given MVML
		#log.fn 'parse', mvml
		log_fn 'parse', mvml
	  #puts "parse\n#{mvml}"

    mvml = {} if mvml.nil? || mvml.empty?
    mvml['scene'] ||= {}
    mvml['player'] ||= {}
    
    template = {}
    template['title'] = mvml['title'] || @@default[:title]
    template['motd'] = mvml['motd'] || @@default[:motd]

    lists = ['primitives', 'meshes', 'lights', 'audio']
    lists.each { |name| template[name] = [] }
    mvml['scene'].each do |object|
      template['primitives'].push(new_primitive(object)) if object.has_key? 'primitive'
      template['meshes'].push(new_mesh(object)) if object.has_key? 'mesh'
      #template['lights'].push(new_light(object)) if object.has_key? 'light'
      #template['audio'].push(new_audio(object)) if object.has_key? 'audio'
    end
    lists.each { |name| template[name].compact! }

    template['player'] = {
      'move_speed' => mvml['player']['move_speed'] || @@default[:move_speed],
      'turn_speed' => mvml['player']['turn_speed'] || @@default[:turn_speed],
      'start' => mvml['player']['start'] || @@default[:start]
    }

    puts template
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
