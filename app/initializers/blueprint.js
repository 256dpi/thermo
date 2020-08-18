export default {
  name: 'blueprint',
  initialize: function(app) {
    app.inject('route', 'blueprint', 'service:blueprint');
    app.inject('controller', 'blueprint', 'service:blueprint');
    app.inject('component', 'blueprint', 'service:blueprint');
  }
};
