
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';

/** 
 * Iniciate anonymous sign-in. 
 */
export async function initiateAnonymousSignIn(authInstance: Auth): Promise<UserCredential> {
  try {
    return await signInAnonymously(authInstance);
  } catch (error: any) {
    console.error("Error en Sign-In Anónimo:", error.code, error.message);
    throw error;
  }
}

/** Initiate email/password sign-up. */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  try {
    return await createUserWithEmailAndPassword(authInstance, email, password);
  } catch (error: any) {
    console.error("Error en Registro:", error.code, error.message);
    if (error.code === 'auth/operation-not-allowed') {
      alert("El registro con email/contraseña no está habilitado en Firebase Console.");
    }
    throw error;
  }
}

/** Initiate email/password sign-in. */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(authInstance, email, password);
  } catch (error: any) {
    console.error("Error en Inicio de Sesión:", error.code, error.message);
    throw error;
  }
}

/** Initiate Google sign-in. */
export async function initiateGoogleSignIn(authInstance: Auth): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  // Forzamos la selección de cuenta para evitar bucles automáticos fallidos
  provider.setCustomParameters({ prompt: 'select_account' });
  
  try {
    return await signInWithPopup(authInstance, provider);
  } catch (error: any) {
    console.error("Error en Google Sign-In:", error.code, error.message);
    if (error.code === 'auth/operation-not-allowed') {
      console.error("El proveedor de Google no está habilitado en Firebase Console.");
    }
    throw error;
  }
}
