import Rifa from './rifa'

export default {
  components: {
    Rifa
  },
  props: [],
  data () {
    return {
      rifas: [],
      rifaAtiva: null
    }
  },
  methods: {
    setRifaAtiva (url) {
      this.rifaAtiva = url
    }

  },
  async mounted () {
    this.rifas = await this.$rifaList.retrieve()
    console.log(this.rifas)
  },
  computed: {
    rifasCarregadas () {
      return this.rifas.length > 0
    }
  },
  template: `
    <div class="">

      <div class="container-fluid">
        <div class="row justify-content-between">
          <div class="col-md-2">
          <img src="https://unicorn-cdn.b-cdn.net/6498a560-0bf6-4bb7-95ce-2b28858eac9e/logo-templotabuleiro-final-01.png?" style="max-width: 100%"/>
          </div>
          <div class="col-md-2 align-self-center text-center">
            <a href="https://www.instagram.com/templodotabuleiro/">
              <button class="btn btn-outline-secondary btn-lg ">Ver resultados</button>
            </a>
          </div>

        </div>
        <hr>
      </div>

      <div class="" v-if="!rifaAtiva">
        <h1 class="text-center pt-4">Rifas Disponíveis</h1>
        <div class="d-flex align-items-center justify-content-center" v-if="!rifasCarregadas" style="height: 500px">

            <div class=""><span class="spinner-border spinner-border-sm" aria-hidden="true" style="width: 3rem; height: 3rem;"></span></div>


        </div>

        <ul style="padding-left: 0">
          <li v-for="rifa in rifas" :key="rifa[0]" style="text-align: center">
            <img v-if="rifa[2]" :src="rifa[2]" @click="setRifaAtiva(rifa[1])" style="max-width: 100%"/>
            <button v-if="!rifa[2]" class="botao-rifa" @click="setRifaAtiva(rifa[1])">{{rifa[0]}}</button>

          </li>

        </ul>
      </div>
      <div class="container-fluid" v-else>
        <button class="btn btn-outline-danger btn-lg" @click="setRifaAtiva(null)">Voltar</button>
        <rifa :url="rifaAtiva" />
      </div>

    </div>
  `
}
