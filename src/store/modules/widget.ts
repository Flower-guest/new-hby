import { defineStore } from "pinia";

export const useWidGet = defineStore("widGet", {
  state: () => {
    return {
      currentWidget: "",
    };
  },
  getters: {},
  actions: {
    setCurrentWidget(currentWidget) {
      this.currentWidget = currentWidget;
    },
  },
});
