
module.exports=function(grunt){
		grunt.initConfig({
			serve: {
				options: {
					port: 9000,
					tasks:['open:dev','watch']
				}
			},
			open : {
				dev : {
					path: 'http://localhost:9000/index.html'
				}
			},
			watch: {
				js: {
					files: [ 'main.js'],
					tasks:[]
				}
			}
		});
		
		grunt.registerTask('default', ['serve']);
		
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-serve');
		grunt.loadNpmTasks('grunt-open');
};