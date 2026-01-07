import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { theme } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { request } from 'src/request/request';

import './index.less';

const Page = () => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="Wangdefa"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        onFinish={(values) => {
          return request
            .post<any, { access_token: string }>('/api/auth/signIn', values)
            .then((res) => {
              localStorage.setItem('token', res.access_token);
              location.href = '/';
            });
        }}
      >
        <ProFormText
          name="usernameOrEmail"
          fieldProps={{
            size: 'large',
            prefix: (
              <UserOutlined
                style={{
                  color: token.colorText,
                }}
                className="prefixIcon"
              />
            ),
          }}
          placeholder="用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名或邮件地址',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: (
              <LockOutlined
                style={{
                  color: token.colorText,
                }}
                className="prefixIcon"
              />
            ),
          }}
          placeholder="密码"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
};

createRoot(document.body).render(
  <ProConfigProvider dark>
    <Page />
  </ProConfigProvider>
);
