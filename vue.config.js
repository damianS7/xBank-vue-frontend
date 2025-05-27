const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: ["xbank.local", "dev.xbank.local"],
    port: 8081, // o el puerto que prefieras
  },
});
