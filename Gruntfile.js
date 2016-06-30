module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default',['concat','uglify']);
}