import { useQuasar } from 'quasar'

export class Autenticacao {
  constructor() {
    this.$q = useQuasar()
  }

  passkeySetada() {
    return !!localStorage.getItem('quasar-notas-passkey')
  }

  async solicitarBiometria() {
    if (!window.PublicKeyCredential) {
      this.$q.notify({ type: 'negative', message: 'Navegador não suporta biometria.' })
      return false
    }
    try {
      return await verificarPasskey()
    } catch (err) {
      console.log(err)
      this.$q.notify({ type: 'warning', message: 'Autenticação cancelada ou falhou.' })
      return false
    }
  }

  async criarPasskey() {
    if (!navigator.credentials || !navigator.credentials.create || !navigator.credentials.get) {
      alert('Seu navegador não suporta autenticação Web Authentication API')
      return false
    }

    let credentials = await navigator.credentials.create({
      publicKey: {
        challenge: window.crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: 'Quasar-notas', id: window.location.hostname },
        user: {
          id: new Uint8Array(16),
          name: 'usuario_padrao@teste.com',
          displayName: 'Fulano de Tal',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        timeout: 60000,
        authenticatorSelection: {
          residentKey: 'preferred',
          requireResidentKey: false,
          userVerification: 'preferred',
        },
        attestation: 'none',
        extensions: { credProps: true },
      },
    })

    localStorage.setItem('quasar-notas-passkey', JSON.stringify(credentials))
    console.log(credentials)
  }
}

async function verificarPasskey() {
  try {
    const a = JSON.parse(localStorage.getItem('quasar-notas-passkey'))
    console.log(a.rawId)
    let credenciais = await navigator.credentials.get({
      publicKey: {
        challenge: window.crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [
          {
            type: 'public-key',
            id: a.rawId,
          },
        ],
      },
    })
    console.log(credenciais)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
