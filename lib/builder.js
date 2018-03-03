const TrackConfig = require('track-config');
const TrackDSL    = require('track-dsl');
const TrackModel  = require('track-model');
const TrackView   = require('track-view');

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
      'event':     {func: this._instance._assignGlobalEvent, binding: this._instance},
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
   * @param {TrackView} name name of TrackView class.
   */
  _appendView(name) {
    const ViewClass = TrackConfig.loader(`views/${name}`);

    if (!(ViewClass.prototype instanceof TrackView)) {
      throw new Error(`${ViewClass} is not TrackView.`);
    }

    if (!this._instance._views) {
      this._instance._views = [];
    }

    this._instance._views.push(new ViewClass(this._instance));
  }

  /**
   * Set ViewModel.
   * @param {TrackModel} name name of ViewModel class.
   */
  _setViewModel(name) {
    const ViewModelClass = TrackConfig.loader(`view_models/${name}`);

    if (!(ViewModelClass.prototype instanceof TrackModel)) {
      throw new Error(`${ViewModelClass} is not TrackModel.`);
    }

    this._instance._vmclass = ViewModelClass;
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
