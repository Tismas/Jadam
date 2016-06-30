module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: ['js/init.js','js/callbacks.js','js/entities.js','js/globals.js','js/logic.js','js/UI.js'],
				tasks: ['concat','uglify'],
			},
		},
		concat: {
			options:{
				banner: "(function(){\n",
				footer: "\n})();",
				separator: "\n\n",
			},
			dist:{
				src: ['js/globals.js', 'js/init.js', 'js/entities.js', 'js/callbacks.js', 'js/UI.js', 'js/logic.js'],
				dest: 'js/concatenated.js',
			},
		},
		uglify: {
			my_target: {
				files: {
					'js/main.js': ['js/concatenated.js'],
				}
			},
		},
	});
	
	grunt.event.on('watch', function(action, filepath, target) {
  		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default',['concat','uglify','watch']);
}