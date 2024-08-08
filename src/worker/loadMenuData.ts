self.onmessage = async (e) => {
  try {
    const { data, checkMenuArr, dict, isForever } = e.data;
    const formatMenuData = {};
    checkMenuArr.forEach(id => {
      // 定义数据格式
      formatMenuData[id] = {
        lineAndPolygon: {
          type: 'FeatureCollection',
          features: [],
          layer: { id }
        },
        borderLine: {
          type: 'FeatureCollection',
          features: [],
          layer: { id }
        },
        marker: []
      }

      // 循环处理数据
      data[id].jsondata.features && data[id].jsondata.features.forEach((val) => {
        const { geometry } = val;
        // 处理marker数据
        if (geometry.type === 'Point') {
          const { properties, geometry } = val;
          const markerType = properties?.eventType ? dict[properties.eventType].name : '';
          if (properties.type === 'circle') {
            formatMenuData[id].lineAndPolygon.features.push(val)
          } else {
            formatMenuData[id].marker.push({
              position: geometry.coordinates,
              id: properties.id,
              name: id,
              img: properties?.customIcon || data[id].icon || '',
              attr: { ...properties, isForever: isForever ? true : false, markerType },
              text: properties.style.label.text,
              markerType
            });
          }
        } else {
          // 处理线面数据
          const { properties } = val;
          if (properties?.eventType && dict[properties.eventType].name === 'mask') {
            formatMenuData[id].borderLine.features.push(val)
          } else {
            formatMenuData[id].lineAndPolygon.features.push(val)
          }
        }
      })
    })
    // 处理完成后，可以向主线程发送消息
    self.postMessage({ status: 'success', data: formatMenuData });
  } catch (error: any) {
    console.error('Worker内部错误:', error);
    self.postMessage({ status: 'error', message: error.message });
  }
  self.close();
};
