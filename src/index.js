import { createApp } from 'vue/dist/vue.esm-bundler'
import rifaService from './rifaService'
import rifaListService from './rifaListService'
import rifa from './components/rifa'
import ticket from './components/ticket'
import pay from './components/pay'
import pix from './components/pix'
import whatsappNotify from './components/whatsapp-notify'
import payAction from './components/payAction'
import './sass/main.scss'
import Home from './components/home'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

const url = process.env.SCRIPT_GOOGLE_URL
const listasUrl = process.env.LIST_RIFAS_URL

const app = createApp()
app.use(rifaService, { url })
app.use(rifaListService, { listasUrl })
app.component('Rifa', rifa)
app.component('Ticket', ticket)
app.component('Pay', pay)
app.component('Pix', pix)
app.component('WhatsappNotify', whatsappNotify)
app.component('PayAction', payAction)
app.component('home', Home)
app.mount('#app')

export default app
