
module.exports=function(grunt){
	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	
	grunt.initConfig({
		express: {
			all: {
				options: {
					bases: [__dirname+'/dist'],
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
		copy: {
		  index: {
		    src: 'source/index.html',
		    dest: 'dist/index.html',
		  },
		  css:{
		  	src: 'source/style.css',
		    dest: 'dist/style.css',
		  }
		},
		watch: {
			js: {
				files: [ 'index.html','main.js'],
				tasks:['concat','copy'],
				options:{
					livereload:true	,
					spawn:false
				}
			}
		},
		concat:{
			main: {
		      src: ['source/main.js',],
		      dest: 'dist/main.js',
		    },
		    plugins:{
		    	src:['bower_components/jquery/dist/jquery.min.js','bower_components/jquery.cookie/jquery.cookie.js'],
		    	dest:'dist/plugins.js',
		    },
		}
	});
	
	grunt.registerTask('default', ['copy','concat','express','open','watch']);
		

};