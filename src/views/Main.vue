<template>
  <div class="app-shell">
    <ProductNav v-if="showProductNav" />
    <main :class="{ 'with-nav': showProductNav }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProductNav from '@/components/ProductNav.vue'

const route = useRoute()
const showProductNav = computed(() => !['/editor', '/preview'].includes(route.path))
</script>

<style scoped lang="scss">
.app-shell {
  width: 100%;
  min-height: 100vh;
  background: inherit;
}

main {
  width: 100%;
  min-height: 100vh;
  background: inherit;

  &.with-nav {
    min-height: 100vh;
    padding-top: 82px;
  }
}
</style>
