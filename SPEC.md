# Specification

This keeps track of all the components available. It may not be up-to-date or comprehensive but it provides a great place to start.

---

## Data Types

### string

```
texture: img/space.jpg
title: "Special characters: present"
```

Just your average string. You may need to enclose it in strings to help the YAML parser to understand it.

### float

```
mass: 300
intensity: 0.7
color: 0x202020
```

Numbers of all shapes and sizes. It's worth noting that JavaScript converts hex values to integers, which are often used for colors.

### vector

```
start: (0,0,30)
position: (0, 2.1,-10)
```

Vectors start and end with parenthesis. Whitespace doesn't matter and you must supply 3 floats delimited by commas.

### color

```
color: black
specular: 0xff0000
```

Colors are either a string or an integer in the above formats. This may feel familiar to those who know CSS.

---

## Base Components

### title

*string ~ "MVML Space"*

The title of the HTML page generated.

```
title: Hello metaverse!
```

### player

The rules the players abide by.

* #### move_speed
  
  *float ~ 15.0*

* #### turn_speed

  *float ~ 1.5*
  
  How fast the player can look around.
  
* #### start
  
  *vector ~ (0,0,0)*
  
  The starting position for all players entering your space for the first time.
  
* #### gravity

  *float ~ 50*
  
  The power of gravity dragging the character down. Be sure to set it to 0 if you don't have a ground to fall on yet.

```
player:
  move_speed: 15
  gravity: 30
```
  
### skybox

The defining features of the sky above your space.
  
* #### texture

  *string (url) ~ null*
 
  The path to the texture for all 6 sides of your skybox.
 
* #### color

  *color ~ 0x9999ff*

```
skybox:
  color: 0x000077
  texture: img/checker.png
```

### scene

Populated by scene components which make the meat of your space.
 
These components are the most detailed and take a different format. The next section will go in-depth on using:
* primitive
* mesh
* light
 
```
scene:
- primitive: sphere
- light: ambient
  color: 0x202020
```

---

## Scene Components
 
### primitive

*string ~ box | sphere | plane*

The most basic of building blocks. Create either a box, sphere, or plane to your specifications.

* #### color

  *color ~ 0xffffff*

* #### scale

  *vector ~ (1,1,1)*

* #### position

  *vector ~ (0,0,0)*

* #### rotation

  *vector ~ (0,0,0)*
  
  The rotations around the x, y, and z axes in degrees.

* #### texture

  *string (url) ~ null*

* #### physics

  *boolean ~ true*
  
  Whether or not the object interacts at all with other physics objects.

* #### mass

  *float ~ 0*
  
  How heavy the physics object is. 0 mass is immovable.

* #### shininess

  *float ~ 30*

* #### specular

  *color ~ 0xaaaaaa*

* #### emissive

  *color ~ 0x000000*
  
  The color that this object emits regardless of lighting.

```
scene:
- primitive: box
  position: (0,0,-20)
  specular: yellow
- primitive: plane
  rotation: (-90,0,0)
```

### mesh

*string ~ url to OBJ model*

This has all the same attributes as `primitive` aside from how it is declared with a URL instead of a predefined type.

```
scene:
- mesh: model/invader.obj
  mass: 300
```

### light 

*string ~ point | directional | ambient* 
 
 The light that makes your scene visible. Be sure to include some or else everything will be black.
 
 * #### color

  *color ~ 0x404040*
 
* #### intensity

  *float ~ 1.0*

* #### distance

  *float ~ 10.0*

* #### position

  *vector ~ (0,0,0)*
  
  The position of a point light. The direction of a directional light. Does nothing for ambient.
  
```
scene:
- light: ambient
- light: point
  intensity: 3.0
```