test'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var _s = require('underscore.string');
var pathNames;

var NeatPagesGenerator = module.exports = function NeatPagesGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  /*this.on('end', function () {
    this.installDependencies({
	  skipInstall: options['skip-install'],
	  callback: function() {
		this.emit('dependenciesInstalled');
	  }.bind(this)
    });
  });*/

  this.on('dependenciesInstalled', function() {
      this.spawnCommand('grunt', ['build']);
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
  pathNames = this.destinationRoot().split(path.sep);
};

util.inherits(NeatPagesGenerator, yeoman.generators.Base);

NeatPagesGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
  {
	name : 'name',
	message : 'What would you like to name your template?',
	default : function(props) {
      return pathNames[pathNames.length-1];
	}
  },
  {
    name : 'description',
	message : 'How would you describe this lovely thing you are about to build?',
    default : 'Some super neat pages!'
  },
  {
	type : 'list',
    name : 'cssType',
    message : 'Choose a CSS pre-prepocessor',
    choices : ['Sass','LESS','None'],
    default: 'Sass'
  },
  {
	type:'confirm',
    name : 'sassBourbon',
	message : 'Since you chose Sass, how about a little Bourbon with that?',
    default : true,
    when : function(props) {
      return props.cssType == 'Sass';
    }
  },
  {
	type:'confirm',
    name : 'sassLibs',
	message : 'Do you take your bourbon neat?',
    default : true,
    when : function(props) {
      return props.sassBourbon;
    }
  },
  {
	type:'confirm',
    name : 'sassLibs',
	message : 'Would you like a side of bitters with your Bourbon?',
    default : true,
    when : function(props) {
      return props.sassBourbon;
    }
  },
  {
    name:'assetsDir',
    message : 'What is the relative path to your template directory?',
    default:function(props) {
      return './assets/';
    }
  },
  {
    type:'confirm',
    name:'enterAuthor',
    message:'Would you like to enter some author and project related info?',
    default:true
},
  {
	name : 'authorName',
	message : 'Author name',
	default : '',
    when : function(props) {
      return props.enterAuthor;
    }
  },
  {
	name : 'authorEmail',
	message : 'Author email',
	default : '',
    when : function(props) {
      return props.enterAuthor;
    }
  },
  {
	name : 'authorUrl',
	message : 'Author url',
	default : '',
    when : function(props) {
      return props.enterAuthor;
    }
  },
  {
	name : 'gitRepo',
	message : 'Project git repository',
	default : function(props) {
		return (props.enterAuthor && props.authorName) ? 'git://github.com/' + _s.slugify(props.authorName.replace(/ /g,'')) + '/' + _s.slugify(props.name) + '.git' : ''
	},
    when : function(props) {
      return props.enterAuthor;
    }
  },
  {
	name : 'gitIssues',
	message : 'Project issues tracker',
	default : function(props) {
		if(!props.gitRepo) return '';
		var _s = props.gitRepo;
		_s = _s.substring(0,_s.length-4);
		return _s.replace('git://','https://') + '/issues';
	},
    when : function(props) {
      return props.gitRepo && props.gitRepo.length > 0;
    }
  }
];

  this.prompt(prompts, function (props) {
    this.name = props.name;
    this.description = props.description;
	this.slug = _s.slugify(props.name);
    this.assetsDir = (props.assetsDir.slice(-1) == '/') ? props.assetsDir : props.assetsDir + '/';
    this.authorName = props.authorName;
    this.authorEmail = props.authorEmail;
    this.authorUrl = props.authorUrl;
    this.gitRepo = props.gitRepo;
    this.gitIssues = props.gitIssues;

	switch(props.cssType.toLowerCase()[0]) {
		case 's':
		default:
		this.cssType = 'sass';
		break;
		
		case 'l':
		this.cssType = 'less';
		break;
		
		case 'n':
		case undefined:
		this.cssType = 'none';
		break;
	}
	
    cb();
  }.bind(this));
};

NeatPagesGenerator.prototype.app = function app() {
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('_Gruntfile.js', 'Gruntfile.js');
  if(this.modxSass) {
	this.directory('sass','sass');

  } else if(this.cssType == 'sass' || this.cssType == 'less') {
	// just blank files either way
    this.mkdir(this.cssType);
	this.write(this.cssType + '/index.' + this.cssType,'');
	this.write(this.cssType + '/login.' + this.cssType,'');
  } 
  if(this.useTpl) {
    this.bulkDirectory('default',this.assetsDir + this.slug);
  }
};

NeatPagesGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
