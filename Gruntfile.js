/* --------------------------------------------------------------------------

*** Simply Colorful by @LorenzoPegorari ***

Simply Colorful theme compiler for Obsidian

Grunt is a JS library that runs a sequence of compilation tasks, and watches
the working files to automatically run this sequence whenever changes happen.

Read more at gruntjs.com

-----------------------------------------------------------------------------

MIT License

Copyright (c) 2024-2026 Lorenzo Pegorari (@LorenzoPegorari)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-------------------------------------------------------------------------- */

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
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					'src/css/main.css': 'src/sass/index.scss'
				}
			}
		},

		/* Concatenate theme files */
		concat_css: {
			dist: {
				files: {
					'theme.css': ['src/css/license.css', 'src/css/main.css', 'src/css/style-settings-plugin.css']
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
