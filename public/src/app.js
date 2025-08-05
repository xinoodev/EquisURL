import translations from './translations.js';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'es',
  fallbackLocale: 'en',
  messages: translations,
});

const app = new Vue({
  el: '#app',
  i18n,
  data: {
    url: '',
    slug: '',
    error: '',
    formVisible: true,
    created: null,
    waiting: false,
    currentYear: new Date().getFullYear(),
    currentLanguage: 'es'
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

    detectBrowserLanguage() {
      const browserLang = navigator.language || navigator.userLanguage;
      this.currentLanguage = browserLang.startsWith('es') ? 'es' : 
                             browserLang.startsWith('en') ? 'en' : 'es';
    },

    changeLanguage() {
      document.querySelector('html').setAttribute('lang', this.currentLanguage);
      document.title = this.$t('title');
      document.querySelector('meta[name="description"]').setAttribute('content', this.$t('description'));
    },
  },
  
  created() {
    this.detectBrowserLanguage();
    this.changeLanguage();
  },

  mounted() {
    document.getElementById('currentYear').textContent = this.currentYear;
  },
});

document.addEventListener('DOMContentLoaded', app);