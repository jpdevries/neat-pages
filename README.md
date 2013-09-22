neat-pages
==========

Neatly create a scaffold for your next web project using this grunt-init template. Watch a [quick demo](http://quick.as/7ezi4eq).

Tell Neat-Pages how you like to build your website and it will create a project configured with your chosen includes.  
You can use Sass, Less or plain-CSS editing and choose from includes like Bootstrap, Foundation 4, HTML5 Boilerplate, Bourbon and Neat.

> Create a new project with [grunt-init][].

[grunt-init]: http://gruntjs.com/project-scaffolding

## Installation
If you haven't already done so, install [grunt-init][].

Once grunt-init is installed, place this template in your `~/.grunt-init/` directory. It's recommended that you use git to clone this template into that directory, as follows:

### Linux/Mac Users

```
git clone git@github.com:jpdevries/neat-pages.git ~/.grunt-init/neat-pages
```

### Windows Users

```
git clone git@github.com:jpdevries/neat-pages.git %USERPROFILE%/.grunt-init/neat-pages
```

## Usage

At the command-line, cd into an empty directory, run this command and follow the prompts. 

```
grunt-init neat-pages
```

_Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files._

Install the NPM modules required to actually process your newly-created project by running:

```
cd _build
npm install
```

Optionally enable Growl notifications install [terminal-notifier](https://github.com/alextucker/grunt-growl#getting-started) with RubyGems:
```bash
gem install terminal-notifier
```
_Note: Depending on your Ruby setup you may need to use `sudo gem install terminal-notifier`._

## Grunt Tasks
__Build__  
Run this first to fetch dependencies and pre-process and concanetate JavaScript and CSS.
```bash
grunt build
````

__Watch__  
Pre-process CSS & JavaScript, then watch files for changes.
```bash
grunt
````
