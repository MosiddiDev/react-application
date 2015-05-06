requirejs.config({
    baseUrl: 'js',
    paths: {
        'js': '.',
        'jsmodules': './jsmodules',
		'angular': '../angular/angular',
		'jquery': '../jquery/dist/jquery.min',
		'mustache': '../mustache/mustache.min',
    }
});

requirejs(['js/core']);
