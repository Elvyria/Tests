<template>
  <div>
    <template v-for="group in groupedList">
      <div class="validator-row" :key="group[0].pub_key" :class="{ 'validator-group': isExpandable(group), 'validator-group-expanded': isExpanded(group) }" @click="toggleGroup(group)">
        <div class="validator-name-wrap">
          <img v-if="getMeta(group[0], 'icon_url')" class="validator-icon" :src="getMeta(group[0], 'icon_url')" alt=""/>
          <div class="validator-name">{{ getMeta(group[0], "name") }}</div>
          <a class="validator-key" :href="getValidatorLink(group[0].pub_key)" target="_blank">{{ getShortKey(group[0].pub_key) }}</a>
          <div class="validator-key"></div>
        </div>
        <div v-if="!isExpanded(group)" class="validator-coin-wrap">
          <div class="validator-coin">{{ getCoin(group) }}</div>
        </div>
        <div class="validator-value-wrap">
          <div class="validator-value">{{ sumValue(group) }}</div>
        </div>
      </div>
      <template v-if="isExpandable(group) && isExpanded(group)">
        <div class="validator-row validator-group-row" v-for="validator in group" :key="validator.pub_key + validator.coin">
          <div class="validator-name-wrap">
            <div class="validator-name"></div>
          </div>
          <div class="validator-coin-wrap">
            <div class="validator-coin">{{ validator.coin }}</div>
          </div>
          <div class="validator-value-wrap">
            <div class="validator-value">{{ getValue(validator.value) }}</div>
            <div class="validator-bip-value">BIP {{ getValue(validator.bip_value) }}</div>
          </div>
        </div>
      </template>
    </template>

    <!-- First version with table, hard to style, no advantages, just looks like a "RIGHT" thing for the task. -->

    <!-- <table id="validator-table"> -->
      <!-- <thead> -->
        <!-- <tr> -->
          <!-- <th>Validator</th> -->
          <!-- <th>Coin</th> -->
          <!-- <th>Value</th> -->
        <!-- </tr> -->
      <!-- </thead> -->
      <!-- <tbody> -->
        <!-- <template v-for="group in groupedList"> -->
          <!-- <tr class="validator-row" :key="group[0].pub_key"> -->
            <!-- <td> -->
              <!-- <img class="validator-icon" :src="getMeta(group[0], 'icon_url')" alt="" /> -->
              <!-- <div class="validator-name">{{ getMeta(group[0], "name") }}</div> -->
              <!-- <div class="validator-key">{{ group[0].pub_key }}</div> -->
            <!-- </td> -->
            <!-- <td> -->
              <!-- <div>{{ getCoin(group) }}</div> -->
            <!-- </td> -->
            <!-- <td> -->
              <!-- <div>{{ sumValue(group) }}</div> -->
            <!-- </td> -->
            <!-- <td> -->
              <!-- <div></div> -->
            <!-- </td> -->
          <!-- </tr> -->
          <!-- <template v-if="group.length > 1"> -->
            <!-- <tr class="validator-row" v-for="validator in group" :key="validator.pub_key + validator.coin"> -->
              <!-- <td></td> -->
              <!-- <td>{{ validator.coin }}</td> -->
              <!-- <td> -->
                <!-- <div class="">{{ Number(validator.value).toFixed(2) }}</div> -->
                <!-- <div class="">BIP {{ Number(validator.bip_value).toFixed(2) }}</div> -->
              <!-- </td> -->
            <!-- </tr> -->
          <!-- </template> -->
        <!-- </template> -->
      <!-- </tbody> -->
    <!-- </table> -->
  </div>
</template>

<script>
import { groupBy, truncateMiddle } from "../main.js"

export default {
  name: "ValidatorList",
  data() {
    return {
      expandedGroups: {},
    }
  },
  props: {
    validators: {
      type: Array,
      required: true,
    },
  },
  computed: {
    groupedList() {
      const result = groupBy(this.validators, "pub_key")
      result.forEach(a => a.sort(byBipValue))

      return result
    },
  },
  methods: {
    getCoin(group) {
      return group.map(validator => validator.coin).join(", ")
    },
    getMeta(validator, field) {
      return validator.validator_meta && validator.validator_meta[field]
    },
    getValue(n) {
      return splitThousands(Number(n).toFixed(2))
    },
    getShortKey(address) {
      return truncateMiddle(address, 7, 6)
    },
    getValidatorLink(address) {
      return `https://explorer.minter.network/validator/${address}`
    },
    sumValue(group) {
      const sum = group.reduce((accum, validator) => accum + Number(validator.bip_value), 0)
      return splitThousands(sum.toFixed(2))
    },
    toggleGroup(group) {
      if (group.length > 1) {
        const key = group[0].pub_key

        if (this.expandedGroups[key])
        {
          this.expandedGroups[key] = false
        }
        else
        {
          this.expandedGroups[key] = true
        }

        this.$forceUpdate()
      }
    },
    isExpandable(group) {
      return group.length > 1
    },
    isExpanded(group) {
      return this.expandedGroups[group[0].pub_key]
    }
  },
}

// function byCoinName(a, b) {
//   return a.coin.localeCompare(b.coin)
// }

function splitThousands(s) {
  return Number(s).toLocaleString("en").replace(",", " ")
}

function byBipValue(a, b) {
  return Number(b.bip_value) - Number(a.bip_value)
}
</script>
