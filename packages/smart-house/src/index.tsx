import React from 'react';
import ReactDOM from 'react-dom';

const Demo: React.FC = () => {
  return <div>hello world2</div>;
};

ReactDOM.render(<Demo />, document.getElementById('root'));

class Base {
  value: number | string;

  set data(value: string) {
    console.log('data changed to ' + value);
  }

  constructor(value: number | string) {
    this.value = value;
  }
}
