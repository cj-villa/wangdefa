import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { HIDDEN_VALUE_PLACEHOLDER } from './display-config';

interface MaskableValueProps {
  value: ReactNode;
  defaultMasked?: boolean;
  suffix?: ReactNode;
  placeholder?: ReactNode;
}

export const MaskableValue = ({
  value,
  defaultMasked = false,
  suffix,
  placeholder = HIDDEN_VALUE_PLACEHOLDER,
}: MaskableValueProps) => {
  const [masked, setMasked] = useState(defaultMasked);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span>{masked ? placeholder : value}</span>
      {masked ? null : suffix}
      {masked ? (
        <EyeOutlined onClick={() => setMasked(false)} style={{ cursor: 'pointer', fontSize: 14 }} />
      ) : (
        <EyeInvisibleOutlined
          onClick={() => setMasked(true)}
          style={{ cursor: 'pointer', fontSize: 14 }}
        />
      )}
    </span>
  );
};
