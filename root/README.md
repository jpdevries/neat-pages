# {%= title %}

> {%= description %}

This project was created using the [neat-pages](https://github.com/jpdevries/neat-pages/) boilerplate.
{% if ('none' !== css_type){ %}{% if ('sass' === css_type) { %}[Sass](http://sass-lang.com/) {% } else if ('less' === css_type) { %}[LESS](http://lesscss.org/) {% } %}is used to pre-process CSS.{% } %}
{% if ('yes' === bourbon_neat || 'use_bourbon' === bourbon_neat || 'none' !== icon_set || 'none' !== boilerplate){ %}
### Includes:

 - {% if ('html5-boilerplate' === boilerplate){ %}[HTML5 Boilerplate](http://html5boilerplate.com/){% } else if ('foundation' === boilerplate){ %}[Foundation 4](http://foundation.zurb.com/){% } else if ('bootstrap' === boilerplate){ %}[Bootstrap](http://getbootstrap.com/){% } %}
 - {% if ('yes' === use_bourbon){ %}[Bourbon](http://bourbon.io/){% } %}
 - {% if ('yes' === bourbon_neat){ %}[Neat](http://neat.bourbon.io/){% } %}
 - {% if ('font-awesome' === icon_set){ %}[Font-Awesome](http://fortawesome.github.io/Font-Awesome/){% } %}
{% } %}