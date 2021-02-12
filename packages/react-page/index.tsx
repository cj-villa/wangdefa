import React from 'react';
import ReactDOM from 'react-dom';

import { TodoList } from './src/TodoList';

const Demo:React.FC = () => {
  return <TodoList />;
};

ReactDOM.render(<Demo/>, document.getElementById('root'));
