require('./spec_helper');
const t              = require('track-spec');
const MockViewModel  = require('./fixtures/view_models/mock');
const TrackComponent = require('../lib/index.js');

t.describe('TrackComponent', () => {
  let mockComponent      = null;
  let mockVnode          = null;
  let mockViewClass      = null;
  let mockViewModelClass = null;

  t.beforeEach(() => {
    process.browser = true;
    global.addEventListener = t.spy(global.addEventListener);
    global.removeEventListener = t.spy(global.removeEventListener);

    mockVnode = {state: {}};
    mockComponent = new (class extends TrackComponent {
      /**
       * Definitions of model.
       */
      static definer() {
        name('mock_component');
        views('mock');
        viewmodel('mock');
        event('scroll', 'onScroll');
      }

      /**
       * Return mockViewlClass
       */
      get mockViewClass() {
        return mockViewClass;
      }

      /**
       * Return mock class.
       */
      get mockViewModelClass() {
        return mockViewModelClass;
      }

      /**
       * Scroll event handler.
       */
      onScroll() {
        //
      }
    })(mockVnode);
  });

  t.afterEach(() => {
    process.browser = false;
  });

  t.describe('#name', () => {
    const subject = (() => mockComponent.name);

    t.it('Return name', () => {
      subject();
      t.expect(subject()).equals('mock_component');
    });
  });

  t.describe('#viewmodel', () => {
    const subject = (() => mockComponent.viewmodel);

    t.it('Return ViewModel', () => {
      t.expect(subject() instanceof MockViewModel).equals(true);
    });
  });

  t.describe('#vnode', () => {
    const subject = (() => mockComponent.vnode);

    t.it('Return vnode', () => {
      t.expect(subject()).equals(mockVnode);
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
    t.beforeEach(() => {
      mockComponent._unassignGlobalEvents = t.spy();
    });

    t.it('Defined', () => {
      t.expect(mockComponent.onbeforeremove instanceof Function).equals(true);
    });

    t.it('Call #_unassignGlobalEvents', () => {
      mockComponent.onbeforeremove();
      t.expect(mockComponent._unassignGlobalEvents.callCount).equals(1);
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
      t.expect(subject()).deepEquals('mock');
    });
  });

  t.describe('#_assignGlobalEvent', () => {
    const subject = (() => mockComponent._assignGlobalEvent('hoge', 'onHoge'));

    t.beforeEach(() => {
      mockComponent.onHoge = t.spy();
      global.addEventListener = t.spy(global.addEventListener);
    });

    t.it('Call global.addEventListener', () => {
      subject();
      t.expect(global.addEventListener.callCount).equals(1);
      t.expect(global.addEventListener.args[0]).equals('hoge');

      global.addEventListener.args[1]();
      t.expect(mockComponent.onHoge.callCount).equals(1);
    });
  });

  t.describe('#_unassignGlobalEvents', () => {
    const subject = (() => mockComponent._unassignGlobalEvents());

    t.it('Call global.removeEventListener', () => {
      subject();
      t.expect(global.removeEventListener.callCount).equals(1);
      t.expect(global.removeEventListener.args[0]).equals('scroll');
    });
  });
});
