
module.exports=function(grunt){
	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	
	grunt.initConfig({
		express: {
			all: {
				options: {
					bases: [__dirname],
					port: 9000,
				hostname: '0.0.0.0',
					livereload: true
				}
			}
		},
		open : {
			all : {
				path: 'http://localhost:<%= express.all.options.port%>'
			}
		},
		watch: {
			js: {
				files: [ 'index.html','main.js'],
				options:{
					livereload:true	,
					spawn:false
				}
			}
		}
	});
	
	grunt.registerTask('default', ['express','open','watch']);
		

};