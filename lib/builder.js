/**
 * A base class.
 */
class Builder {
  /**
   * Initialize
   * @note This method is only used internally by Builder.
   * @param {TrackComponent} instance Component instance.
   */
  constructor(instance) {
    this._instance = instance;
    this.definer = instance.instance.definer;
    if (!this.definer) {
      throw new Error(`${instance.constructor.name}.definer is undefined.`);
    }

    this._defineDSL(instance);
  }

  /**
   * Define DSL.
   * @param {TrackViewModel} instance Instance of model.
   */
  _defineDSL(instance) {
    this.dsl = new TrackDSL({
      'name': {func: this._setName, binding: this},
    });
  }

  /**
   * Set component name.
   * @param {string} value Name.
   */
  _setName(value) {
    this._instance._name = 'value';
  }

  /**
   * Build model from DSL.
   */
  _build() {
    this.dsl.evaluate(this.definer);

    if (!this._instance._name) {
      throw new Error('Component name is undefined. A definer must define `name("component_name")`.');
    }
  }

  /**
   * Build model from DSL.
   * @param {TrackComponent} component Component instance.
   */
  static build(component) {
    (new Builder(component))._build();
  }
}

module.exports = Builder;
