module.exports = function(grunt) {
	// Project configuration.	
	
	var doSFTP = grunt.file.isFile('sftp-secret.json'); // see https://github.com/modxcms/reynolds/blob/master/_build/templates/reynolds/README.md#grunt-sftp
	
	var initConfig = {
		pkg: grunt.file.readJSON('package.json'),
		dirs: { /* just defining some properties */
			lib: './lib/',
			{% if ('sass' === css_type) { %}scss: './scss/',{% } else if ('less' === css_type) { %}less: './less/',{% } %}
			theme: '../',
			assets: '{%= assets_path %}',
			css: 'css/',
			js:  'js/',
			img: 'img/',
			font: 'font/'
		},
		bower: {
			install: {
				options: {
					targetDir: './lib',
					layout: 'byComponent'
				}
			}
		},
		{% if ('none' !== boilerplate) { %}
		copy: { 
		},
		{% } %}
		cssmin: {
			compress: {
				options: {
					report: 'min',
					keepSpecialComments: 0,
					banner: '/*!\n*  <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n*/'
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css'
				}
			}
		},
		{% if ('sass' === css_type) { %}
		sass: {
			dist: {
				options: {
					style: 'compressed',
					compass: false
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css': '<%= dirs.scss %>main.scss'
				}
			},
			dev: {
				options: {
					style: 'expanded',
					compass: false
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css': '<%= dirs.scss %>main.scss'
				}
			}
		},
		{% } else if ('less' === css_type) { %}
		less:   {
			dist: {
				options:{
					compress:true
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css': '<%= dirs.less %>main.less'
				}
			},
			dev: {
				options:{
					compress:false
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css': '<%= dirs.less %>main.less'
				}
			}
		},
		{% } %}
		csslint: {
			strict: {
				options: {
					import: 2
				},
				src: ['<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>**/*.css']
			}
		},
		{% if ('bootstrap' !== boilerplate && 'bootstrap' !== 'none') { %}
		concat: {
			options: {
				separator: '',
			}
			{% if ('html5-boilerplate' === boilerplate) { %}
			,
			h5bp: {
				src: [
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>plugins.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>main.js'
				],
				dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>main-dev.js', 
			}
			{% } else if ('foundation' === boilerplate) { %}
			,
			foundation: {
				src: [ /* comment stuff out you don't need */
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.alerts.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.clearing.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.cookie.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.dropdown.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.forms.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.joyride.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.magellan.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.orbit.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.reveal.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.section.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.tooltips.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.topbar.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.interchange.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.placeholder.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>foundation/foundation.abide.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>main.js'
				],
				dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>main-dev.js',
			}
			{% } %}
		},
		uglify: {
			main: {
				options: {
					report: 'min'
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>main-min.js': ['<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>main-dev.js']
				}
				
			}
		},
		{% } %}
		watch: { /* trigger tasks on save */
			options: {
				livereload: true 
			},
			{% if ('sass' === css_type) { %}
			scss: {
				files: '<%= dirs.scss %>**/*.scss',
				tasks: ['sass:dist', 'cssmin', 'growl:sass']
			},
			{% } else if ('less' === css_type) { %}
			less: {
				files: '<%= dirs.less %>**/*.less',
				tasks: ['less:dist', 'cssmin', 'growl:sass']
			},
			{% } else { %}
			styles: {
				files: ['<%= dirs.css %>**/*.css','!<%= dirs.css %>**/*.min.css'],
				tasks: ['cssmin']
			},
			{% } %}
			js: {
				files: ['<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>*','!<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>**/*-dev.js*','!<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>**/*-min.js*'],
				tasks: ['concat', 'growl:concat', 'uglify', 'growl:uglify']
			}
		},
		clean: { /* take out the trash */
			options: {
				force: true
			},
			prebuild: ['<%= dirs.scss %>bourbon', '<%= dirs.scss %>font-awesome'],
			postbuild: ['<%= dirs.lib %>']
		},
		growl: { /* optional growl notifications requires terminal-notifer: gem install terminal-notifier */
			{% if ('sass' === css_type) { %}
			sass: {
				message: "Sass files created.",
				title: "grunt"
			},
			{% } else if ('less' === css_type) { %}
			less: {
				message: "Less files created.",
				title: "grunt"
			},
			{% } else { %}
			css: {
				message: "CSS files created.",
				title: "grunt"
			},
			{% } %}
			build: {
				title: "grunt",
				message: "Build complete."
			},
			watch: {
				title: "grunt",
				message: "Watching. Grunt has its eye on you."
			},
			expand: {
				title: "grunt",
				message: "CSS Expanded. Don't check it in."
			},
			concat: {
				title: "grunt",
				message: "JavaScript concatenated."
			},
			uglify: {
				title: "grunt",
				message: "JavaScript minified."
			}
		}
	};

	{% if ('sass' === css_type) { %}
	initConfig.copy["bourbon"] = {
		files: [{
			src: 'bourbon/**/*',
			cwd: '<%= dirs.lib %>',
			dest: '<%= dirs.scss %>',
			expand: true
		}]
	};

	initConfig.copy["neat"] = {
		files: [{
			src: 'neat/**/*',
			cwd: '<%= dirs.lib %>',
			dest: '<%= dirs.scss %>',
			expand: true
		}]
	};
	{% } %}
	{% if ('font-awesome' === icon_set) { %}
	initConfig.copy["font-awesome"] = {
		files: [
			{% if ('none' !== css_type) { %}
			{
				{% if ('sass' === css_type) { %}
				src: '<%= dirs.lib %>font-awesome/scss/**/*.scss',
				{% } else if ('less' === css_type) { %}
				src: '<%= dirs.lib %>font-awesome/less/**/*.less',
				{% } else { %}
				src: '<%= dirs.lib %>font-awesome/css/**/*.css',
				{% } %}

				{% if ('sass' === css_type) { %}
				dest: '<%= dirs.scss %>font-awesome/',
				{% } else if ('less' === css_type) { %}
				dest: '<%= dirs.less %>font-awesome/',
				{% } else { %}
				dest: '<%= dirs.css %>font-awesome/',
				{% } %}
				expand: true,
				flatten: true
			},
			{% } %}
			{
				src: 'font/**/*',
				cwd: '<%= dirs.lib %>font-awesome/',
				dest: '<%= dirs.theme %><%= dirs.assets %>',
				expand: true
			}
		]
	};
	{% } %}
	{% if ('foundation' === boilerplate) { %}
	initConfig.copy["foundation-js"] = {
		files: [{
			cwd: '<%= dirs.lib %>foundation/',
			src: 'js/**/*.js',
			dest: '<%= dirs.theme %><%= dirs.assets %>',
			expand: true
		}]
	};
	initConfig.copy["foundation-scss"] = {
		files: [{
			cwd: '<%= dirs.lib %>foundation/scss/',
			src: '**/*.scss',
			dest: '<%= dirs.scss %>',
			expand: true
		}]
	};
	{% } else if ('bootstrap' === boilerplate) { %}
	initConfig.copy["bootstrap-dist"] = {
		files: [{
			cwd: '<%= dirs.lib %>bootstrap/dist/',
			src: '**/*',
			dest: '<%= dirs.theme %><%= dirs.assets %>',
			expand:true
		}]
	};
	/*initConfig.copy["bootstrap-html"] = {
		files: [{
			cwd: '<%= dirs.lib %>bootstrap/',
			src: ['*.html'],
			dest: '<%= dirs.theme %>',
			expand:true
		}]
	};*/
	{% if ('less' === css_type) { %}
	initConfig.copy["bootstrap-less"] = {
		files: [{
			cwd: '<%= dirs.lib %>bootstrap/less/',
			src: '**/*.less',
			dest: '<%= dirs.less %>bootstrap',
			expand:true
		}]
	};
	{% } %}
	{% } else if ('html5-boilerplate' === boilerplate) { %}
	initConfig.copy["html5-boilerplate"] = {
		files: [{
			src: '<%= dirs.lib %>html5-boilerplate/css/main.css',
			{% if ('sass' === css_type) { %}
			dest: '<%= dirs.scss %>html5-boilerplate/_main.scss'
			{% } else if ('less' === css_type) { %}
			dest: '<%= dirs.less %>html5-boilerplate/main.less'
			{% } else { %}
			dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css'
			{% } %}
		},{
			src: '<%= dirs.lib %>html5-boilerplate/css/normalize.css',
			{% if ('sass' === css_type) { %}
			dest: '<%= dirs.scss %>html5-boilerplate/_normalize.scss'
			{% } else if ('less' === css_type) { %}
			dest: '<%= dirs.less %>html5-boilerplate/normalize.less'
			{% } else { %}
			dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>normalize.css'
			{% } %}
		},{
			src: '<%= dirs.lib %>html5-boilerplate/css/normalize.css',
			dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>normalize.css'
		}]
	};
	{% } %}


	{% if ('html5-boilerplate' === boilerplate) { %}
	// copy index.html, update paths if it doesn't already exist
	if(!grunt.file.exists(initConfig.dirs.theme + 'index.html')) {
		initConfig.copy['html5-boilerplate-index'] = {
			options:{
				processContent:function(content, srcpath){
					var _css = grunt.template.process('<%= dirs.assets %><%= dirs.css %>',{data:initConfig});
					content = content.replace(new RegExp('css/',"g"),_css);

					var _js = grunt.template.process('<%= dirs.assets %><%= dirs.js %>',{data:initConfig});
					content = content.replace(new RegExp('js/',"g"),_js);
					return content;
				}
			},
			files:[{
				src: '<%= dirs.lib %>html5-boilerplate/index.html',
				dest: '<%= dirs.theme %>/index.html'
			}]
		};
	}
	// copy JavaScript if it isn't already there
	if(!grunt.file.exists(initConfig.dirs.theme + initConfig.dirs.assets + initConfig.dirs.js)) {
		initConfig.copy['html5-boilerplate'].files.push({
			src: 'js/**/*.js',
			cwd: '<%= dirs.lib %>html5-boilerplate/',
			dest: '<%= dirs.theme %><%= dirs.assets %>',
			expand: true,
		});
	}
	// copy apple-touch-icon-precomposed.png if it isn't already there
	if(!grunt.file.exists(initConfig.dirs.theme + 'apple-touch-icon-precomposed.png')) {
		initConfig.copy['html5-boilerplate'].files.push({
			src: '<%= dirs.lib %>html5-boilerplate/apple-touch-icon-precomposed.png',
			dest: '<%= dirs.theme %>/apple-touch-icon-precomposed.png'
		});
	}
	// copy favicon.ico if it isn't already there
	if(!grunt.file.exists(initConfig.dirs.theme + 'favicon.ico')) {
		initConfig.copy['html5-boilerplate'].files.push({
			src: '<%= dirs.lib %>html5-boilerplate/favicon.ico',
			dest: '<%= dirs.theme %>/favicon.ico'
		});
	}
	// copy .htaccess if it isn't already there
	if(!grunt.file.exists(initConfig.dirs.theme + '.htaccess')) {
		initConfig.copy['html5-boilerplate'].files.push({
			src: '<%= dirs.lib %>html5-boilerplate/.htaccess',
			dest: '<%= dirs.theme %>/.htaccess'
		});
	}
	// copy humans.txt if it isn't already there
	if(!grunt.file.exists(initConfig.dirs.theme + 'humans.txt')) {
		initConfig.copy['html5-boilerplate'].files.push({
			src: '<%= dirs.lib %>html5-boilerplate/humans.txt',
			dest: '<%= dirs.theme %>/humans.txt'
		});
	}
	// copy robots.txt if it isn't already there
	if(!grunt.file.exists(initConfig.dirs.theme + 'robots.txt')) {
		initConfig.copy['html5-boilerplate'].files.push({
			src: '<%= dirs.lib %>html5-boilerplate/robots.txt',
			dest: '<%= dirs.theme %>/robots.txt'
		});
	}
	{% } %}

	grunt.initConfig(initConfig);
	
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-copy');
	{% if ('sass' === css_type) { %}
	grunt.loadNpmTasks('grunt-contrib-sass');
	{% } else if ('less' === css_type) { %}
	grunt.loadNpmTasks('grunt-contrib-less');
	{% } %}
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-growl');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	{% if ('bootstrap' !== boilerplate) { %}
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	{% } %}

	{% if ('sass' === css_type) { %}
	grunt.registerTask('default', ['sass:dist', 'cssmin', 'growl:sass', 'growl:watch', 'watch']);
	grunt.registerTask('build', ['clean:prebuild', 'bower', {% if ('none' !== boilerplate) { %}'copy',{% } %} 'sass:dev', 'cssmin', {% if ('bootstrap' !== boilerplate) { %}'concat', 'uglify',{% } %} 'growl:sass', 'clean:postbuild']);
	{% } else if ('less' === css_type) { %}
	grunt.registerTask('default', ['less:dist', 'cssmin', 'growl:less', 'growl:watch', 'watch']);
	grunt.registerTask('build', ['clean:prebuild', 'bower', {% if ('none' !== boilerplate) { %}'copy',{% } %} 'less:dev', 'cssmin', {% if ('bootstrap' !== boilerplate) { %}'concat', 'uglify',{% } %} 'growl:less' , 'clean:postbuild']);
	{% } else { %}
	grunt.registerTask('default', ['cssmin', 'growl:watch', 'watch']);
	grunt.registerTask('build', ['clean:prebuild', 'bower', {% if ('none' !== boilerplate) { %}'copy',{% } %} 'cssmin', {% if ('bootstrap' !== boilerplate) { %}'concat', 'uglify',{% } %} 'growl:css', 'clean:postbuild']);
	{% } %}
	
	
	
	grunt.registerTask('expand', ['sass:dev', 'growl:sass', 'growl:expand']);

};
