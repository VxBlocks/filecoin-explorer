import React from 'react';
import {Typography} from "antd";
import "./public.less"

const {Text} = Typography;


const EllipsisMiddle: React.FC<{ className?: string | undefined, suffixCount: number; children: string }> = (
  {
    className,
    suffixCount,
    children,
  }
) => {
  if (!children) {
    return null;
  }
  if (children.length < 10) {
    return <span>{children}</span>;
  }
  const start = children.slice(0, suffixCount).trim();
  const suffix = children.slice(-suffixCount).trim();
  return (
    <Text className={className} style={{maxWidth: '100%'}} ellipsis={{suffix: suffix, tooltip: true}}>
      {start}
      <span className={"ellipsis"}>{children.slice(suffixCount, -suffixCount).trim()}</span>
    </Text>
  );
};

export default EllipsisMiddle;