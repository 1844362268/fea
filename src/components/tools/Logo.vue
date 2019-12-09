<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <img v-if="!collapsed" alt="logo" src="~@/assets/logo.png"/>
      <img v-else alt="logo" src="~@/assets/logo-mini.png"/>
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'Logo',
  components: {
  },
  props: {
    title: {
      type: String,
      default: '企业测评系统',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  }
}
</script>
