const t               = require('track-spec');
const TrackView       = require('track-view');
const TrackComponent  = require('../lib/index.js');

t.describe('TrackComponent', () => {
  let mockComponent = null;
  let mockVnode     = null;
  let mockViewClass = null;

  t.beforeEach(() => {
    mockVnode = {};
    mockViewClass = (class extends TrackView {
      /**
       * Render view.
       * @param {object} _yield object.
       * @return {array} mock
       */
      render(_yield) {
        return [_yield];
      }
    });

    mockComponent = new (class extends TrackComponent {
      /**
       * Definitions of model.
       */
      static definer() {
        name('mock_component');
        views(this.mockViewClass);
      }

      /**
       * Return mockViewlClass
       */
      get mockViewClass() {
        return mockViewClass;
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

  t.describe('#name', () => {
    const subject = (() => mockComponent.name);

    t.it('Return name', () => {
      subject();
      t.expect(subject()).equals('mock_component');
    });
  });

  t.describe('#oninit', () => {
    t.it('Defined', () => {
      t.expect(mockComponent.oninit instanceof Function).equals(true);
    });
  });

  t.describe('#oncreate', () => {
    t.it('Defined', () => {
      t.expect(mockComponent.oncreate instanceof Function).equals(true);
    });
  });

  t.describe('#onupdate', () => {
    const subject = (() => mockComponent.onupdate(newVnode));
    let newVnode = null;

    t.beforeEach(() => {
      newVnode = {};
    });

    t.it('Update vnode', () => {
      t.expect(mockComponent.vnode).equals(mockVnode);
      subject();
      t.expect(mockComponent.vnode).equals(newVnode);
    });
  });

  t.describe('#onbeforeremove', () => {
    t.it('Defined', () => {
      t.expect(mockComponent.onbeforeremove instanceof Function).equals(true);
    });
  });

  t.describe('#onremove', () => {
    t.it('Defined', () => {
      t.expect(mockComponent.onremove instanceof Function).equals(true);
    });
  });

  t.describe('#onbeforeupdate', () => {
    const subject = (() => mockComponent.onbeforeupdate());

    t.it('Return true', () => {
      t.expect(subject()).equals(true);
    });
  });

  t.describe('#view', () => {
    const subject = (() => mockComponent.view());

    t.it('Render view', () => {
      t.expect(subject()).deepEquals([null]);
    });
  });
});
