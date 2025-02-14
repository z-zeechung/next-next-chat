import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.zeechung.nnchat',
  appName: 'N²CHAT',
  webDir: 'artifacts/static',
  android: {
    path: "src-cap-android",
    buildOptions: {
      keystorePath: "android.nnchat.keystore.jks",
      keystorePassword: "ciallo~",
      keystoreAlias: "key0",
      keystoreAliasPassword: "ciallo~",
      releaseType: "APK"
    }
  },
  plugins:{
    CapacitorHttp:{
      enabled: true,
    }
  }
};

export default config;
