import axios from "axios";

// 创建 Axios 示例
const myAxios = axios.create({
  baseURL: "http://localhost:8101",
  timeout: 10000,
  withCredentials: true,
  // 添加更多配置
  headers: {
    'Content-Type': 'application/json',
  },
  // 确保能接收到错误响应
  validateStatus: function (status) {
    // 允许所有状态码，包括403
    return status >= 200 && status < 600;
  },
});

// 触发黑名单错误事件
const triggerBlacklistError = () => {
  if (typeof window !== 'undefined') {
    console.log('触发黑名单错误事件');
    window.dispatchEvent(new CustomEvent('blacklist-error', {
      detail: {
        message: 'IP地址被加入黑名单',
        timestamp: new Date().toISOString()
      }
    }));
  }
};

// 触发API错误事件
const triggerApiError = (message: string) => {
  if (typeof window !== 'undefined') {
    console.log('触发API错误事件:', message);
    window.dispatchEvent(new CustomEvent('api-error', {
      detail: {
        message: message,
        timestamp: new Date().toISOString()
      }
    }));
  }
};

// 检查是否为黑名单错误
const isBlacklistError = (data: any): boolean => {
  console.log("检查黑名单错误，数据:", data);
  console.log("数据类型:", typeof data);
  
  // 检查是否为字符串格式的JSON
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
      console.log("解析后的数据:", data);
    } catch (e) {
      console.log("JSON解析失败:", e);
      return false;
    }
  }
  
  // 检查黑名单错误标识
  const isBlacklist = data && 
         typeof data === 'object' &&
         (data.errorCode === "-1" || data.errorCode === -1) && 
         data.errorMsg && 
         typeof data.errorMsg === 'string' &&
         (data.errorMsg.includes("黑名单IP") || data.errorMsg.includes("禁止访问"));
  
  if (isBlacklist) {
    console.log("检测到黑名单错误:", data);
  } else {
    console.log("未检测到黑名单错误，数据:", data);
    console.log("检查条件:", {
      hasData: !!data,
      isObject: typeof data === 'object',
      errorCode: data?.errorCode,
      errorMsg: data?.errorMsg,
      errorCodeMatch: data?.errorCode === "-1" || data?.errorCode === -1,
      errorMsgMatch: data?.errorMsg && typeof data.errorMsg === 'string' && 
                    (data.errorMsg.includes("黑名单IP") || data.errorMsg.includes("禁止访问"))
    });
  }
  
  return isBlacklist;
};

// 创建响应拦截器
myAxios.interceptors.response.use(
  // 2xx 响应触发
  function (response) {
    const { data, status } = response;
    
    console.log("收到响应:", {
      status: status,
      url: response.config.url,
      data: data
    });
    
    // 检查是否为黑名单IP拦截（403状态码）
    if (status === 403) {
      console.log("检测到403状态码，检查是否为黑名单错误");
      if (isBlacklistError(data)) {
        console.log("确认是黑名单错误，触发黑名单错误事件");
        // 触发黑名单错误事件
        triggerBlacklistError();
        // 抛出错误让调用方处理
        const error = new Error("IP地址被加入黑名单");
        error.name = "BlacklistError";
        throw error;
      }
    }
    
    // 检查是否为黑名单IP拦截（在响应数据中）
    if (isBlacklistError(data)) {
      console.log("检测到黑名单错误:", data);
      // 触发黑名单错误事件
      triggerBlacklistError();
      // 抛出错误让调用方处理
      const error = new Error("IP地址被加入黑名单");
      error.name = "BlacklistError";
      throw error;
    }
    
    // 检查是否为正常的业务错误
    if (data && typeof data === 'object') {
      // 未登录
      if (data.code === 40100) {
        if (
          !response.request.responseURL.includes("user/get/login") &&
          !window.location.pathname.includes("/user/login")
        ) {
          window.location.href = `/user/login?redirect=${window.location.href}`;
        }
      } else if (data.code !== undefined && data.code !== 0) {
        // 其他业务错误
        const errorMessage = data.message ?? "服务器错误";
        triggerApiError(errorMessage);
        throw new Error(errorMessage);
      }
    }
    
    return data;
  },
  // 非 2xx 响应触发
  function (error) {
    console.log("响应错误:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    // 处理响应错误
    if (error.response) {
      const { status, data } = error.response;
      
      console.log("处理HTTP错误响应:", { 
        status, 
        data, 
        headers: error.response.headers,
        url: error.config?.url 
      });
      
      // 处理黑名单IP拦截（403状态码）
      if (status === 403) {
        console.log("检测到403状态码，检查是否为黑名单错误");
        console.log("响应数据:", data);
        console.log("数据类型:", typeof data);
        
        if (isBlacklistError(data)) {
          console.log("确认是黑名单错误，触发黑名单错误事件");
          // 触发黑名单错误事件
          triggerBlacklistError();
          const blacklistError = new Error("IP地址被加入黑名单");
          blacklistError.name = "BlacklistError";
          throw blacklistError;
        } else {
          console.log("403错误但不是黑名单错误，按普通403处理");
          const errorMessage = "访问被拒绝，请检查权限";
          triggerApiError(errorMessage);
          throw new Error(errorMessage);
        }
      }
      
      // 处理其他HTTP错误
      let errorMessage = "请求失败";
      switch (status) {
        case 404:
          errorMessage = "请求的资源不存在";
          break;
        case 500:
          errorMessage = "服务器内部错误，请稍后重试";
          break;
        default:
          errorMessage = `请求失败 (${status}): ${data?.message || "未知错误"}`;
      }
      triggerApiError(errorMessage);
      throw new Error(errorMessage);
    } else if (error.request) {
      // 网络错误
      console.log("网络错误:", error.request);
      console.log("错误详情:", {
        message: error.message,
        code: error.code,
        config: error.config
      });
      
      // 检查是否可能是黑名单错误导致的网络问题
      if (error.message && error.message.includes("Network Error")) {
        console.log("检测到网络错误，可能是黑名单拦截导致");
        // 尝试触发黑名单错误事件
        triggerBlacklistError();
        const blacklistError = new Error("IP地址被加入黑名单");
        blacklistError.name = "BlacklistError";
        throw blacklistError;
      }
      
      const errorMessage = "网络连接失败，请检查网络设置";
      triggerApiError(errorMessage);
      throw new Error(errorMessage);
    } else {
      // 其他错误
      console.log("其他错误:", error.message);
      const errorMessage = "请求配置错误";
      triggerApiError(errorMessage);
      throw new Error(errorMessage);
    }
  },
);

export default myAxios;
