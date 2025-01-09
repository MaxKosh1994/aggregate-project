import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function TextEditor({ onChange }: { onChange: (text: string) => void }): React.JSX.Element {
  const [value, setValue] = useState('');

  const handleChange = (content: string): void => {
    setValue(content);
    onChange(content);
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      placeholder="Введите текст здесь..."
      className="text-editor"
    />
  );
}
