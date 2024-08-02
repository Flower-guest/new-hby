const colorCache: string[] = []; // 存储已生成的颜色

export function randomRgbaColor(alphas?: number): string {
  let color: string;
  do {
    // 随机生成RGBA颜色
    const r: number = Math.floor(Math.random() * 254); // 随机生成256以内r值
    const g: number = Math.floor(Math.random() * 254); // 随机生成256以内g值
    const b: number = Math.floor(Math.random() * 254); // 随机生成256以内b值
    const alpha: number = alphas || Math.random(); // 随机生成1以内a值
    color = `rgba(${r},${g},${b},${alpha})`; // rgba(r,g,b,a)格式颜色
  } while (colorCache.includes(color)); // 检查是否生成过相同的颜色

  colorCache.push(color); // 将新生成的颜色添加到缓存数组中
  return color;
}

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

// 时间戳转年月日
export function formatDateFromTimestamp(timestamp: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

export const generateUUID = () => {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
      const callback = (c: any) => {
        const num = Number(c)
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(
          16
        )
      }
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback)
    }
  }
  let timestamp = new Date().getTime()
  let performanceNow =
    (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0
      timestamp = Math.floor(timestamp / 16)
    } else {
      random = (performanceNow + random) % 16 | 0
      performanceNow = Math.floor(performanceNow / 16)
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

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
    if (menu.menu_type === '19' && menu.childlist.length > 0) {
      menu.childlist.forEach((childList) => {
        tabMenu[childList.id] = childList.childlist
      })
    } else {
      tabMenu[menu.id] = menu.childlist
    }
  })

  return { tab, tabMenu }
}
