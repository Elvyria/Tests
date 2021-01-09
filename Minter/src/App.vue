<template>
  <div>
    <div id="address-wrap">
      <input
        id="address"
        v-model="address"
        placeholder="Address - Mx..."
        @input="updateValid()"
      />
      <button
        id="button-request"
        ref="go"
        :disabled="!validAddress"
        :class="[validAddress ? 'button-active' : 'button-inactive']"
        @click="pushAddress"
      >
        Go
      </button>
    </div>
    <ValidatorList
      id="validators"
      :validators="validators"
    />
  </div>
</template>

<script>
import ValidatorList from "./components/ValidatorList.vue"

import { isAddress } from "./main.js"
import { getAllDelegations } from "./api/explorer.js"

export default {
  name: "App",

  mounted() {
    this.checkParams()
  },

  data() {
    return {
      address: "",
      validAddress: false,
      validators: [],
    }
  },

  components: {
    ValidatorList,
  },

  methods: {
    checkParams() {
      const address = this.$route.params.address

      if (address && isAddress(address)) {
        this.address = address.trim()
        this.validAddress = true
        this.requestValidators()
      }
    },

    updateValid() {
      this.validAddress = isAddress(this.address)
      if (this.validAddress)
        this.address = this.address.trim()
    },

    pushAddress() {
      if (isAddress(this.address))
        this.$router.push("/" + this.address)
    },

    requestValidators() {
      this.validators = getAllDelegations(this.address)
    },
  },

  watch: {
    $route() {
      this.checkParams()
    }
  },
}
</script>

<style>

a {
  text-decoration: none
}

body {
  color: rgb(185, 185, 185);
  background-color: #030303;
  margin: auto;
  font-family: IBMPlexSans, Arial, sans-serif;
}

#validators {
  width: max-content;
  margin: auto;
  margin-top: 20px;
  max-width: 96%;
}

#address-wrap {
  display: flex;
  height: 50px;
  width: max-content;
  margin: auto;
  margin-top: 10px;
}

#address {
  padding: 0 10px;
  width: 300px;
  height: 100%;
  border: none;
}

#address:focus {
  border: none;
}

#button-request {
  height: 100%;
  width: 50px;
  transition-duration: 100ms;
}

button {
  border: none;
  outline: none;
}

input {
  outline: none;
}

.status-ok {
  color: lime;
}

.status-err {
  color: red;
}

.button-inactive {
  color: #777;
  background-color: #aaa;
}

.button-active {
  color: white;
  font-size: 1.2em;
  background-color: #D15C22;
}

.validator-row {
  height: 70px;
  display: flex;
  align-items: center;
  margin-top: 5px;
  padding: 10px;
  padding-left: 20px;
  background-color: rgb(26, 26, 27);
  border-image-source: linear-gradient(90deg,#ff8a00,#e52e71);
  border-image-slice: 1;
  border-bottom: 1px solid;
}

.validator-group {
  position: relative;
  z-index: 1;
}

.validator-group:hover {
  background-color: rgb(35, 35, 35);
}

.validator-group-expanded {
  justify-content: space-between;
}

.validator-group-row {
  border: none;
  margin-top: 0;
}

.validator-group-row > .validator-name-wrap {
  flex-shrink: 4;
  min-width: 100px;
}

.validator-name-wrap {
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.validator-coin-wrap {
  width: 400px;
  min-width: 70px;
  position: relative;
  flex-shrink: 2;
}

.validator-group-row > .validator-coin-wrap::before {
  content: "";
  position: absolute;
  top: -80px;
  left: -210px;
  border-left: 1px solid;
  border-bottom: 1px solid;
  border-image-source: linear-gradient(90deg,#ff8a00,#e52e71);
  border-image-slice: 1;
  width: 200px;
  height: 90px;
}

@media (max-width: 800px){
  .validator-group-row > .validator-coin-wrap::before {
    left: -90px;
    width: 70px;
  }
}

.validator-value-wrap {
  width: 100px;
  min-width: 100px;
  white-space: nowrap;
  margin-left: 50px;
}

.validator-bip-value {
  color: #ff8a00;
}

.validator-icon {
  margin-right: 10px;
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

.validator-name {
  display: inline;
  vertical-align: middle;
}

.validator-key {
  width: max-content;
  display: block;
  font-size: 0.8em;
  text-overflow: ellipsis;
  padding-top: 5px;
  color: #4CAF50;
}

.validator-key:hover {
  text-decoration: underline;
}

.validator-coin {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
