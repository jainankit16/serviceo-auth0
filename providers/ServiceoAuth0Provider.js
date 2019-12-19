'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class ServiceoAuth0Provider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    this.app.singleton('Serviceo/Auth0', () => {
      const Config = this.app.use('Adonis/Src/Config')
      const ServiceoCore = require('../src/ServiceoAuth0')
      return new ServiceoCore(Config)
    })
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot() {
    //
  }
}

module.exports = ServiceoAuth0Provider
