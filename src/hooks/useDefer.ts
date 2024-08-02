export default function useDefer(maxCount = 40) {
  const frameCount = ref(0);
  let rafId;
  function updateFrameCount() {
    rafId = requestAnimationFrame(() => {
      frameCount.value++;
      if (frameCount.value >= maxCount) {
        return;
      }
      updateFrameCount();
    });
  }
  updateFrameCount();
  onUnmounted(() => {
    cancelAnimationFrame(rafId);
  });
  return function defer(n) {
    return frameCount.value >= n;
  };
}
