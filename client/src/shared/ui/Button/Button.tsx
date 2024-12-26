import React, { type ReactNode } from 'react';

type Props = {
  text?: string;
  color: string;
  disabled?: boolean;
  icon?: string;
  onClick?: () => void;
  type: 'button' | 'submit' | 'reset' | undefined;
  children?: ReactNode | React.JSX.Element;
};

export function Button({
  text,
  color,
  disabled,
  icon,
  onClick,
  type = 'button',
  children,
}: Props): React.JSX.Element {
  return (
    <div onClick={onClick}>
      <button type={type} style={{ backgroundColor: color }} disabled={disabled}>
        {icon && <img src={icon} width={20} />}
        {text}
        {children}
      </button>
    </div>
  );
}
