<template>
  <div
    ref="rollRef"
    class="roll h-full overflow-hidden w-full"
    :class="{ 'overflow-y-auto': isMove }"
    @mousemove="mouseMove"
    @mouseleave="mouseleave"
  >
    <slot name="scrollList"></slot>
  </div>
</template>

<script lang="ts" setup>
// 定义父组件传递的参数
interface detailProps {
  type?: string; //滚动的类型
  speed?: number; //滚动的间隔时间
  scrollLength?: number; //当为list时超过多少条才滚动
}

const props = withDefaults(defineProps<detailProps>(), {
  type: "arr",
  speed: 75,
  scrollLength: 6,
});

//定时器初始化
let timer: any = null;
//ref绑定初始化
let rollRef = ref<any>(null);
const isMove = ref<boolean>(false);

// 格式化数据，返回想要展示的数据格式
/**
 * @Description: 鼠标移动事件
 * @Author: admin
 */
const mouseMove = () => {
  isMove.value = true;
  clearTimeout(timer);
};
/**
 * @Description: 鼠标离开事件
 * @Author: admin
 */
const mouseleave = () => {
  isMove.value = false;
  start();
};
//开启定时器方法
const start = () => {
  //清除定时器
  clearTimeout(timer);
  //定时器触发周期
  timer = setInterval(MarqueeTest, props.speed);
};
const MarqueeTest = () => {
  let roll = rollRef.value;
  //判断组件是否渲染完成
  if (roll.offsetHeight == 0) {
    roll = rollRef.value;
  } else {
    //如果列表数量过少不进行滚动
    if (roll.children.length < props.scrollLength) {
      clearTimeout(timer);
      return;
    }
    //组件进行滚动
    roll.scrollTop += 1;
    //判断滚动条是否滚动到底部
    if (roll.scrollTop == roll.scrollHeight - roll.clientHeight) {
      //获取组件第一个节点
      let a = roll.children[0];
      //删除节点
      roll.removeChild(a);
      //将该节点拼接到组件最后
      roll.append(a);
    }
  }
};

onMounted(() => {
  start();
});

onBeforeUnmount(() => {
  //清除定时器
  clearTimeout(timer);
});

onUnmounted(() => {
  //清除定时器
  clearTimeout(timer);
});
</script>
<style lang="less" scoped>
.roll::-webkit-scrollbar {
  display: none;
}
</style>
