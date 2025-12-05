import { Flex, type FlexProps } from 'antd';
import cn from 'classnames';
import styles from './index.module.less';

interface SectionProps {
  fullpage?: boolean;
}

export const Section: React.FC<
  React.PropsWithChildren<
    SectionProps &
      FlexProps &
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >
> = ({ className, children, fullpage, ...rest }) => {
  return (
    <Flex
      className={cn(className, styles.section, { [styles.section__fullpage]: fullpage })}
      {...rest}
    >
      {children}
    </Flex>
  );
};
