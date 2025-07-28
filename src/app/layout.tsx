"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import BasicLayout from "@/layouts/BasicLayout";
import React, { useCallback, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store, { AppDispatch } from "@/stores";
import { getLoginUserUsingGet } from "@/api/userController";
import AccessLayout from "@/access/AccessLayout";
import { setLoginUser } from "@/stores/loginUser";
import ClientErrorHandler from "@/components/ClientErrorHandler";
import "./globals.css";

/**
 * 全局初始化逻辑
 * @param children
 * @constructor
 */
const InitLayout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  // 初始化全局用户状态
  const doInitLoginUser = useCallback(async () => {
    try {
      const res = await getLoginUserUsingGet();
      if (res.data) {
        // 更新全局用户状态
        dispatch(setLoginUser(res.data as API.LoginUserVO));
      } else {
        // 仅用于测试
        // setTimeout(() => {
        //   const testUser = {
        //     userName: "测试登录",
        //     id: 1,
        //     userAvatar: "https://www.code-nav.cn/logo.png",
        //     userRole: ACCESS_ENUM.ADMIN
        //   };
        //   dispatch(setLoginUser(testUser));
        // }, 3000);
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
    }
  }, [dispatch]);

  // 只执行一次
  useEffect(() => {
    doInitLoginUser();
  }, []);
  return children;
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>
        <AntdRegistry>
          <Provider store={store}>
            <InitLayout>
              <BasicLayout>
                <AccessLayout>{children}</AccessLayout>
                {/* 客户端错误处理器 */}
                <ClientErrorHandler />
              </BasicLayout>
            </InitLayout>
          </Provider>
        </AntdRegistry>
      </body>
    </html>
  );
}
