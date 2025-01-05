const require = createRequire(import.meta.url);

import webpack from "webpack";
import { createRequire } from 'module';

const mode = process.env.BUILD_MODE ?? "standalone";
console.log("[Next] build mode", mode);

const disableChunk = !!process.env.DISABLE_CHUNK || mode === "export";
console.log("[Next] build with chunk: ", !disableChunk);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.module.rules.push({
      test: /\.raw(\..+)?$/,
      use: 'raw-loader'
    })

    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' }
    })

    if (disableChunk) {
      config.plugins.push(
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
      );
    }

    config.resolve.fallback = {
      child_process: false,
    };

    config.experiments.asyncWebAssembly = true;
    config.experiments.syncWebAssembly = true;

    // vue配置
    // config.module.rules = [{  // vue-loader应置于config.module.rules最前面
    //   test: /\.vue$/,
    //   loader: 'vue-loader'
    // }].concat(config.module.rules)
    // const { VueLoaderPlugin } = require('./private_modules/vue-loader')
    // config.plugins.push(new VueLoaderPlugin())
    
    return config;
  },
  output: mode,
  images: {
    unoptimized: mode === "export",
  },
  experimental: {
    forceSwcTransforms: true,
  },
  async headers() {
    return [
      {
        source: '/:path*service-worker:path*', // 匹配所有包含 "service-worker" 的文件
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/', // 允许根路径作用域
          },
        ],
      },
    ];
  },
};

/*const CorsHeaders = [
  { key: "Access-Control-Allow-Credentials", value: "true" },
  { key: "Access-Control-Allow-Origin", value: "*" },
  {
    key: "Access-Control-Allow-Methods",
    value: "*",
  },
  {
    key: "Access-Control-Allow-Headers",
    value: "*",
  },
  {
    key: "Access-Control-Max-Age",
    value: "86400",
  },
];

nextConfig.headers = async () => {
  return [
    {
      source: "/api/:path*",
      headers: CorsHeaders,
    },
  ];
};*/

// 有些资源文件可能路径有问题，在这重定向一下
nextConfig.rewrites = async () => {  
  return {  
      beforeFiles: [  
          {  
              source: "/:path*/ort-wasm-simd.wasm", 
              destination: "/ort-wasm-simd.wasm",  
          }
      ],  
  };  
};

`if (mode !== "export") {
  nextConfig.headers = async () => {
    return [
      {
        source: "/api/:path*",
        headers: CorsHeaders,
      },
    ];
  };

  nextConfig.rewrites = async () => {
    const ret = [
      // 有些资源文件可能路径有问题，在这重定向一下
      {
        source: "/_next/static/chunks/ort-wasm-simd.wasm",
        destination: "/ort-wasm-simd.wasm",
      },
      {
        source: "/_next/static/chunks/app/ort-wasm-simd.wasm",
        destination: "/ort-wasm-simd.wasm",
      },

      // adjust for previous version directly using "/api/proxy/" as proxy base route
      {
        source: "/api/proxy/v1/:path*",
        destination: "https://api.openai.com/v1/:path*",
      },
      {
        source: "/api/proxy/google/:path*",
        destination: "https://generativelanguage.googleapis.com/:path*",
      },
      {
        source: "/api/proxy/openai/:path*",
        destination: "https://api.openai.com/:path*",
      },
      {
        source: "/api/proxy/anthropic/:path*",
        destination: "https://api.anthropic.com/:path*",
      },
      {
        source: "/google-fonts/:path*",
        destination: "https://fonts.googleapis.com/:path*",
      },
      {
        source: "/sharegpt",
        destination: "https://sharegpt.com/api/conversations",
      },
    ];

    return {
      beforeFiles: ret,
    };
  };
}else {
  nextConfig.rewrites = async () => {  
    return {  
        beforeFiles: [  
            {  
                source: "/:path*/ort-wasm-simd.wasm", 
                destination: "/ort-wasm-simd.wasm",  
            },  
        ],  
    };  
};
}`

export default nextConfig;