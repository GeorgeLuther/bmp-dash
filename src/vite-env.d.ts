/// <reference types="vite/client" />

interface ImportMetaEnv {

  //might use later for file store and chat stuff, or as backups if supabase goes down
  // readonly VITE_FIREBASE_API_KEY: string;
  // readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  // readonly VITE_FIREBASE_PROJECT_ID: string;
  // readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  // readonly VITE_FIREBASE_MESSAGE_SENDER_ID: string;
  // readonly VITE_FIREBASE_APP_ID: string;

  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  readonly VITE_COLLAB_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
