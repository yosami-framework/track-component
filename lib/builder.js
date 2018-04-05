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
  }

  /**
   * Return DSL
   * @private
   * @return {object} DSL.
   */
  get _dsl() {
    return {
      name:  {func: this._setName, binding: this},
      event: {func: this._instance._bindGlobalEvent, binding: this._instance},
      views: {func: this._appendView, binding: this},
    };
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
   * @param {TrackComponent} component Component instance.
   * @return {object} DSL.
   */
  static dsl(component) {
    return (new Builder(component))._dsl;
  }
}

module.exports = Builder;
