# Rackspace CloudFile CORS for NodeJS #

This module allows to make your files hosted on Rackspace Cloud Files CORS compatible, by setting up the right custom headers to the files of your choice.

There didn't seem to be a way to do it with the pkgcloud package or any other packages for that matter.

## Installation ##

	npm install cloudfile-cors

## Usage ##

	
	var cfcors = require("cloudfile-cors");
	
	// Create a new instance
	var instance = new cfcors({
		username: 'rackspace-username',
		apiKey:   'rackspace-api-key'
	});
	
	// Setup the CORS custom headers on that file
	instance.cors({
		container:	'your-container-name',
		file:		'somefile.html'
	}, function(response) {
		// It's done
	});


## Important note ##
On Rackspace Cloud File, setting up the `Access-Control-Allow-Origin: *` header on your file is not enough.

Your container needs to have a custom header too, for CORS to work.
Use the following method to setup your container to be CORS-compatible:

	instance.corsContainer({
		container:	'your-container-name'
	}, function() {
		console.log("DONE!");
	});

Your container will now have a `X-Container-Meta-Access-Control-Allow-Origin: *` header setup.

You only need to do that once.

## Advanced Options ##

You can have a little more control

	var cfcors = require("cloudfile-cors");
	
	// Create a new instance
	var instance = new cfcors({
		username: 'rackspace-username',
		apiKey:   'rackspace-api-key',
		region:   'IAD',	// The region. If not provided, your account's default region will be used.
		identity: 'https://identity.api.rackspacecloud.com/v2.0/tokens'	// Identity service to use (but you shouldn't need to specify that)
	}, function(client, authtoken) {
		/*
			"client" is a reference to the instance you've created
			"authtoken" contains an objects:
			{
				id: 'AADGgo3eeCQH3L_OMTYAJhjGuV0VWWFGqCIWfWenFJraDxw1CW0zkxFR3Lix8JTDFmRDTrei4MgG9hoNUN6QvzzFqa0e3JxhI0Z7areBH2oU9Hvd1THDHgFVXAqfjXvyOUk2ywz6VZ9XCA',
				expires: '2015-12-31T17:00:24.885Z',
				tenant: {
					id: '891900',
					name: '891900'
				},
				'RAX-AUTH:authenticatedBy': [ 'APIKEY' ]
			}
		*/
	});

You can set custom headers if you want to setup more than the CORS headers:

	instance.setCustomHeaders({
		container:	'your-container-name',
		file:		'somefile.html',
		headers:	{
			'Content-Type':	'application/json',	// Change the content-type
			'X-My-Custom-Header': 'HelloWorld'	// Set a completely custom header
		}
	}, function() {
		// It's done
	});



To setup custom headers on the container instead of a file:

	instance.setContainerCustomHeaders({
		container:	'your-container-name',
		headers:	{
			'X-My-Custom-Header': 'HelloWorld'	// Set a completely custom header
		}
	}, function() {
		// It's done
	});

