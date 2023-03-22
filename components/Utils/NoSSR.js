import React from 'react';
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic((props) => import(`./${props.component}`), { ssr: false });

function NoSSRWrapper(props) {
  return <DynamicComponent component={props.component} />;
}

export default NoSSRWrapper;
