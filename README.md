# Swagger-to-Postman Converter
This nodejs app accepts a valid Swagger 2.0 spec and converts it to a Postman collection for importing into Postman. In particular, it generates sample request bodies for all POST and PUT requests.

## Using the Converter

1. Install packages
```
npm install
```

2. Run script with options

- `-s` path/to/swagger/json
- `-p` path/to/save/postman/collection
- `--https` Use HTTPS in URL
```
node stp.js -s ~/sample_swagger.json -p ~/sample-postman.json --https
```
