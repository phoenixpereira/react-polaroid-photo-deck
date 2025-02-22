import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vite.dev/config/
export default defineConfig({
      plugins: [
            ViteImageOptimizer({
                  // Optimize JPEG images
                  jpg: {
                        quality: 75, // Set a higher quality for better results (you can experiment with this)
                        progressive: true, // Enable progressive rendering for smoother image loading
                  },

                  // Optimize PNG images
                  png: {
                        quality: 80, // Adjust the quality for PNG images
                        palette: true // Reduce the number of colors used in the image (for transparency)
                  },

                  // Optimize WebP images
                  webp: {
                        quality: 80, // Set the quality for WebP images
                        lossless: false // Use lossy compression for better size reduction
                  },
            })
      ],
      build: {
            // Enable image optimization on production builds only
            minify: "esbuild" // Ensure minification to reduce size during production builds
      }
});
