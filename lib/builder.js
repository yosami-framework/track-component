const TrackDSL = require('track-dsl');

/**
 * A base class.
 */
class Builder {
  /**
   * Initialize
   * @private This method is only used internally by Builder.
   * @param {TrackComponent} instance Component instance.
   */
  constructor(instance) {
    this._instance = instance;
    this._defineDSL();
  }

  /**
   * Define DSL.
   * @private
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
   * @private
   * @param {string} name Name.
   */
  _setName(name) {
    this._instance._name = name;
  }

  /**
   * Append TrackView.
   * @private
   * @param {TrackView} name name of TrackView class.
   */
  _appendView(name) {
    this._instance._viewNames.push(name);
  }

  /**
   * Build model from DSL.
   * @private
   */
  _build() {
    this._instance.definers.forEach((definer) => {
      this.dsl.evaluate(definer);
    });

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
