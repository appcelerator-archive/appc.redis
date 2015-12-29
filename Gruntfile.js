module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		appcJs: {
			src: ['*.js', 'lib/**/*.js', 'models/**/*.js', 'test/**/*.js']
		},
		mocha_istanbul: {
			coverage: {
				src: [
					'test/**/*.js'
				],
				options: {
					timeout: 30000,
					ignoreLeaks: false,
					check: {
						statements: 90,
						branches: 70,
						functions: 90,
						lines: 90
					}
				}
			}
		},
		clean: {
			coverage: ['coverage'],
			logs: ['logs'],
			tmp: ['tmp']
		}
	});

	// Load grunt plugins for modules
	grunt.loadNpmTasks('grunt-appc-js');
	grunt.loadNpmTasks('grunt-mocha-istanbul');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// register tasks
	grunt.registerTask('coverage', ['clean:coverage', 'mocha_istanbul:coverage']);
	grunt.registerTask('default', ['appcJs', 'test', 'clean']);
	grunt.registerTask('lint', ['appcJs']);
	grunt.registerTask('test', ['clean:coverage', 'mocha_istanbul:coverage']);

};
