# MVML

Welcome to the home of the MetaVerse Markup Language.

## Goal

WebGL finally lets us share 3D worlds with each other but it's still restricted to those with advanced code knowledge. Even the wonderful [three.js](http://threejs.org/) framework requires [considerable boilerplate](http://jsfiddle.net/5hgbu/) to get results. MVML aims to enable your average content-creator to display their browser content in 3D at least as easily as they would in HTML for 2D.

# Getting started

I'll be working on the Ansible playbook later to hook everything up for you once it gets complicated. Until then:

```
bundle install
sudo ruby server.rb
```

Visit yourdomain.com to see index.mvml. Visit yourdomain.com/raw to see index.mvml displayed in plain text.

<!--```
cd ansible
sudo ansible-playbook -i hosts server.yml
```-->

[![Build Status](https://secure.travis-ci.org/JScott/mvml.png)](http://travis-ci.org/JScott/mvml)
