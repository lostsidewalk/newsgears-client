import { ref, computed, readonly } from 'vue';

export function useLayout() {
  const layout = ref(); // 'CARD' 

  let localLayout = localStorage.getItem('layout');
  if (localLayout) {
    layout.value = localLayout;
  } else [
    layout.value = 'LIST'
  ]

  const showCardLayout = computed(() => {
    return layout.value === 'CARD';
  });

  const showListLayout = computed(() => {
    return layout.value === 'LIST';
  });

  const showTableLayout = computed(() => {
    return layout.value == 'TABLE';
  })

  function switchToListLayout() {
    layout.value = 'LIST';
    localStorage.setItem('layout', layout.value);
  }

  function switchToCardLayout() {
    layout.value = 'CARD';
    localStorage.setItem('layout', layout.value);
  }

  function switchToTableLayout() {
    layout.value = 'TABLE';
    localStorage.setItem('layout', layout.value);
  }

  const roLayout = readonly(layout);

  return {
    roLayout,
    showCardLayout,
    showListLayout,
    showTableLayout, 
    // 
    switchToListLayout,
    switchToCardLayout, 
    switchToTableLayout, 
  }
}
