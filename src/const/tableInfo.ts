export const tabPanes = [
  { label: "基本信息", name: "baseInfo" },
  { label: "招商信息", name: "mercInfo" },
];
export const rowList = {
  baseInfo: [
    {
      label: "权属人",
      prop: "ownerName",
    },
    {
      label: "资产类型",
      prop: "assetType",
      type: "asset_type",
    },
    {
      label: "房屋类型",
      prop: "houseTypeBuild",
      type: "house_type_build",
    },
    {
      label: "所在网格",
      prop: "gridName",
    },
    {
      label: "所在小组",
      prop: "groupName",
    },
    {
      label: "门牌号",
      prop: "addressNo",
    },
    {
      label: "占地面积(㎡)",
      prop: "occupyingArea",
    },
    {
      label: "建筑面积(㎡)",
      prop: "floorSpace",
    },
    {
      label: "建成年份",
      prop: "yearBuilt",
    },
    {
      label: "建筑结构",
      prop: "buildingStructure",
      type: "building_structure",
    },
    {
      label: "房屋户型",
      prop: "houseType",
    },
    {
      label: "建筑朝向",
      prop: "buildingOrientation",
      type: "building_orientation",
    },
    {
      label: "资产状态评估",
      prop: "assetStatus",
      type: "asset_status",
    },
    {
      label: "资产用途",
      prop: "assetUsage",
    },
    {
      label: "出租意向",
      prop: "rentalIntention",
      type: "rental_intention",
    },
    {
      label: "不动产编号",
      prop: "assetCertificateNumber",
      span: 24,
    },
  ],
  mercInfo: [
    {
      label: "招商标题",
      prop: "titleInvestment",
    },
    {
      label: "招商标签",
      prop: "tagInvestment",
    },
    {
      label: "招商状态",
      prop: "investmentStatus",
      type: "investment_status",
    },
    {
      label: "意向价格(元)",
      prop: "listingPrice",
    },
    {
      label: "招商方式",
      prop: "merchantsMode",
      type: "investment_methods",
    },
    {
      label: "装修状况",
      prop: "decorationStatus",
      type: "decoration_situation",
    },
    {
      label: "配备电梯",
      prop: "isLift",
      type: "is_lift",
    },
    {
      label: "带看次数",
      prop: "lookNumber",
    },
    {
      label: "联系人",
      prop: "contacts",
    },
    {
      label: "联系方式",
      prop: "telephone",
    },
    {
      label: "招商信息描述",
      prop: "remarks",
    },
    {
      label: "合同签订时间",
      prop: "investmentPromotionTime",
      type: "time",
    },
    {
      label: "到期时间",
      prop: "expirationTime",
      type: "time",
    },
    {
      label: "合同价格(元)",
      prop: "transactionPrice",
    },
  ],
};

export const xmTabPanes = [
  { label: "项目信息", name: "baseInfo" },
  { label: "项目描述", name: "mercInfo" },
];
export const xmList = {
  baseInfo: [
    { label: "项目名称", prop: "name" },
    { label: "规划面积", prop: "plan_area" },
    { label: "项目预算", prop: "project_budget" },
    { label: "项目状态", prop: "project_status", type: "dict" },
    {
      label: "合作方式",
      prop: "cooperation_methods",
      type: "dict",
    },
    { label: "发布时间", prop: "createtime", type: "time" },
    { label: "联系人", prop: "contact_person" },
    { label: "职位", prop: "job_position" },
    { label: "联系单位", prop: "contact_unit" },
    { label: "联系电话", prop: "telephone" },
  ],
  mercInfo: [{ label: "描述", prop: "introduce", type: "html" }],
};
