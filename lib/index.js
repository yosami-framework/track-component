const Builder = require('./builder');

/**
 * A base component.
 * @example
 *  class HogeComponent extends TrackComponent {
 *    static definer() {
 *      name('hoge_component'); # Define name of model.
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
   * Return view.
   */
  view() {

  }
}

module.exports = TrackComponent;
