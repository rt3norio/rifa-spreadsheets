import pixBuilder from '../pixBuilder'
import { verboseTicketNumbers } from '../utils'
import { Modal } from 'bootstrap'

export default {
  props: [
    'data',
    'url'
  ],
  data () {
    return {
      name: '',
      phoneNumber: '',
      email: '',
      payData: null,
      pixURL: null,
      pixQrCode: null,
      registering: false,
      modal: null,
    }
  },
  methods: {
    async register () {
      const ticketNumbers = this.data.ticketNumbers
      console.log('ticket numbers')
      console.log(ticketNumbers)
      this.payData = {
        ticketNumbers,
        name: this.name,
        phoneNumber: this.phoneNumber,
        email: this.requiredParams.includes('email') ? this.email : undefined
      }
      if (this.data.config.payment.key === 'bc') {
        const {
          pixURL,
          pixQrCode
        } = await pixBuilder(
          this.data.config.pixKey,
          this.data.config.pixKeyOwnerName,
          this.data.config.pixKeyOwnerCity,
          this.data.config.ticketPrice * ticketNumbers.length,
          this.pixMessage
        )
        this.pixURL = pixURL
        this.pixQrCode = pixQrCode
      }
      this.registering = true
      this.$rifa.setUrl(this.url)
      const result = await this.$rifa.register(this.payData)
      if (this.data.config.payment.key !== 'bc') {
        this.pixURL = result.invoice.pixURL
        this.pixQrCode = result.invoice.pixQrCode
      }
      this.registering = false
    },
    finish () {
      this.payData = null
      this.pixURL = null
      this.pixQrCode = null
      this.registering = false
      this.$emit('finished')
    }
  },
  computed: {
    pixMessage () {
      return `${this.data.config.title} bilhetes: ${this.payData.ticketNumbers}`
    },
    ticketNumbersVerbose () {
      return verboseTicketNumbers(this.data.ticketNumbers)
    },
    totalPriceVerbose () {
      return (this.data.ticketNumbers.length * this.data.config.ticketPrice).toFixed(2).replace('.', ',')
    },
    requiredParams () {
      return this.data.config.payment.requiredParams
    }
  },
  mounted () {
    this.modal = new Modal(document.getElementById('payModal'),{backdrop: 'static', keyboard: false})
    this.modal.show()
  },
  unmounted () {
    this.modal.hide()
  },
  template: `
    <!-- Modal -->
    <div class="modal fade" id="payModal" tabindex="-1" role="dialog" aria-labelledby="payModalTitle"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="payModalTitle">Pague com Pix e clique em finalizar</h5>
          </div>
          <div class="modal-body">

            <div v-if="payData">
              <pix
                class="p-2"
                v-if="pixURL && pixQrCode"
                :pix-url="pixURL"
                :pix-qr-code="pixQrCode"/>
              <p v-else>Gerando cobrança Pix...</p>
              <whatsapp-notify
                v-if="data.config.whatsapp"
                :phone-number="data.config.whatsapp"
                :ticket-numbers="payData.ticketNumbers"
                :message="data.config.whatsappMessage"/>
              <div v-if="registering">Registrando pedido...</div>
            </div>
            <form
              id="payForm"
              v-else
              class=""
              @submit.prevent="register()">
              <p><strong>Pague pelos bilhetes:</strong></p>
              <p>{{ ticketNumbersVerbose }}</p>
              <div class="form-group">
                <label for="name">Nome:</label>
                <input
                  class="form-control"
                  id="name"
                  v-model="name"
                  type="text"
                  required/>
              </div>
              <div class="form-group">
                <label for="phone">Telefone:</label>
                <input
                  class="form-control"
                  id="phone"
                  v-model="phoneNumber"
                  type="text"
                  required/>
              </div>
              <div v-if="requiredParams.includes('email')">
                <label>E-mail:</label>
                <input
                  v-model="email"
                  type="email"
                  required/>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              v-if="payData"
              type="button" class="btn btn-primary"
              @click="finish()"
              :disabled="registering">Finalizar
            </button>
            <div class="" v-else>
              <button type="submit" form="payForm" class="btn btn-primary">Pagar R\${{ totalPriceVerbose }} por Pix</button>
              <button type="button" class="btn btn-secondary m-1" data-dismiss="modal" @click="finish()">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}
