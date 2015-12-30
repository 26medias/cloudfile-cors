var cfcors = require("cloudfile-cors");

var instance = new cfcors({
	username:	'',
	apiKey:		''
}, function(client, authtoken) {
	console.log("\n\nauthtoken:\n", authtoken);
});

instance.corsContainer({
	container:	'fw6-libs'
}, function() {
	console.log("DONE!");
});

/*
instance.cors({
	container:	'fw6-libs',
	file:		'ui-kit/components/race-registration/race-registration-form.html'
}, function(response) {
	console.log("\n\nCORS: Done!\n", response);
});


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