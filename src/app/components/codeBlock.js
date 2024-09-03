import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, code }) => (
  <SyntaxHighlighter language={language} style={okaidia}>
    {code}
  </SyntaxHighlighter>
);

export default CodeBlock;
