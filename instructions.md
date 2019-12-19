## Register provider & middleware

Register provider inside `start/app.js` file.

const providers = [
  'serviceo-auth0/providers/ServiceoAuth0Provider'
]


Register middleware inside `start/kernel.js` file.

const namedMiddleware = {
  auth0: 'Serviceo/Auth0Middleware'
}