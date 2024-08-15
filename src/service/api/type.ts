export type BasicInfoResponse = {
  name: string,
  subtitle: string,
  thumb_path: string,
  guest: number,
}

export type LoginResponse = { token: string, appid: number };

export type ProjectList = ProjectListItem[];

type ProjectListItem = {
  id: number,
  name: string,
  subtitle: string,
  thumb_path: string
}

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

