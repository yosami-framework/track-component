const Builder = require('./builder');

/**
 * A base component.
 * @example
 *  class HogeComponent extends TrackComponent {
 *    static definer() {
 *      name('hoge'); // Define model name. **Required**
 *      views(require('./views/hoge')); // Append views.
 *      viewmodel(require('./viewmodels/hoge')); // Set viewmodel.
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
    Builder.build(this);
    this._vnode = vnode;
  }

  /**
   * Get vnode.
   * @return {vnode} Mithril vnode.
   */
  get vnode() {
    return this._vnode;
  }

  /**
   * Get name.
   * @return {string} Component name.
   */
  get name() {
    return this._name;
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
    // nothing
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
    if (!this._views) {
      throw new Error('View is not existed. use `views`');
    }

    let _yield = null;
    for (let i = this._views.length - 1; i >= 0; --i) {
      _yield = this._views[i].render(_yield);
    }
    return _yield;
  }
}

module.exports = TrackComponent;
