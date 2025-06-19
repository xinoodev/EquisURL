const app = new Vue({
  el: '#app',
  data: {
    url: '',
    slug: '',
    error: '',
    formVisible: true,
    created: null,
    waiting: false,
  },
  methods: {
    async createUrl() {
      this.error = '';
      const response = await fetch('/url', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          url: this.url,
          slug: this.slug || undefined,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        this.formVisible = false;
        this.waiting = true;
        setTimeout(() => {
          this.waiting = false;
          this.created = `https://urls.equis.site/${result.slug}`;
        }, 3000)
      } else if (response.status === 429) {
        this.error = 'Estás enviando demasiadas solicitudes. Vuelve a intentarlo en 30 segundos.';
      } else {
        const result = await response.json();
        this.error = result.message;
      }
    },
  },
});