import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Ensure this matches the port Vite is running on
    open: true, // Automatically opens the browser
  },
});

