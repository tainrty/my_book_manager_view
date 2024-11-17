request.interceptors.response.use(
  response => {
    let res = response.data;

    // 如果返回的是字符串（例如 "删除成功"），并且不是有效的 JSON
    if (typeof res === 'string') {
      try {
        res = JSON.parse(res); // 尝试解析为 JSON
      } catch (e) {
        // 如果解析失败，就认为它是正常的成功响应消息
        res = {
          code: '200',  // 设置为成功码
          message: res  // 将字符串作为消息
        };
      }
    }

    // 确保返回的结构符合前端的处理逻辑
    if (res.code === '200') {
      return res; // 请求成功，返回数据
    } else {
      console.error('请求失败:', res.message || '未知错误');
      return Promise.reject(res.message || '未知错误');
    }
  },
  error => {
    // 响应错误处理
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);
