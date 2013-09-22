# grunt-modx-manager-theme

> Create a MODX theme with [grunt-init][].

[grunt-init]: http://gruntjs.com/project-scaffolding

## Installation
If you haven't already done so, install [grunt-init][].

Once grunt-init is installed, place this template in your `~/.grunt-init/` directory. It's recommended that you use git to clone this template into that directory, as follows:

### Linux/Mac Users

```
git clone git@github.com:jpdevries/grunt-modx-manager-theme.git ~/.grunt-init/modx-manager-theme
```

### Windows Users

```
git clone git@github.com:jpdevries/grunt-modx-manager-theme.git %USERPROFILE%/.grunt-init/modx-manager-theme
```

## Usage

At the command-line, cd into an empty directory, run this command and follow the prompts.

```
grunt-init modx-manager-theme
```

_Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files._

Install the NPM modules required to actually process your newly-created project by running:

```
npm install
```

## Scaffold

After running the init command above, you will be presented with a standard directory structure similar to:

		/theme
		.. .gitignore
		.. /assets
		.. .. /css
		.. .. .. /src
		.. .. .. /sass
		.. .. .. /less
		.. .. /js
		.. .. .. /src
		.. bower.json
		.. browser
		.. .. index.tpl
		.. context
		.. .. list.tpl
		.. .. update.tpl
		.. .. view.tpl
		.. dashboard
		.. .. block.ptl
		.. .. onlineusers.row.tpl
		.. .. onlineusers.tpl
		.. .. recentlyeditedresources.tpl
		.. .. rssitem.tpl
		.. Gruntfile.js
		.. humans.txt
		.. element
		.. .. chunk
		.. .. .. create.tpl
		.. .. .. update.tpl
		.. .. plugin
		.. .. .. create.tpl
		.. .. .. update.tpl
		.. .. propertyset
		.. .. .. index.ptl
		.. .. snippet
		.. .. .. create.ptl
		.. .. .. update.tpl
		.. .. template
		.. .. .. create.ptl
		.. .. .. update.tpl
		.. .. tv
		.. .. .. create.tpl
		.. .. .. renders
		.. .. .. .. input
		.. .. .. .. .. autotag.tpl
		.. .. .. .. .. checkbox.tpl
		.. .. .. .. .. date.tpl
		.. .. .. .. .. email.tpl
		.. .. .. .. .. file.tpl
		.. .. .. .. .. hidden.tpl
		.. .. .. .. .. image.tpl
		.. .. .. .. .. listbox-multiple.tpl
		.. .. .. .. .. listbox-single.tpl
		.. .. .. .. .. number.tpl
		.. .. .. .. .. radio.tpl
		.. .. .. .. .. resourcelist.tpl
		.. .. .. .. .. richtext.tpl
		.. .. .. .. .. tag.tpl
		.. .. .. .. .. textarea.tpl
		.. .. .. .. .. textbox.tpl
		.. .. .. .. .. url.tpl
		.. .. .. .. inputproperties
		.. .. .. .. .. autotag.tpl
		.. .. .. .. .. checkbox.tpl
		.. .. .. .. .. date.tpl
		.. .. .. .. .. default.tpl
		.. .. .. .. .. email.tpl
		.. .. .. .. .. file.tpl
		.. .. .. .. .. image.tpl
		.. .. .. .. .. listbox-multiple.tpl
		.. .. .. .. .. listbox.tpl
		.. .. .. .. .. number.tpl
		.. .. .. .. .. radio.tpl
		.. .. .. .. .. resourcelist.tpl
		.. .. .. .. .. tag.tpl
		.. .. .. .. .. text.tpl
		.. .. .. .. .. textarea.tpl
		.. .. .. .. .. url.tpl
		.. .. .. .. properties
		.. .. .. .. .. date.tpl
		.. .. .. .. .. default.tpl
		.. .. .. .. .. delim.tpl
		.. .. .. .. .. htmltag.tpl
		.. .. .. .. .. image.tpl
		.. .. .. .. .. richtext.tpl
		.. .. .. .. .. string.tpl
		.. .. .. .. .. url.tpl
		.. .. .. update.tpl
		.. /images
		.. .. /src
		.. /includes
		.. /languages
		.. .. theme.pot
		.. resource
		.. screenshot.png
		.. search
		.. security
		.. source
		.. system
		.. welcome.tpl
		.. workspaces


### CSS vs Sass vs LESS

Depending on how you answer the prompt regarding the use of a preprocessor, you will either have a `/src` directory (CSS), a `/sass` directory (Sass), or a `/less` directory (LESS) under your normal `/css` directory.  The goal here is that you only ever edit files in the related source directory and Grunt will automatically build and minify your final stylesheets directly in `/css`.

If you're using Sass or Less, the raw files will be processed into `/css/filename.css` and minified into `/css/filename.min.css`.

If you're using vanilla CSS, the source files will be minified into `/css/filename.min.css`.

### JavaScript

You should only ever be modifying script files in the `/js/src` directory.  Grunt will automatically concatenate and minify your scripts into `/js/filename.js` and `/js/filename.min.js`.  These generated files should never be modified directly.

### Images

The `/img/src` directory exists only to allow you to keep track of source files (like PSDs or separate images that have been merged into sprites).
