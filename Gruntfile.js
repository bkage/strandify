
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
		  	src: 'source/css/style.css',
		    dest: 'dist/css/style.css',
		  }
		},
		sass:{
			dist: {
		    files: [{
		    	expand: true,
		        cwd: 'source/css',
		        src: ['*.scss'],
		        dest: 'dist/css',
		        ext: '.css'
		      }]
		    }
		},
		watch: {
			js: {
				files: [ 'source/index.html','source/js/*.js','source/css/*.scss'],
				tasks:['concat','copy','sass'],
				options:{
					livereload:true	,
					spawn:false
				}
			}
		},
		concat:{
			main: {
		      src: ['source/js/app.js'],
		      dest: 'dist/js/main.js',
		    },
		    plugins:{
		    	src:['bower_components/jquery/dist/jquery.min.js',
		    	'bower_components/jquery.cookie/jquery.cookie.js'],
		    	dest:'dist/js/plugins.js',
		    },
		}
	});
	
	grunt.registerTask('default', ['copy','concat','sass','express','open','watch']);
		

};