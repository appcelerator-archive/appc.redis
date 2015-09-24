module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		mocha_istanbul:{
			coverage: {
				print: 'none',
				quiet: true,
				excludes: [
					'**/node_modules/**'
				],
				src: [
					'test/**/*.js'
				]
			}
		},
		mochaTest: {
			options: {
				slow: 1000,
				timeout: 3000,
				reporter: 'spec',
				ignoreLeaks: false
			},
			src: ['test/**/*.js']
		},
		jshint: {
			options: {
				jshintrc: true
			},
			src: ['*.js','lib/**/*.js','models/**/*.js','test/**/*.js']
		},
		clean: {
			coverage: ['coverage'],
			logs: ['logs'],
			tmp: ['tmp']
		}
	});

	// Load grunt plugins for modules
	grunt.loadNpmTasks('grunt-mocha-istanbul');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// register tasks
	grunt.registerTask('coverage', ['clean:coverage','mocha_istanbul:coverage']);
	grunt.registerTask('default', ['lint','test','clean']);
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('test', ['mochaTest']);

};
