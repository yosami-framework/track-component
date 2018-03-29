const Builder     = require('./builder');
const TrackConfig = require('track-config');

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
class TrackComponent {
  /**
   * Initialize
   * @param {vnode} vnode Mithril vnode.
   */
  constructor(vnode) {
    this._events = [];
    this._viewNames = [];
    this._vnode = vnode;

    Builder.build(this);
  }

  /**
   * Get attributes.
   */
  get attrs() {
    return this.vnode.attrs;
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
      this.vnode.state._vm = new ViewModelClass();
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
    // nothing
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
  }

  /**
   * @note Mithril.js lifecycle.
   */
  onbeforeremove() {
    this._unbindGlobalEvents();
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
    const pipe = {};

    let _yield = null;
    for (let i = this.views.length - 1; i >= 0; --i) {
      _yield = this.views[i](this, pipe, _yield);
    }
    return _yield;
  }

  /**
   * Bind global event.
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
   * Unbind global event.
   */
  _unbindGlobalEvents() {
    if (process.browser) {
      for (let i = 0; i < this._events.length; ++i) {
        const e = this._events[i];
        global.removeEventListener(e.name, e.func);
      }
    }
  }
}

module.exports = TrackComponent;
