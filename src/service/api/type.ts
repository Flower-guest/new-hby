export type BasicinfoResponse = {
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
