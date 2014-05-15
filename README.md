# MVML

Home of the MetaVerse Markup Language.

WebGL finally lets us share 3D worlds with each other. However, it's still restricted to those with advanced code knowledge. Even the wonderful [three.js](http://threejs.org/) framework requires [considerable boilerplate](http://jsfiddle.net/5hgbu/) to get results. MVML aims to make it as easy to display your content in 3D as it is for HTML in 2D.

We have applications like Active Worlds, Second Life, and Facebook's new MMO but this remains relevant. This is not a proprietary application which means you can run it on your own servers. You are truly the master of your own domain, creating the space and the rules.

For those with the resources, you will also be able to modify behavior through server-side code. That means you can have plugins to enable social chat, game mechanics, transactions, and more.

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
