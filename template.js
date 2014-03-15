/**
 * grunt-neat-pages
 * https://github.com/jpdevries/NeatPages
 *
 */

'use strict';

// Basic template description
exports.description = 'Create a NeatSite.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after the question prompts.
exports.after = '';

// Any existing file or directory matching this wildcard will cause a warning.
//exports.warnOn = '';

// The actual init template
exports.template = function( grunt, init, done ) {
	init.process( {}, [
		// Prompt for these values.
		init.prompt( 'title', 'New Site' ),
		init.prompt( 'description', 'The best website ever made!' ),
		{
			name   : 'prefix',
			message: 'Theme alias (alpha and underscore characters only)',
			default: ''
		},
		{
			name   : 'version_no',
			message: 'Version number',
			default: '0.0.1'
		},
		{
			name   : 'readme',
			message: 'Create a README file for your project? (y/N)',
			default: 'yes'
		},
		{
			name: 'css_type',
			message: 'CSS Preprocessor: Will you use "Sass", "LESS", or "none" for CSS with this project?',
			default: 'Sass'
		},
		{
			name: 'assets_path',
			message: 'Path relative to index.html that assets will be stored. Use "./" for root.',
			default: 'assets/'
		},
		{
			name: 'use_bourbon',
			message: 'Bourbon: Would you like a glass of bourbon with this project? (y/N)',
			default: 'yes'
		},
		{
			name: 'bourbon_neat',
			message: 'Bourbon: Would you like that bourbon neat? (y/N)',
			default: 'yes'
		},
		{
			name: 'icon_set',
			message: 'Icon Set: Will you use "Font Awesome", "ionicons" or "none" with this project?',
			default: 'font-awesome'
		},
		{
			name: 'boilerplate',
			message: 'Boilerplate: Will you use "HTML5 Boilerplate", "Bootstrap", "Foundation 5" or "none" with this project?',
			default: 'html5-boilerplate'
		},
		init.prompt( 'homepage'),
		init.prompt( 'author_name' ),
		init.prompt( 'author_email' ),
		init.prompt( 'author_url' ),
		init.prompt( 'repository' ),
		init.prompt( 'bugs' ),
	], function( err, props ) {
		props.keywords = [];
		props.version = (Number(props.version_no)) ? props.version_no : '0.0.1';

		props.devDependencies = {
    		"grunt-bower-task": "~0.3.2",
    		"grunt-contrib-copy": "^0.4.1",
    		"grunt-contrib-watch": "^0.5.3",
    		"grunt-contrib-clean": "~0.5.0",
    		"grunt-growl": "~0.1.5",
    		"grunt-contrib-cssmin": "^0.6.2",
    		"grunt-contrib-csslint": "^0.1.2",
    		"grunt-contrib-concat": "~0.3.0",
    		"grunt-contrib-uglify": "^0.2.7"
		};

		// Sanitize names where we need to for PHP/JS
		props.name = props.title.replace( /\s+/g, '-' ).toLowerCase();
		// Development prefix (i.e. to prefix PHP function names, variables)
		props.prefix = props.prefix.replace('/[^a-z_]/i', '').toLowerCase();
		// Development prefix in all caps (e.g. for constants)
		props.prefix_caps = props.prefix.toUpperCase();
		// An additional value, safe to use as a JavaScript identifier.
		props.js_safe_name = props.name.replace(/[\W_]+/g, '_').replace(/^(\d)/, '_$1');
		// An additional value that won't conflict with NodeUnit unit tests.
		props.js_test_safe_name = props.js_safe_name === 'test' ? 'myTest' : props.js_safe_name;
		props.js_safe_name_caps = props.js_safe_name.toUpperCase();
		
		props.message = 'Your ' + props.name + ' project is going to be so awesome.\n';

		// Files to copy and process
		var files = init.filesToCopy( props );

		switch(props.readme.toLowerCase()[0]) {
			case 'y':
			default:
				props.readme = 'yes';
				props.message += 'A README file has automatically been created. ';
				break;

			case 'n':
				props.readme = 'no';
				delete files['README.md'];
		}

		switch(props.use_bourbon.toLowerCase()[0]) {
			case 'y':
			default:
				props.use_bourbon = 'yes';
				props.message += "You've chosen to use the silent Bourbon Sass Framework.\n *** Please drink responsibly. *** \n";
				break;

			case 'n':
				props.use_bourbon = 'no';
		}

		switch(props.bourbon_neat.toLowerCase()[0]) {
			case 'y':
			default:
				props.bourbon_neat = 'yes';
				props.message += "You drink your Bourbon Neat. ";
				break;

			case 'n':
				props.bourbon_neat = 'no';
		}

		switch( props.css_type.toLowerCase()[0] ) {
			case 'l':
				// so stupid that you have to do this
				delete files['_build/scss/_grid-settings.scss'];
				delete files['_build/scss/main.scss'];
				delete files['_build/scss/.DS_Store']; // i mean really?
				delete files['_build/scss'];

				//delete files['assets/css/main.css'];
				//delete files['assets/css/.DS_Store'];
				//delete files['assets/css/'];
				//delete files['assets/.DS_Store'];
				//delete files['assets/'];
				//delete files[ 'assets/css/src/' + props.js_safe_name + '.css' ];

				props.devDependencies["grunt-contrib-less"] = "^0.10.0";
				props.css_type = 'less';
				props.message += "You will be using the LESS CSS preprocessor. ";
				break;
			case 'n':
			case undefined:
				delete files[ '_build/less/main.less'];
				delete files['_build/less/.DS_Store'];
				delete files['_build/less'];
				delete files['_build/scss/_grid-settings.scss'];
				delete files['_build/scss/main.scss'];
				delete files['_build/scss/.DS_Store'];
				delete files['_build/scss'];
				props.css_type = 'none';
				props.message += "You will be writing raw CSS. Grunt will minify your CSS for you. ";
				break;
			// SASS is the default
			default:
				delete files[ '_build/less/main.less'];
				delete files[ '_build/less/main.less'];
				delete files['_build/less/.DS_Store'];
				delete files['_build/less'];

				//delete files['assets/css/main.css'];
				//delete files['assets/css/.DS_Store'];
				//delete files['assets/css/'];
				//delete files['assets/.DS_Store'];
				delete files['assets/'];

				props.devDependencies["grunt-contrib-sass"] = "^0.5.1";
				props.css_type = 'sass';
				props.message += "Look at that, you've got a great Sass skillset. ";
				break;
		}
		
		switch( props.icon_set.toLowerCase()[0] ) {
			case 'f':
			default:
				props.icon_set = 'font-awesome';
				props.message += "Font Awesome 4 is embeded in your project, so that's cool. ";
				break;
			case 'i':
				props.icon_set = 'ionicons';
				props.message += "The ionicons icon set is embeded in your project. ";
				break;
			case 'n':
			case undefined:
				props.icon_set = 'none';
				break;
		}

		switch( props.boilerplate.toLowerCase()[0] ) {
			case 'n':
			default:
				props.boilerplate = 'none';
				break;
			case 'h':
				props.boilerplate = 'html5-boilerplate';
				props.message += 'You are getting things started with HTML5 Boilerplate. ';
				break;
			case 'f':
				props.boilerplate = 'foundation';
				props.message += 'You are leveraging the Foundation 4 Front end Framework. ';
				break;
			case 'b':
				props.boilerplate = 'bootstrap';
				props.message += "Tigthen up all 4 of those bootstraps, you're in this for the long haul. ";
				break;
		}

		
		

		// Actually copy and process files
		init.copyAndProcess( files, props );

		// Generate package.json file
		init.writePackageJSON( '_build/package.json', props );


		var _bower = {
			name: "neat-pages",
			version:props.version,
			author: {
				name: "",
				url: ""
			},
			homepage: "",
			repository: {
				type: "git",
				url: ""
			},
			bugs: {
				url: ""
			},
			dependencies: {
				
			},
			exportsOverride: {
			}
		};

		if ('sass' === props.css_type) {
			_bower.dependencies["bourbon"] = "~3.1.8";
			_bower.dependencies["neat"] = "~1.4.0";
			_bower.exportsOverride["bourbon"] = {
				"": "app/assets/stylesheets/"
			};
			_bower.exportsOverride["neat"] = {
				"": "app/assets/stylesheets/"
			};
		}

		if ('html5-boilerplate' === props.boilerplate) {
			_bower.dependencies["html5-boilerplate"] = "~4.3.0";
			_bower.exportsOverride["html5-boilerplate"] = {
				"css" : ["css/main.css","css/normalize.css"],
				"js" : ["js"],
				"" : ["./.htaccess","./favicon.ico","./humans.txt","./index.html","./robots.txt","./apple-touch-icon-precomposed.png"]
			};
		}
		if ('font-awesome' === props.icon_set) {
			_bower.dependencies["font-awesome"] = "~4.0.3";
			_bower.exportsOverride["font-awesome"] = {
				"scss": [
					"scss"
				],
				"fonts": [
					"fonts"
				],
				"less": [
					"less"
				],
				"css": [
					"css"
				]
			};
		} else if('ionicons' === props.icon_set) {
			_bower.dependencies["ionicons"] = "~1.3.5";
			_bower.exportsOverride["ionicons"] = {
				"fonts": [
					"fonts"
				],
				"css": [
					"css"
				],
				"scss": [
					"scss"
				]
			};
		}

		if ('bootstrap' === props.boilerplate) {
			_bower.dependencies["bootstrap"] = "~3.0.0";
			_bower.exportsOverride["bootstrap"] = {
				"dist" : ["dist"],
				"less" : ["less"],
				"fonts" : ["fonts"]//,
				//"" : ["./*html"]
			};
		}

		if ('foundation' === props.boilerplate) {
			_bower.dependencies["foundation"] = "~5.0.2";
			_bower.exportsOverride["foundation"] = {
		 		"js":["js"],
		 		"scss":["scss"]
			};
		}

		init.writePackageJSON( '_build/bower.json', _bower, function(a,b){
			return b;
		} );
		
		console.log("\nThat was quick. Looks like you've got some neat pages.\n");
		console.log(props.message);
		console.log("\nWOOHOO! Your Grunt project has been created.");
		console.log("\nIt's time we build:\n$ cd _build\n$ npm install\n$ grunt build");

		// Done!
		done();
	});
};