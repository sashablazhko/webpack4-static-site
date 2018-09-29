let WellcomeComponent = Vue.component('WellcomeComponent', {
  name: 'WellcomeComponent',
  data: function() {
    return {
      message: 'WellcomeComp',
    };
  },
  template: `
  <div>
    <h1>Hello form {{ message }}</h1>
  </div>`,
});

let vm = new Vue({
  el: '#app',
  data: {
    cart: [{ price: 1000, cnt: 2 }, { price: 800, cnt: 3 }],
    txt: 'test',
  },
  computed: {
    cartTotal() {
      return this.cart.reduce((acc, cur) => acc + cur.price * cur.cnt, 0);
    },
  },
});

let test = () => console.log('test');

// module.exports = { vm, test };
export { vm, test };
