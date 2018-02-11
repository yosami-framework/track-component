const TrackDSL       = require('track-dsl');
const TrackView      = require('track-view');
const TrackViewModel = require('track-view-model');

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
      'name':      {func: this._setName, binding: this},
      'views':     {func: this._appendView, binding: this},
      'viewmodel': {func: this._setViewModel, binding: this},
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
   * @param {TraciView} ViewClass TraciView class.
   */
  _appendView(ViewClass) {
    if (!(ViewClass.prototype instanceof TrackView)) {
      throw new Error(`${ViewClass} is not TrackView.`);
    }

    if (!this._instance._views) {
      this._instance._views = [];
    }

    this._instance._views.push(new ViewClass(this._instance));
  }

  /**
   * Set TrackViewModel.
   * @param {TrackViewModel} ViewModelClass TraciViewModel class.
   */
  _setViewModel(ViewModelClass) {
    if (!(ViewModelClass.prototype instanceof TrackViewModel)) {
      throw new Error(`${ViewModelClass} is not TrackViewModel.`);
    }
    this._instance._vm = new ViewModelClass();
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
