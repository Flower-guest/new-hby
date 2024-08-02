import {
  getInvestmentProjects,
  getAssetManagement,
  getBuiltProjects,
  getBuildingManagement,
} from "@/service/api/admin-api";

const useGetListInfo = () => {
  const tabActive = ref<any>();
  const state = reactive<any>({
    infoList: [], // 数据列表
    total: 0, // 总条数
    pageNo: 1, // 当前页
    pageSize: 10, // 分页大小
    filter: false, //是否在数据返回时将total数据等过滤
    name: "", // 搜索框值
    status: "", //项目状态
  });

  // tab点击事件
  const infoClick = async (i) => {
    // 如果当前激活的tab的值不为空，且当前激活的tab的值不等于当前遍历到的tab的值
    if (tabActive.value?.val && tabActive.value.val !== i.val) {
      // 将state的name和status属性设置为空
      state.name = "";
      state.status = "";
      // 重置state
      resetState();
    }
    tabActive.value = i;
    getData(i.val);
  };

  // 筛选事件
  const screen = async (val) => {
    state.pageNo = 1;
    state.status = val;
    getData(tabActive.value.val);
  };

  // 搜索事件
  const search = async () => {
    state.pageNo = 1;
    getData(tabActive.value.val);
  };

  // 分页按钮点击事件
  const changePage = (val, totalPage) => {
    if (val == "prev") {
      if (state.pageNo < 2) return (state.pageNo = 1);
      state.pageNo--;
    } else {
      if (state.pageNo > totalPage - 1) return;
      state.pageNo++;
    }
    infoClick(tabActive.value);
  };

  // 分页配置重置
  const resetState = () => {
    Object.assign(state, {
      infoList: [], // 数据列表
      total: 0, // 总条数
      pageNo: 1, // 当前页
      pageSize: 10, // 分页大小
    });
  };

  // 根据条件获取数据
  const getData = async (val) => {
    let res;
    switch (val) {
      case "zsxm": // 获取招商项目列表
        res = await getInvestmentProjects(state);
        break;
      case "jsxm": // 获取建设项目列表
        res = await getBuiltProjects(state);
        break;
      case "fwzs": //房屋招商
        res = await getBuildingManagement({
          ...state,
          rentalIntention: 1,
          assetUsage: "20",
        });
        break;
      case "qtzs": //其它招商
        res = await getAssetManagement({
          ...state,
          rentalIntention: 1,
          assetUsage: "20",
        });
        break;
      case "fwzc": //房屋资产
        res = await getBuildingManagement(state);
        break;
      case "qtzc": //其它资产
        res = await getAssetManagement(state);
        break;
    }
    state.total = res.total;
    state.infoList = res.list;
  };

  return {
    infoClick,
    tabActive,
    changePage,
    state,
    search,
    screen,
  };
};

export default useGetListInfo;
