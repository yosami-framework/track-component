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
   * Get name.
   * @return {string} Component name.
   */
  get name() {
    return this._name;
  }

  /**
   * Get viewmodel.
   * @return {TrackViewModel} Viewmodel.
   */
  get viewmodel() {
    if (!this.vnode.state._vm) {
      if (!this._vmclass) {
        throw new Error('ViewModel is not existed. use `viewmodel`');
      } else {
        this.vnode.state._vm = new (this._vmclass)();
      }
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
