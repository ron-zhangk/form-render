import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    react(),
  ],
  build: {
    target: ['es2015', 'chrome63'], // 默认是modules,百度说是更改这个会去输出兼容浏览器，尝试没啥作用，先配置吧
  },
  base: './',
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, //注意，这一句是在less对象中，写在外边不起作用
        modifyVars: {
          //在这里进行主题的修改，参考官方配置属性
          '@primary-color': '#1DA57A',
        },
      },
    },
  },
});
