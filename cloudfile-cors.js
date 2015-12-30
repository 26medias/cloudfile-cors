
var _ 			= require('underscore');
var curl 		= require('curlrequest');

var cfcors = function(options, callback) {
	var scope = this;
	
	this.token		= {};	// Contains the token and its related data (expiration date, ...)
	this.regionData	= {};	// Contaisn the region data: url, region name, ...
	
	this.options = _.extend({
		username:	'',
		apiKey:		'',
		identity:	'https://identity.api.rackspacecloud.com/v2.0/tokens',
		region:		false	// If not specified, we get it from the user's data when getting the token
	}, options);
	
	//curl -d "{\"auth\":{\"RAX-KSKEY:apiKeyCredentials\":{\"username\":\"[username]\",\"apiKey\":\"[apikey]\"}}}" -H "Content-Type: application/json" "https://identity.api.rackspacecloud.com/v2.0/tokens"
	
	if (callback) {
		this.getToken(function(token) {
			callback(scope, token);
		});
	}
}
cfcors.prototype.getToken = function(callback) {
	var scope = this;
	
	if (this.token && this.token.expires && new Date(this.token.expires)<new Date()) {
		callback(this.token);
		return false;
	}
	
	curl.request({
		url:	this.options.identity,
		data:	JSON.stringify({
			auth:	{
				'RAX-KSKEY:apiKeyCredentials':	{
					username:	this.options.username,
					apiKey:		this.options.apiKey
				}
			}
		}),
		headers:	{
			'Content-Type': 'application/json'
		}
	}, function (err, stdout, meta) {
		
		if (err) {
			callback({
				error:		true,
				message:	err
			});
		} else {
			// Grab the token
			var response	= JSON.parse(stdout);
			
			if (response && response.access && response.access.token) {
				scope.token	= response.access.token;
				
				// Gather more data
				if (!scope.options.region) {
					// No region specified, let's grab the default one from the account
					if (response.access.user && response.access.user['RAX-AUTH:defaultRegion']) {
						scope.options.region	= response.access.user['RAX-AUTH:defaultRegion'];
					} else {
						scope.options.region	= 'IAD';	// Set IAD by default...
					}
				}
				if (response.access.serviceCatalog) {
					// Find the endpoints
					var cloudFileEndpoints	= _.find(response.access.serviceCatalog, function(item) {
						return item.name	== 'cloudFiles';
					});
					// Find the endpoint for our region
					var cloudFileRegion	= _.find(cloudFileEndpoints.endpoints, function(item) {
						return item.region	== scope.options.region;
					});
					
					scope.regionData	= cloudFileRegion;
				}
				
				callback(scope.token);
			} else {
				callback({
					error:		true,
					message:	'No access token found in the response.'
				});
			}
		}
	});
}
cfcors.prototype.setCustomHeaders = function(options, callback) {
	var scope = this;
	
	options = _.extend({
		container:	'',
		file:		'',
		headers:	{
			'Access-Control-Allow-Origin': '*'
		}
	}, options);
	
	// Get the authtoken
	this.getToken(function(token) {
		
		// curl -i -X POST "https://storage101.iad3.clouddrive.com/v1/MossoCloudFS_68314899-0a85-4db2-a789-c4604b003c92/fw6-libs/ui-kit/components/race-header/race-header.html" -H "X-Auth-Token: AADwmOtpmHXJAfrspsOvXs4wVUng0eupNBozPbtUX5E1_lRRndX7YPJr_IN0q6zKlJl0KFLDKhchGWfD2LTSpfMYPWdecA6ps4WhpqVIAFLqnyNH2qWa4dp0B_aBdSTljjLp5Hg2Mmf61A" -H "Access-Control-Allow-Origin: *"
		
		// Update the headers
		options.headers	= _.extend({
			'X-Auth-Token':	scope.token.id
		}, options.headers);
		
		curl.request({
			url:		scope.regionData.publicURL+'/'+options.container+'/'+options.file,
			method:		'POST',
			headers:	options.headers
		}, function (err, stdout, meta) {
			
			if (err) {
				callback({
					error:		true,
					message:	err
				});
			} else {
				callback(stdout);
			}
		});
	});
}
cfcors.prototype.cors = function(options, callback) {
	var scope = this;
	
	options = _.extend({
		container:	'',
		file:		''
	}, options);
	
	this.setCustomHeaders({
		container:	options.container,
		file:		options.file,
		headers:	{
			'Access-Control-Allow-Origin': '*'
		}
	}, callback);
}
cfcors.prototype.setContainerCustomHeaders = function(options, callback) {
	var scope = this;
	
	options = _.extend({
		container:	'',
		headers:	{
			'X-Container-Meta-Access-Control-Allow-Origin': '*'
		}
	}, options);
	
	// Get the authtoken
	this.getToken(function(token) {
		
		// curl -i -X POST "https://storage101.iad3.clouddrive.com/v1/MossoCloudFS_68314899-0a85-4db2-a789-c4604b003c92/fw6-libs" -H "X-Auth-Token: AADwmOtpqBkc5EIW0XMd2WRGeDq0RdEENO7pE0xj3CZ9eeznz_122jGtpSpLmHYgripQqOmZiee8nmGR-2uYJjAc-i9QFYH7xENZUew2Zo_wR7y_uLFXoPgTfswX8s_fGf-g8Yp00NGrMw" -H "X-Container-Meta-Access-Control-Allow-Origin: *"
		
		// Update the headers
		options.headers	= _.extend({
			'X-Auth-Token':	scope.token.id
		}, options.headers);
		
		curl.request({
			url:		scope.regionData.publicURL+'/'+options.container,
			method:		'POST',
			headers:	options.headers
		}, function (err, stdout, meta) {
			
			if (err) {
				callback({
					error:		true,
					message:	err
				});
			} else {
				callback(stdout);
			}
		});
	});
}
cfcors.prototype.corsContainer = function(options, callback) {
	var scope = this;
	
	options = _.extend({
		container:	''
	}, options);
	
	this.setCustomHeaders({
		container:	options.container,
		headers:	{
			'X-Container-Meta-Access-Control-Allow-Origin': '*'
		}
	}, callback);
}

module.exports = cfcors;
