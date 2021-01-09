import Vue from "vue"
import VueRouter from "vue-router"

import App from "./App.vue"

Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/:address", component: App }
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount("#app")

export function truncateMiddle(s, start, end) {
  if (start + end > s.length)
    return s

  return s.substring(0, start) + "..." + s.substring(s.length - end)
}

export function groupBy(a, key) {
  return a.reduce((storage, item) => {
    const index = storage.findIndex(group => group[0][key] === item[key])

    if (index === -1) {
      storage.push([ item ])
    } else {
      storage[index].push(item)
    }

    return storage
  }, [])
}

export function isAddress(address) {
  address = address.trim()

  if (address.length !== 40 && address.length !== 42)
    return false

  const prefix = address.substring(0, 2).toLowerCase()

  if (prefix === "mx")
    address = address.substring(2)
  else
    return false

  return isHex(address)
}

export function isHex(s) {
  const regexp = /^[0-9A-F]+$/i

  return regexp.test(s)
}
