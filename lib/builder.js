const TrackDSL = require('track-dsl');

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
    this.definer = instance.constructor.definer;
    if (!this.definer) {
      throw new Error(`${instance.constructor.name}.definer is undefined.`);
    }

    this._defineDSL();
  }

  /**
   * Define DSL.
   */
  _defineDSL() {
    this.dsl = new TrackDSL(this._instance, {
      'name':  {func: this._setName, binding: this},
      'event': {func: this._instance._bindGlobalEvent, binding: this._instance},
      'views': {func: this._appendView, binding: this},
    });
  }

  /**
   * Set component name.
   * @param {string} name Name.
   */
  _setName(name) {
    this._instance._name = name;
  }

  /**
   * Append TrackView.
   * @param {TrackView} name name of TrackView class.
   */
  _appendView(name) {
    this._instance._viewNames.push(name);
  }

  /**
   * Build model from DSL.
   */
  _build() {
    this.dsl.evaluate(this.definer);

    if (!this._instance._name) {
      throw new Error('Component name is undefined. A definer must define `name("components/name")`.');
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
