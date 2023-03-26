import React from 'react';
import { Alert, Space } from 'antd';

export const Success: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Alert message="操作成功！" type="success" showIcon />
  </Space>
);

export const Fail: React.FC = () => (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Alert message="操作失败，请稍后再试！" type="error" showIcon />
    </Space>
  );
  