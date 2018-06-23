var argv = require('minimist')(process.argv.splice(2));
var swagger_file = argv.s;
var postman_file = argv.p;
var https = argv.hasOwnProperty('https');
var swagger_converter = require('swagger2-postman-generator');
swagger_converter
  .convertSwagger()
  .fromFile(swagger_file)
  .toPostmanCollectionFile(postman_file, {
    requestPostProcessor: (postman_request, swagger_spec) => {
      var data = {};
      var path = postman_request.url.replace('{{scheme}}://{{host}}:{{port}}','');
      var swagger_path = path.replace(/:([A-Za-z]*)/g,'{$1}');
      var swagger_method = postman_request.method.toLowerCase();      // console.log(swagger_path);
      postman_request.url = `http${https ? 's' : ''}://${swagger_spec.host}${path}`;
      if(!['post','put'].includes(swagger_method)) return;
      swagger_spec.paths[swagger_path][postman_request.method.toLowerCase()].parameters;
        .filter(parameter => parameter.in == "body")
        .forEach(parameter => {
          Object.entries(parameter.schema.properties).forEach(([param,val]) => {
            switch(val['type']) {
              case "string":
                sample_value = "string";
                break;
              case "integer":
                sample_value =  val.format == "int64" ? Math.floor(new Date() / 1000) : 0;
                break;
              case "number":
                sample_value = 1.0;
                break;
              case "array":
                if(val.items['type'] == "string") {
                  sample_value = ["string"];
                } else if (val.items['type'] == "integer") {
                  sample_value = [1];
                } else {
                  sample_value = [];
                }
                break;
              case "boolean":
              default:
                sample_value = true;
            }
            data[`${param}`] = sample_value;
          });
        });
        postman_request.rawModeData = JSON.stringify(data,null,'\t');
    }
  });
