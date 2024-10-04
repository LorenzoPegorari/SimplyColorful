/*
Simply COlorful Theme compiler for Obsidian

MIT License
Copyright (c) 2024 Lorenzo Pegorari (@LorenzoPegorari)

Grunt is a JS library that runs a sequence of compilation tasks, and watches
the working files to automatically run this sequence whenever changes happen.

Read more at gruntjs.com
*/

const sass = require('node-sass');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/* Get the user-defined OBSIDIAN_PATH from .env file
		   so that we can live reload the theme in the vault */
		env: {
			local: {
				src: ".env"
			}
		},

		/* Compile SASS */
		sass: {
			options: {
				implementation: sass, 
				sourceMap: false,
				indentType: 'tab',
				indentWidth: 1,
				linefeed: 'crlf',
				outputStyle: 'extended'
			},
			dist: {
				files: {
					'src/css/main.css': 'src/sass/index.scss'}
			}
		},

		/* Concatenate theme files */
		concat_css: {
			dist: {
				files: {
					'theme.css': ['src/css/license.css', 'src/css/main.css']
				}
			}
		},

		/* Copy the finished distribution file from the working directory
		   to the vault directory and use correct theme name */
		copy: {
			local: {
				expand: true,
				src: 'theme.css',
				dest: process.env.OBSIDIAN_PATH,
			},
		},

		/* Watches for changes, and compile new changes */
		watch: {
			css: {
				files: ['src/**/*.scss', 'src/**/*.css'],
				tasks: ['env', 'sass:dist', 'concat_css', 'copy']
			}
		},
	});

	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-concat-css');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('loadconst', 'Load constants', function() {
		grunt.config('OBSIDIAN_PATH', process.env.OBSIDIAN_PATH);
	});

	grunt.registerTask('default', ['env:local', 'loadconst', 'watch']);
}
