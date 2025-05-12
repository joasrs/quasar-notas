import notificacaoService from './notificacaoService'

function passkeySetada() {
  return !!localStorage.getItem('quasar-notas-passkey')
}

async function solicitarBiometria() {
  if (!window.PublicKeyCredential) {
    notificacaoService.notificar('Navegador não suporta biometria.', 'negative')
    return false
  }
  try {
    return await verificarPasskey()
  } catch (err) {
    console.log(err)
    notificacaoService.notificar('Autenticação cancelada ou falhou.', 'warning')
    return false
  }
}

async function criarPasskey() {
  if (!navigator.credentials || !navigator.credentials.create || !navigator.credentials.get) {
    notificacaoService.notificar(
      'Seu navegador não suporta autenticação Web Authentication API',
      'warning',
    )
    return false
  }

  let credencial = await navigator.credentials.create({
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

  localStorage.setItem('quasar-notas-passkey', JSON.stringify(credencial))
}

async function verificarPasskey() {
  try {
    const credencial = restaurarCredential()
    let credenciais = await navigator.credentials.get({
      publicKey: {
        challenge: window.crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [
          {
            type: 'public-key',
            id: credencial.rawId,
          },
        ],
      },
    })
    return !!credenciais
  } catch (err) {
    console.log(err)
    return false
  }
}

function base64urlToArrayBuffer(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const padLength = 4 - (base64.length % 4)
  const padded = base64 + '='.repeat(padLength === 4 ? 0 : padLength)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

function restaurarCredential() {
  const data = JSON.parse(localStorage.getItem('quasar-notas-passkey'))

  return {
    id: data.id,
    type: data.type,
    rawId: base64urlToArrayBuffer(data.rawId),
    authenticatorAttachment: data.authenticatorAttachment,
    response: {
      attestationObject: base64urlToArrayBuffer(data.response.attestationObject),
      authenticatorData: base64urlToArrayBuffer(data.response.authenticatorData),
      clientDataJSON: base64urlToArrayBuffer(data.response.clientDataJSON),
      publicKey: base64urlToArrayBuffer(data.response.publicKey),
      publicKeyAlgorithm: data.response.publicKeyAlgorithm,
      transports: data.response.transports,
    },
    clientExtensionResults: data.clientExtensionResults,
  }
}

export default { passkeySetada, solicitarBiometria, criarPasskey }
