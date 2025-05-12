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
            borderless
            v-model="notaRef.conteudo"
            type="textarea"
            placeholder="Digite sua nota..."
            class="fit"
            input-style="height: 500px; resize: none; font-size: 1.3em"
            @focus="campoFocadoRef = 'conteudo'"
          />

          <q-btn
            round
            :icon="iconeBotaoGravadorRef"
            :color="corBotaoGravadorRef"
            size="lg"
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
import { uid } from 'quasar'
import notificacaoService from 'src/services/notificacaoService'
import autenticacaoService from 'src/services/autenticacaoService'

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
    notificacaoService.notificar('Seu navegador não suporta reconhecimento de voz.', 'warning')
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

  if (notaRef.value.bloqueado && !autenticacaoService.passkeySetada()) {
    await autenticacaoService.criarPasskey()
  } else if (!notaRef.value.bloqueado && !(await autenticacaoService.solicitarBiometria())) {
    notaRef.value.bloqueado = true
    notificacaoService.notificar('Não foi possível desbloquear a nota.', 'warning')
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

  notificacaoService.notificar('Nota salva com sucesso.', 'positive')
  router.back()
}

onMounted(() => {
  const notaParametro = route.params.nota ? JSON.parse(route.params.nota) : undefined

  if (notaParametro) notaRef.value = notaParametro
})
</script>
