module.exports = function(grunt) {
	// Project configuration.	
	
	var doSFTP = grunt.file.isFile('sftp-secret.json'); // see https://github.com/modxcms/reynolds/blob/master/_build/templates/reynolds/README.md#grunt-sftp
	
	var initConfig = {
		pkg: grunt.file.readJSON('package.json'),
		dirs: { /* just defining some properties */
			lib: './lib/',
			scss: './scss/',
			theme: '../../../assets/components/neatprints/templates/default/',
			assets: 'assets/',
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
		copy: { 
			bourbon: {
				files: [{
					src: 'bourbon/**/*',
					cwd: '<%= dirs.lib %>',
					dest: '<%= dirs.scss %>',
					expand: true
				}]
			},
			neat: {
				files: [{
					src: 'neat/**/*',
					cwd: '<%= dirs.lib %>',
					dest: '<%= dirs.scss %>',
					expand: true
				}]
			},
			fontawesome: {
				files: [{
					src: '<%= dirs.lib %>font-awesome/scss/**/*.scss',
					dest: '<%= dirs.scss %>font-awesome/',
					expand: true,
					flatten: true
				}, {
					src: 'font/**/*',
					cwd: '<%= dirs.lib %>font-awesome/',
					dest: '<%= dirs.assets %>',
					expand: true
				}]
			},
			"html5-boilerplate": {
				files: [{
					src: '<%= dirs.lib %>html5-boilerplate/css/main.css',
					dest: '<%= dirs.scss %>html5-boilerplate/_main.scss'
				},{
					src: '<%= dirs.lib %>html5-boilerplate/css/normalize.css',
					dest: '<%= dirs.scss %>html5-boilerplate/_normalize.scss'
				},{
					src: '<%= dirs.lib %>html5-boilerplate/css/normalize.css',
					dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>normalize.css'
				}]
			}
		},
		cssmin: {
			compress: {
				options: {
					report: 'min',
					keepSpecialComments: 0,
					banner: '/*!\n*  <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n*/'
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>style.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>style.css'
				}
			},
			vendor: {
				options: {
					report: 'min',
					keepSpecialComments: 0
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>bootstrap.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>bootstrap.css',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>font-awesome.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>font-awesome.css'
				}
			}
		},
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
		csslint: {
			strict: {
				options: {
					import: 2
				},
				src: ['<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>**/*.css']
			}
		},
		concat: {
			options: {
				separator: '',
			},
			dist: {
				src: ['<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>plugins.js','<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>main.js'],
				dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>main-dev.js', 
			},
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
		watch: { /* trigger tasks on save */
			options: {
				livereload: true 
			},
			scss: {
				files: '<%= dirs.scss %>**/*.scss',
				tasks: ['sass:dist', 'autoprefixer', 'cssmin', 'growl:sass']
			},
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
			sass: {
				message: "Sass files created.",
				title: "grunt"
			},
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

	grunt.initConfig(initConfig);
	
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-growl');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['sass:dist', 'cssmin', 'growl:sass', 'growl:watch', 'watch']);
	grunt.registerTask('build', ['clean:prebuild', 'bower', 'copy', 'sass:dist', 'cssmin', 'concat', 'uglify', 'growl:sass', 'clean:postbuild']);
	grunt.registerTask('expand', ['sass:dev', 'growl:sass', 'growl:expand']);

};
