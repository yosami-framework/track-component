const t               = require('track-spec');
const TrackComponent  = require('../lib/index.js');

t.describe('TrackComponent', () => {
  let mockComponent = null;
  let mockVnode     = null;

  t.beforeEach(() => {
    mockVnode = {};
    mockComponent = new (class extends TrackComponent {
      /**
       * Definitions of model.
       */
      static definer() {
        name('mock');
      }
    })(mockVnode);
  });

  t.describe('#vnode', () => {
    const subject = (() => mockComponent.vnode);

    t.it('Return vnode', () => {
      subject();
      t.expect(subject()).equals(mockVnode);
    });
  });
});
