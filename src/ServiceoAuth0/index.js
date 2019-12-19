"use strict";

const jwt = require("jsonwebtoken");
const util = require("util");
const Env = use("Env");
const Logger = use("Logger");
const ServiceoCore = use("Serviceo/Core");
// const AUTH0_SECRET = Env.get("AUTH0_SECRET");
const AUTH0_SECRET = "-----BEGIN CERTIFICATE-----\nMIIDBzCCAe+gAwIBAgIJRFUrzLGG8pfVMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV\nBAMTFnNlcnZpY2VvLWRldi5hdXRoMC5jb20wHhcNMTkwMjA3MDQ0ODI0WhcNMzIx\nMDE2MDQ0ODI0WjAhMR8wHQYDVQQDExZzZXJ2aWNlby1kZXYuYXV0aDAuY29tMIIB\nIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAysehE9DLsTpPT3onoNXsBSMH\nbx5t8c9xPzAfkdp3HC3T77VSfEZBZYSMMfHn1gJD6Xqq6THza+Fk9LzG3tnuzkw+\nk/S9P0RifOup1WY2XxIEDBQNYitgUXZlOpCDHwU2KeaVC+HPXQtxTX9qSDSSnS1A\n+/5dGFVNY0HX2AwkyQupaomRBH5Yem09JG9WbyDXT5TZYdBDudBl7Pg9+eUL20C/\nSHIxnk68OMBw9C15oQz7o7BSt6lVUVcjD+DRBZm5pptIciIt8EABrICca6xAZuS1\nzKNfPo3SeOO+EqZ8Ysyi70rlvBlD5NYqgQFXfmBNR5Cu6HThs+C+ATu7MIxHkwID\nAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTzZfoKouol1g1OBkmk\n8iOZX3n5qzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAHZKL3zV\n8lNLLeoTbvLgAqhrWEofFPdNQowauIvDCB1uz4+Puk89f8NF/+pjb/UqXsMlBZQK\nf+i6v9t4o6+MUPVB7YBD7krqN7HnGEE/epD5e/vV41k+kVEVl7/QqdhlJ+9UWTgl\nR67hNhMWX9x0Lzb1N2Qx2SxiBl4TDDVbW5axr4HvUgGJEV0nsQfAJjMMvjMMpD0P\nuPiM7Q0zcWHPx7I75INSw5TdNWhhh+5NC8uJYCC/9IQS0CM9iWU/EUNNv2xuVhpV\n3PUqpjmObk4nrkPfC1Dxpm47LFVAKzVKXfRFD5dJUMT0x3Tjyh/wskWhnv+9Kh9+\njXQURolaKEG16oM=\n-----END CERTIFICATE-----"
const verifyToken = util.promisify(jwt.verify);

class ServiceoAuth0 {
  async handle({ request, response }, next) {
    const auth = request.header("authorization");

    if (!auth) {
      // TODO: Fix the error message and send a better formatted
      // and standard response
      const errorMessage = { message: `No authentication token provided` };
      Logger.debug("No authentication token provided for request");
      return response.status(401).send(errorMessage);
    }

    const token = auth.replace("Bearer ", "");

    // Verify if valid using Auth0
    try {
      const results = await verifyToken(token, AUTH0_SECRET);
      request.authToken = results;

      // Let get the user details as well
      const userInfo = await ServiceoCore.getUserBySfdcId(results['https://den.serviceo.me/']);

      if (userInfo && userInfo.id) {
        request.userInfo = userInfo
      }
    } catch ({ name, message }) {
      if (name === "TokenExpiredError") {
        const errorMessage = { message: `Authentication token expired` };
        Logger.debug("Expired authentication token provided for request");
        return response.status(401).send(errorMessage);
      }
      const errorMessage = { message: `Invalid authentication token provided` };
      Logger.debug("Invalid authentication token provided for request");
      Logger.debug(token);
      Logger.debug(message);
      return response.status(401).send(errorMessage);
    }

    await next();
  }
}

module.exports = ServiceoAuth0;
