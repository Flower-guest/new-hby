export function maskNumber(type: string, number: string): string {
  let maskNumber;
  // 脱敏手机号
  if (!number) return "";
  if (type == "tel") {
    maskNumber = number.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  } else {
    // 脱敏身份证号
    maskNumber = number.replace(/(\d{4})\d{10}(\w{4})/, "$1**********$2");
  }
  return maskNumber;
}

// 取对象指定字段数据 data:对象 value:指定字段 返回数组
export function extractTypes(data, val) {
  const types: any = [];
  data.forEach((property) => {
    if (property[val]) {
      types.push(property);
    }
  });
  return types;
}

// 获取静态图片
export function getAssets(url: string) {
  return new URL(`../assets/img/${url}`, import.meta.url).href;
}

// 获取服务器图片
export const getServeImg = (url) => {
  return url ? import.meta.env.VITE_BASE_FILE_URL + url : "";
};

// 加载服务器json
export const getJson = async (url) => {
  const response = await fetch(
    import.meta.env.VITE_BASE_FILE_URL + url
  );
  const result = await response.json();
  return result;
};

// 保留小数点指定几位数
export const isDecimal = (num, length) => {
  const formatNum = parseFloat(num);

  // 检查是否是整数
  if (Number.isInteger(formatNum)) {
    return formatNum;
  }

  // 将数值转换为字符串并分割小数部分
  const parts = formatNum.toString().split(".");
  // 如果有小数部分，返回小数位数
  return parts[1].length > length ? formatNum.toFixed(length) : formatNum;
};

// 格式化菜单数据
export const formMenuData = (menus) => {
  const tab: any = [], tabMenu: any = {};
  menus.forEach((menu) => {
    tab.push(menu);
    if (menu.menu_type === "moreTab" && menu.childlist.length > 0) {
      menu.childlist.forEach((childList) => {
        tabMenu[childList.id] = childList.childlist
      })
    } else {
      tabMenu[menu.id] = menu.childlist
    }
  })

  return { tab, tabMenu }
}
