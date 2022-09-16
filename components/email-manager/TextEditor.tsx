import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';
import { Grid } from '@mui/material';

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
    <Grid container item alignItems="flex-start" sx={{ pt: { xs: 2, sm: 4 } }}>
      <Grid item xs={12}>
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
      </Grid>
      {/* <Grid item xs={6} pl={4}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </Grid> */}
    </Grid>
  );
};

export default TextEditor;
