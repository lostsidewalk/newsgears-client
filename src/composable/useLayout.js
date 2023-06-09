import { ref, computed, readonly } from 'vue';

export function useLayout() {
  const layout = ref('LIST'); // 'CARD' 

  const showCardLayout = computed(() => {
    return layout.value === 'CARD';
  });

  const showListLayout = computed(() => {
    return layout.value === 'LIST';
  });

  function switchToListLayout() {
    layout.value = 'LIST';
  }

  function switchToCardLayout() {
    layout.value = 'CARD';
  }

  const roLayout = readonly(layout);

  return {
    roLayout,
    showCardLayout,
    showListLayout,
    // 
    switchToListLayout,
    switchToCardLayout, 
  }
}
