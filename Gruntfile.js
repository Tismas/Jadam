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
				src: ['js/globals.js', 'js/entities.js', 'js/callbacks.js', 'js/UI.js', 'js/logic.js', 'js/init.js'],
				dest: 'js/contenated.js',
			},
		},
		uglify: {
			my_target: {
				files: {
					'js/main.js': ['js/contenated.js'],
				}
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default',['concat','uglify']);
}