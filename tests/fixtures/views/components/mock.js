module.exports = function($, component, pipe, _yield) {
  component.pipedData = pipe.data;
  return $('div', 'mock');
};
