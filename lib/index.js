const m            = require('mithril');
const Builder      = require('./builder');
const TrackConfig  = require('track-config');
const TrackDSLBase = require('track-dsl/lib/base');
const TrackI18n    = require('track-i18n');
const ObjectHelper = require('track-helpers/lib/object_helper');

/**
 * A base component.
 * @example
 *  class HogeComponent extends TrackComponent {
 *    static definer() {
 *      name('hoge'); // Define model name. **Required**
 *      views('hoge'); // Append views.
 *      event('scroll', 'onScroll'); // Set global(window) event handler.
 *    }
 *  }
 *
 */
class TrackComponent extends TrackDSLBase {
  /**
   * Initialize
   * @param {vnode} vnode Mithril vnode.
   */
  constructor(vnode) {
    super(vnode);

    this._vnode = vnode;
    this._events = [];
    this._viewNames = [];

    this.evaluateDSL();
    if (!this._name) {
      throw new Error('Component name is undefined. A definer must define `name("components/name")`.');
    }
  }

  /**
   * Get DSL.
   * @return {object} dsl.
   */
  static dsl() {
    return Builder.dsl(this);
  }

  /**
   * Get attributes.
   * @return {object} Attributes.
   */
  get attrs() {
    return this.vnode.attrs;
  }

  /**
   * Get translator.
   * @return {TrackI18n} translator.
   */
  get i18n() {
    return this.pipe.i18n || TrackI18n;
  }

  /**
   * Get component pipe.
   * @return {object} pipe.
   */
  get pipe() {
    if (!this._pipe) {
      this._pipe = (this.attrs.pipe || {});
    }
    return this._pipe;
  }

  /**
   * Get type.
   * @return {string} Get type.
   */
  get type() {
    return 'component';
  }

  /**
   * Get name.
   * @return {string} Component name.
   */
  get name() {
    return this._name;
  }

  /**
   * Get views.
   * @return {array<TrackView>} views.
   */
  get views() {
    if (!this.vnode.state._views) {
      this.vnode.state._views = [];

      let viewmodel = null;
      try {
        viewmodel = this.vm;
      } catch (_) {
        /* NICE CATCH!!!! */
      }

      const views = this._viewNames.length < 1 ? [this.name] : this._viewNames;
      for (let i = 0; i < views.length; ++i) {
        const renderer = TrackConfig.loader(`views/${this.type}s/${views[i]}`);
        this.vnode.state._views.push(renderer.bind(viewmodel));
      }
    }
    return this.vnode.state._views;
  }

  /**
   * Get viewmodel.
   * @return {TrackViewModel} Viewmodel.
   */
  get vm() {
    if (!this.vnode.state._vm) {
      const ViewModelClass = TrackConfig.loader(`view_models/${this.type}s/${this.name}`);
      this.vnode.state._vm = new ViewModelClass({}, this.i18n);
    }
    return this.vnode.state._vm;
  }

  /**
   * Get vnode.
   * @return {vnode} Mithril vnode.
   */
  get vnode() {
    return this._vnode;
  }

  /**
   * @note Mithril.js lifecycle.
   */
  oninit() {
    this._watchAttrs();

    if (module.hot) {
      this.vnode.state._hmrHandler = ((status) => {
        if (status == 'idle') {
          this.vnode.state._views = null;
          m.redraw();
        }
      });
      module.hot.addStatusHandler(this.vnode.state._hmrHandler);
    }
  }

  /**
   * @note Mithril.js lifecycle.
   */
  oncreate() {
    // nothing
  }

  /**
   * @note Mithril.js lifecycle.
   * @param {vnode} vnode Vnode.
   */
  onupdate(vnode) {
    this._vnode = vnode;
    this._watchAttrs();
  }

  /**
   * @note Mithril.js lifecycle.
   */
  onbeforeremove() {
    this._unbindGlobalEvents();

    if (module.hot) {
      module.hot.removeStatusHandler(this.vnode.state._hmrHandler);
    }
  }

  /**
   * @note Mithril.js lifecycle.
   */
  onremove() {
    // nothing
  }

  /**
   * @note Mithril.js lifecycle.
   * @return {boolean} check next.
   */
  onbeforeupdate() {
    return true;
  }

  /**
   * Return rendered view.
   * @note Mithril.js lifecycle.
   * @return {vnode|string} view.
   */
  view() {
    const pipe          = {};
    const createElement = this._createElement.bind(this);

    let _yield = null;
    for (let i = this.views.length - 1; i >= 0; --i) {
      _yield = this.views[i](createElement, this, pipe, _yield);
    }
    return _yield;
  }

  /**
   * Bind global event.
   * @private
   * @param {string} name     Event name.
   * @param {string} funcName Function name.
   */
  _bindGlobalEvent(name, funcName) {
    if (process.browser) {
      const func = this[funcName].bind(this);
      this._events.push({name: name, func: func});
      global.addEventListener(name, func);
    }
  }

  /**
   * Create element.
   * @return {vnode} created element.
   */
  _createElement(...args) {
    const vnode = m(...args);

    if (typeof vnode.tag !== 'string') {
      vnode.attrs.pipe = this.pipe;
    }

    return vnode;
  }

  /**
   * Unbind global event.
   * @private
   */
  _unbindGlobalEvents() {
    if (process.browser) {
      for (let i = 0; i < this._events.length; ++i) {
        const e = this._events[i];
        global.removeEventListener(e.name, e.func);
      }
    }
  }

  /**
   * Watch changing attribute values.
   * @private
   */
  _watchAttrs() {
    if (this.onattrschanged) {
      const current  = this.attrs;
      const previous = this.vnode.state._attrs;

      if (!ObjectHelper.deepEqual(current, previous)) {
        this.onattrschanged(current, previous);
        this.vnode.state._attrs = ObjectHelper.deepMerge({}, current);
      }
    }
  }
}

module.exports = TrackComponent;
