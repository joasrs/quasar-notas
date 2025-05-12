<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Quasar Notas</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-list class="q-pa-md">
        <q-item v-for="nota in notasRef" :key="nota.id" clickable @click="abrirNota(nota)">
          <q-item-section>{{ nota.titulo }}</q-item-section>
          <div class="row items-center">
            <q-icon class="q-mr-lg" :name="nota.bloqueado ? 'lock' : 'lock_open'" />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click.stop="confirmarExclusao(nota)"
            />
          </div>
        </q-item>
      </q-list>
      <div
        class="fixed-bottom q-pa-md"
        style="background-color: white; box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1)"
      >
        <q-btn label="Adicionar" color="primary" class="full-width" to="/incluir" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import notificacaoService from 'src/services/notificacaoService'
import autenticacaoService from 'src/services/autenticacaoService'

const notasRef = ref(JSON.parse(localStorage.getItem('quasar-notas')) || [])
const router = useRouter()

async function abrirNota(nota) {
  if (nota.bloqueado) {
    const permitido = await autenticacaoService.solicitarBiometria()
    if (!permitido) return
  }

  router.push({ name: 'alterar', params: { nota: JSON.stringify(nota) } })
}

function confirmarExclusao(nota) {
  notificacaoService.perguntar(
    'Confirmar exclusão',
    'Tem certeza que deseja excluir esta nota?',
    async () => {
      if (!nota.bloqueado || (await autenticacaoService.solicitarBiometria())) {
        notasRef.value = notasRef.value.filter((n) => n.id !== nota.id)
        localStorage.setItem('quasar-notas', JSON.stringify(notasRef.value))
        notificacaoService.notificar('Nota excluída com sucesso.', 'positive')
      }
    },
  )
}
</script>
