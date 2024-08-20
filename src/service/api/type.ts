// 获取gis项基础信息
export type BasicInfoResponse = {
  name: string,
  subtitle: string,
  thumb_path: string,
  guest: number,
}

// 登录
export type LoginResponse = { token: string, appid: number };

// 获取GIS项目列表
export type ProjectListItem = {
  id: number,
  name: string,
  subtitle: string,
  thumb_path: string
}

// 初始化GIS项目
export type UserInterface = {
  name: string,
  subtitle: string,
  thumb_path: string,
  guest: number,
  menus: WebMenuResponse[]
};

export type WebMenuResponse = {
  id: number,
  pid: number,
  name: string,
  title: string,
  ismenu: number,
  weigh: number,
  jsonurl: string,
  image: string,
  custom: string[],
  event_type: string,
  menu_type: string,
  childlist: WebMenuResponse[]
};


export type BtnByMenu = {
  id: number,
  gid: number,
  pid: number,
  name: string,
  title: string,
  custom: any,
  jsonurl: string,
  data_model: string,
  url: string,
  image: string,
  data: {
    name: string,
    group: string,
    title: string,
    type: string,
    value: string[],
    front_extend: string,
    extend: string,
    extend_html: string
  }
}

export type ArticleChannel = {
  id: number,
  type: string,
  name: string,
  image: string,
  isnav: number,
  status: string,
  type_text: string,
  status_text: string,
  url: string,
  fullurl: string,
  outlink: string
}

export type ArticleChannelList = {
  id: number,
  type: number,
  title: string,
  image: string,
  flag: string
  status: string,
  publishtime: number,
  style: string,
  flag_text: string,
  status_text: string,
  publishtime_text: string,
  url: string,
  fullurl: string,
  style_bold: boolean,
  style_color: string
}

export type ArticleById = ArticleChannelList & {
  content: string,
}

// 招商项目、建设项目list
export type ProjectType = {
  statusList: {
    id: string
  },
  typeList: {
    id: string
  }
}

// 招商项目、建设项目list
export type ProjectListQuery = { name: string, category: number, status: number, page: number, size: number }

export type ProjectListResponse = {
  total: number,
  data: any[]
}

export type ProjectDetailsResponse = {
    id: number,
    mid: number,
    name: string,
    type: number,
    project_type: number,
    project_status: number,
    plan_area: number,
    cooperation_methods: number,
    project_budget: number,
    contact_unit: string,
    contact_person: string,
    job_position: string,
    telephone: number,
    thumbnail: string,
    panoramic_link: string,
    project_scope_file: string,
    introduce:string,
    gis_menu_id: number,
    gis_id: number,
    gis_spot: string,
    map_elements_name: string,
    project_registration_date: string
}
