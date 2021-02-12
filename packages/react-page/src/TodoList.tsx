import React, { useCallback, useState } from 'react';

interface IList {
  content: string;
}

export const TodoList: React.FC = () => {

  /** todo list */
  const [list, setList] = useState<IList[]>([]);

  /** current todo content */
  const [content, setContent] = useState('');
  /** change content */
  const changeContent = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  /** add current item to list */
  const addList = useCallback(() => {
    setList((preList) => {
      return [
        ...preList,
        {
          content,
        },
      ];
    });
    setContent('');
  }, [content]);

  return (
    <div>
      <p>TODO LIST</p>
      {
        list.map((item) => {
          return (
            <p key={item.content}>{item.content}</p>
          )
        })
      }
      <div>
        <input type="text" value={content} onChange={changeContent} />
        <input type="button" value="add list" onClick={addList} />
      </div>
    </div>
  )
};
