# MVML

The official MVML interpreter. Converts to HTML/WebGL to view 3D spaces in your browser.

## Goal

WebGL finally lets us share 3D worlds with each other but it's still restricted to those with advanced code knowledge. Even the wonderful [three.js](http://threejs.org/) framework requires [considerable boilerplate](http://jsfiddle.net/5hgbu/) to get results. MVML aims to enable your average content-creator to display their browser content in 3D at least as easily as they would in HTML for 2D.

# Getting started

This repo is a server that will convert MVML to HTML/WebGL for you. Just POST to the root with MVML in the body and it'll return the corresponding HTML/WebGL. Check out [mvml-host](http://github.com/JScott/mvml-host) for a server built to interact with this service.

Eventually I'll set up an ansible playbook to set everything up for you. Until then, run it with this:

```
bundle install
sudo ruby server.rb
```

Have your content server POST to this one and enjoy!

## Disclaimer

Right now I'm referencing files in the HTML that are hosted in the mvml-host repo.

<!--```
cd ansible
sudo ansible-playbook -i hosts server.yml
```-->

[![Build Status](https://secure.travis-ci.org/JScott/mvml.png)](http://travis-ci.org/JScott/mvml)
