import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import { Flex, Input } from 'antd';

export const ContainerActions = (props: any) => {
  if (props.isMobile) return [];
  return (
    <Flex gap={6}>
      <Flex align="center">
        <Input
          style={{
            borderRadius: 4,
            marginInlineEnd: 12,
            backgroundColor: 'rgba(0,0,0,0.03)',
          }}
          prefix={
            <SearchOutlined
              style={{
                color: 'rgba(0, 0, 0, 0.15)',
              }}
            />
          }
          placeholder="搜索方案"
          variant="borderless"
        />
        <PlusCircleFilled style={{ color: 'var(--ant-primary-color)', fontSize: 24 }} />
      </Flex>
      <InfoCircleFilled
        key="InfoCircleFilled"
        style={{ color: 'var(--ant-primary-color)', fontSize: 16 }}
      />
      <QuestionCircleFilled
        key="QuestionCircleFilled"
        style={{ color: 'var(--ant-primary-color)', fontSize: 16 }}
      />
      <GithubFilled
        key="GithubFilled"
        style={{ color: 'var(--ant-primary-color)', fontSize: 16 }}
      />
    </Flex>
  );
};
