<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar>
        <q-btn icon="arrow_back" flat round dense @click="router.back()" aria-label="Voltar" />
        <q-toolbar-title>
          <q-input
            dark
            borderless
            v-model="notaRef.titulo"
            class="q-ml-md"
            input-class="text-h6"
            @focus="campoFocadoRef = 'titulo'"
          >
            <template v-slot:append>
              <q-icon name="edit" size="md" />
              <q-btn
                :icon="notaRef.bloqueado ? 'lock' : 'lock_open'"
                color="primary"
                round
                @click="notaBloqueada"
              />
            </template>
          </q-input>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-pa-sm" style="height: 500px">
        <div class="relative-position fit">
          <q-input
            outlined
            v-model="notaRef.conteudo"
            type="textarea"
            label="Digite sua nota..."
            class="fit"
            input-style="height: 500px; resize: none"
            @focus="campoFocadoRef = 'conteudo'"
          />

          <q-btn
            round
            :icon="iconeBotaoGravadorRef"
            :color="corBotaoGravadorRef"
            class="absolute-bottom-right q-ma-md"
            @click="gravarNota"
          />
        </div>
      </div>
      <div
        class="fixed-bottom q-pa-md"
        style="background-color: white; box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1)"
      >
        <q-btn
          :label="notaRef.id ? 'Salvar' : 'Adicionar'"
          color="primary"
          class="full-width"
          @click="registrar"
        />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { uid, useQuasar } from 'quasar'
import { Autenticacao } from 'src/services/Autenticacao'

const autenticacao = new Autenticacao()

const $q = useQuasar()
const router = useRouter()
const route = useRoute()

const notaRef = ref({ id: 0, titulo: 'Nova Nota', conteudo: '', bloqueado: false, data: undefined })
const campoFocadoRef = ref('conteudo')
const corBotaoGravadorRef = ref('primary')
const iconeBotaoGravadorRef = ref('mic')

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const gravador = SpeechRecognition ? new SpeechRecognition() : undefined

let gravando = false
let conteudoAnterior = ''

configurarGravadorAudio()

function gravarNota() {
  if (!gravando) {
    gravador.start()
  } else {
    gravador.stop()
  }
}

function configurarGravadorAudio() {
  if (!gravador) {
    //alert('Seu navegador não suporta reconhecimento de voz.')
    return
  }

  gravador.lang = 'pt-BR'
  gravador.continuous = false
  gravador.interimResults = true

  gravador.onstart = () => {
    gravando = !gravando
    conteudoAnterior =
      (campoFocadoRef.value === 'titulo' ? notaRef.value.titulo : notaRef.value.conteudo) + ' '
    iconeBotaoGravadorRef.value = 'stop'
    corBotaoGravadorRef.value = 'red'
  }

  gravador.onend = () => {
    gravando = !gravando
    iconeBotaoGravadorRef.value = 'mic'
    corBotaoGravadorRef.value = 'primary'
  }

  gravador.onresult = (event) => {
    const transcript = event.results[0][0].transcript

    if (campoFocadoRef.value === 'titulo') {
      notaRef.value.titulo = conteudoAnterior + transcript
    } else {
      notaRef.value.conteudo = conteudoAnterior + transcript
    }
  }
}

async function notaBloqueada() {
  notaRef.value.bloqueado = !notaRef.value.bloqueado

  if (notaRef.value.bloqueado && !autenticacao.passkeySetada()) {
    await autenticacao.criarPasskey()
  } else if (!notaRef.value.bloqueado && !(await autenticacao.solicitarBiometria())) {
    notaRef.value.bloqueado = true
    $q.notify({
      type: 'warning',
      message: `Não foi possível desbloquear a nota.`,
      position: 'top',
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {
            /* ... */
          },
        },
      ],
    })
  }
}

function registrar() {
  const notas = JSON.parse(localStorage.getItem('quasar-notas')) || []

  if (notaRef.value.id == 0) {
    notaRef.value.id = uid()
    notaRef.value.data = Date.now()
    notas.push(notaRef.value)
  } else {
    const nota = notas.find((e) => e.id == notaRef.value.id)

    if (nota) {
      nota.conteudo = notaRef.value.conteudo
      nota.bloqueado = notaRef.value.bloqueado
      nota.titulo = notaRef.value.titulo
    }
  }

  localStorage.setItem('quasar-notas', JSON.stringify(notas))

  $q.notify({
    type: 'positive',
    message: `Nota salva com sucesso.`,
    position: 'top',
    actions: [
      {
        icon: 'close',
        color: 'white',
        round: true,
        handler: () => {
          /* ... */
        },
      },
    ],
  })
  router.back()
}

onMounted(() => {
  const notaParametro = route.params.nota ? JSON.parse(route.params.nota) : undefined

  if (notaParametro) notaRef.value = notaParametro
})
</script>
