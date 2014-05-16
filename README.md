# MVML

Welcome to the home of the MetaVerse Markup Language.

## Goal

WebGL finally lets us share 3D worlds with each other but it's still restricted to those with advanced code knowledge. Even the wonderful [three.js](http://threejs.org/) framework requires [considerable boilerplate](http://jsfiddle.net/5hgbu/) to get results. MVML aims to enable your average content-creator to display their content in 3D at least as easily as they would in HTML for 2D.

## What about...

###Second Life or Facebook's MMO?

Those applications require a specialized browser and proprietary server software. MVML could utilize a proprietary browser but it converts to HTML with the help of WebGL and is as open and free as HTML servers are. As long as you have an Internet server then you can serve an MVML space where you determine the layout and rules for your audience. **A true Metaverse needs to be distributed and free.**

For those with the resources, you will also be able to modify behavior through server-side code. That means you can activate or create plugins to enable social chat, game mechanics, transactions, and more. The sky is the limit when the power is in your hands.

### VR Headsets?

I have an Oculus Rift DK2 pre-ordered. I plan to integrate that when I'm able. After all, what's a Metaverse without presence?

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
