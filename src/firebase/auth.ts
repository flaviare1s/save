import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type AuthError,
} from 'firebase/auth'

import { auth } from './config'

const googleProvider = new GoogleAuthProvider()

export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const registerWithEmail = async (
  name: string,
  email: string,
  password: string,
) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password)

  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() })
  }

  return credential
}

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider)
}

export const getAuthErrorMessage = (error: unknown) => {
  const code = (error as AuthError)?.code

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail ja esta em uso.'
    case 'auth/invalid-credential':
      return 'E-mail ou senha invalidos.'
    case 'auth/popup-closed-by-user':
      return 'O login com Google foi fechado antes de concluir.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente em instantes.'
    case 'auth/weak-password':
      return 'Use uma senha com pelo menos 6 caracteres.'
    default:
      return 'Nao foi possivel concluir a autenticacao.'
  }
}
