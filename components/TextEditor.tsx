import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';

interface PageProps {
  parentContent: string;
  changeParentContent: (val: string) => void;
}
const TextEditor = ({ parentContent, changeParentContent }: PageProps): JSX.Element => {
  const SunEditor = dynamic(() => import('suneditor-react'), {
    ssr: false
  });

  const [content, setContent] = useState('');

  const handleBlur = (event: any, editorContents: string) => {
    changeParentContent(editorContents);
  };

  useEffect(() => {
    setContent(parentContent);
  }, [parentContent]);

  return (
    <SunEditor
      defaultValue={content}
      onBlur={handleBlur}
      height="100%"
      width="100%"
      setOptions={{
        buttonList: [
          ['undo', 'redo'],
          ['font', 'fontSize', 'formatBlock'],
          ['paragraphStyle', 'blockquote'],
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          ['fontColor', 'hiliteColor', 'textStyle'],
          ['removeFormat'],
          '/',
          ['outdent', 'indent'],
          ['align', 'horizontalRule', 'list', 'lineHeight'],
          ['table', 'link', 'image', 'video', 'audio'],
          ['fullScreen', 'showBlocks', 'codeView']
        ]
      }}
    />
  );
};

export default TextEditor;
