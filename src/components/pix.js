import { Toast } from 'bootstrap'

export default {
  props: [
    'pixUrl',
    'pixQrCode'
  ],
  methods: {
    inputOnClick (event) {
      const el = event.srcElement
      el.select()
      el.setSelectionRange(0, el.value.length)
      this.copyPix()
    },
    copyPix () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.pixUrl)
        const toast = new Toast(document.getElementById('liveToast'))
        toast.show()
      }
    }
  },
  template: `
    <div class="toast-container bottom-0 start-50 translate-middle-x p-3">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-body">
          Copiado para a área de transferência
        </div>
      </div>
    </div>

    <div
      v-if="pixQrCode"
      class="pixQRCode m-2">
      <img :src="pixQrCode" />
    </div>
    <div
      v-if="pixUrl"
      class="pixUrl m-2">
      <input
        v-model="pixUrl"
        @click="inputOnClick"
        readonly />
      <button @click="copyPix()">Copiar</button>
    </div>
  `
}
