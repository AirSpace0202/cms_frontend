<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import BasicLayout from "@/layouts/BasicLayout.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";

export default defineComponent({
  components: {
    BasicLayout,
    BlankLayout,
  },
  setup() {
    const route = useRoute();
    const layout = computed(() => {
      return route.meta.layout === "blank" ? BlankLayout : BasicLayout;
    });

    return {
      layout,
    };
  },
});
</script>
