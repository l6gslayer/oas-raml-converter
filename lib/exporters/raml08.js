const _ = require('lodash'),
    RAML = require('./baseraml'),
    jsonHelper = require('../utils/json');

function RAML08() {}
RAML08.prototype = new RAML();

RAML08.prototype.version = function() {
    return '0.8';
};

RAML08.prototype.mapMediaType = function(consumes, produces) {
  let mediaTypes = [];
  if (consumes && consumes.length > 0) {
    mediaTypes = consumes;
  }

  if (_.isArray(produces)) {
    mediaTypes = mediaTypes.concat(produces);
  }
  mediaTypes = _.uniq(mediaTypes);

  return mediaTypes.length ? mediaTypes[0]:null;
};

RAML08.prototype.mapAuthorizationGrants = function(flow) {
    let ag = [];
    switch (flow) {
        case 'implicit':
            ag = ['token'];
            break;
        case 'password':
            ag = ['credentials'];
            break;
        case 'application':
            ag = ['owner'];
            break;
        case 'accessCode':
            ag = ['code'];
            break;
    }
    return ag;
};

RAML08.prototype.mapRequestBodyForm = function(bodyData) {
    let body = {
        formParameters: bodyData.properties
    };
    if (bodyData.required && bodyData.required.length > 0) {
        for (let i in bodyData.required) {
            if (!bodyData.required.hasOwnProperty(i)) continue;
            let requiredParam = bodyData.required[i];
            if (body['formParameters'][requiredParam]) {
                body['formParameters'][requiredParam].required = true;
            }
        }
    }

    return body;
};

RAML08.prototype.mapBody = function(bodyData, type) {
    let body = {
        schema: jsonHelper.format(this.convertRefFromModel(jsonHelper.parse(bodyData.body)))
    };

    let example = jsonHelper.format(bodyData.example);
    if (!_.isEmpty(example)) {
        body.example = example;
    }

    return body;
};

RAML08.prototype.addSchema = function(ramlDef, schema) {
    ramlDef.schemas = schema;
};

RAML08.prototype.mapSchema = function(slSchemas) {  let results = [];
    for (let i in slSchemas) {
        if (!slSchemas.hasOwnProperty(i)) continue;
        let schema = slSchemas[i];
        let resultSchema = {};
        resultSchema[schema.NameSpace] = jsonHelper.format(schema.Definition);
        results.push(resultSchema);
    }
    return results;
};

RAML08.prototype.description = function(ramlDef, project) {
	ramlDef.documentation = [{
	  title: project.Name,
	  content: project.Description
	}];
};

RAML08.prototype.getApiKeyType = function () {
	return 'x-api-key';
};

RAML08.prototype.mapSecuritySchemes = function(securitySchemes) {
	return _.map(securitySchemes, function(v, k) {
		let m = {};
		m[k] = v;
		return m;
	});
};

RAML08.prototype.setMethodDisplayName = function(method, displayName) {};

RAML08.prototype.initializeTraits = function() {
	return [];
};

RAML08.prototype.addTrait = function(id, trait, traits) {
	let newTrait = {};
	newTrait[_.camelCase(id)] = trait;
	traits.push(newTrait);
};

module.exports = RAML08;