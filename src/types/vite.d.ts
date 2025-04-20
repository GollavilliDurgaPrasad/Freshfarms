declare module 'vite' {
  interface UserConfig {
    plugins?: any[];
    resolve?: {
      alias?: Record<string, string>;
    };
    optimizeDeps?: {
      include?: string[];
    };
    server?: {
      port?: number;
      strictPort?: boolean;
    };
  }

  export function defineConfig(config: UserConfig): UserConfig;
}

declare module '@vitejs/plugin-react' {
  const react: () => any;
  export default react;
} 