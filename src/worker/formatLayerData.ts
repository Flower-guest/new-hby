self.onmessage = async (e) => {
  try {
    const { type, data, checkMenuArr, dict, isForever, menuId, findIdArr } = e.data;

    let formatMenuData;

    switch (type) {
      case 'loadMenuData':
        formatMenuData = checkMenuArr.reduce((acc, id) => {
          // 定义数据格式
          acc[id] = {
            lineAndPolygon: createFeatureCollection(id),
            borderLine: createFeatureCollection(id),
            marker: []
          };

          const features = data[id]?.jsondata?.features || [];
          features.forEach(val => processFeature(val, acc[id], dict, data[id], isForever, id));

          return acc;
        }, {});
        break;
      case 'loadListData':
        const features = data[menuId]?.jsondata?.features || [];
        const featuresByIdMap = new Map(features.map(feature => [
          feature.properties.id,
          feature
        ]));

        formatMenuData = {
          lineAndPolygon: createFeatureCollection(menuId),
          marker: []
        }
        findIdArr.forEach((id) => {
          const foundFeature = featuresByIdMap.get(id) as { type: string, properties: any, geometry: any };
          if (foundFeature.geometry.type === 'Point') {
            handlePointFeature(foundFeature, formatMenuData, dict, data[menuId], false, id);
          } else {
            handleLineOrPolygonFeature(foundFeature, formatMenuData, dict);
          }
        })
        break;
    }

    self.postMessage({ status: 'success', data: formatMenuData });
  } catch (error: any) {
    console.error('Worker内部错误:', error);
    self.postMessage({ status: 'error', message: error.message });
  }
  self.close();
};

// 创建基础FeatureCollection结构
const createFeatureCollection = (id: string) => ({
  type: 'FeatureCollection',
  features: [],
  layer: { id }
});

/**
 * 处理单个GeoJSON特征对象，并将其分类到目标数据结构中。
 *
 * @param val - 当前处理的 GeoJSON 特征对象，包括属性和几何信息。
 * @param targetData - 目标数据结构，用于存储处理后的特征数据。
 * @param dict - 字典对象，用于查找和匹配特征属性中的 eventType。
 * @param data - 原始数据对象，包含所有未处理的 GeoJSON 数据。
 * @param isForever - 布尔值，指示标记是否是永久性的（true）或临时性的（false）。
 * @param id - 当前处理的特征数据所属的菜单或图层的 ID。
 */
const processFeature = (val: any, targetData: any, dict: any, data: any, isForever: boolean, id: number) => {
  const { geometry } = val;
  if (geometry.type === 'Point') {
    handlePointFeature(val, targetData, dict, data, isForever, id);
  } else {
    handleLineOrPolygonFeature(val, targetData, dict);
  }
};

// 处理 Point 类型的 feature
const handlePointFeature = (val: any, targetData: any, dict: any, data: any, isForever: boolean, id: number) => {
  const { properties, geometry } = val;
  const markerType = properties?.eventType ? dict[properties.eventType].name : '';

  if (properties.type === 'circle') {
    targetData.lineAndPolygon.features.push(val);
  } else {
    targetData.marker.push({
      position: geometry.coordinates,
      name: id,
      img: properties?.customIcon || data.icon || '',
      attr: { ...properties, isForever, markerType },
      text: properties?.style?.label?.text,
      diFar: properties?.distanceDisplayCondition ? properties?.distanceDisplayCondition_far : null,
      markerType
    });
  }
};

// 处理 Line 和 Polygon 类型的 feature
const handleLineOrPolygonFeature = (val: any, targetData: any, dict: any) => {
  const { properties } = val;
  const { distanceDisplayCondition, distanceDisplayCondition_far } = properties.style
  properties.style.distanceDisplayCondition = distanceDisplayCondition ? distanceDisplayCondition : true;
  properties.style.distanceDisplayCondition_far = distanceDisplayCondition_far ? distanceDisplayCondition_far : 50000;
  if (properties?.eventType && dict[properties.eventType].name === 'mask') {
    targetData.borderLine.features.push(val);
  } else {
    targetData.lineAndPolygon.features.push(val);
  }
};
