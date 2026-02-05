import React, { useState, useEffect } from 'react';
import { InlineTextarea, InlineGroup } from 'react-tinacms-inline';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { coy, okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Template } from 'tinacms';

const CodeExampleBlock = ({ index, data }) => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [expandedOutput, setExpandedOutput] = useState(true);

  // Fetch supported languages from Piston
  useEffect(() => {
    fetch('https://emkc.org/api/v2/piston/runtimes')
      .then(res => res.json())
      .then(data => setLanguages(data.map(l => l.language)))
      .catch(() => setLanguages(['javascript', 'python', 'go', 'ruby']));
  }, []);

  const runCode = async () => {
    setLoading(true);
    setOutput('');
    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: data.language || 'javascript',
          source: data.code || '',
          stdin: data.stdin || '',
        }),
      });

      if (!response.ok) throw new Error('Execution API failed');

      const result = await response.json();
      const outputText = (result.run?.stdout || '') + (result.run?.stderr || '');
      setOutput(outputText || 'No output');
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
      <InlineGroup name={`blocks.${index}`}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Title:</label>
        <InlineTextarea name="title" placeholder="Code Example Title" />

        <label style={{ fontWeight: 'bold', display: 'block', margin: '1rem 0 0.5rem' }}>Code:</label>
        <InlineTextarea
          name="code"
          placeholder={`// Write your code here`}
          style={{ fontFamily: 'monospace', minHeight: '120px' }}
        />

        <label style={{ fontWeight: 'bold', display: 'block', margin: '1rem 0 0.5rem' }}>Language:</label>
        <select
          value={data.language || ''}
          onChange={e => (data.language = e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}
        >
          <option value="">Select language</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <label style={{ fontWeight: 'bold', display: 'block', margin: '0.5rem 0' }}>Input (stdin, optional):</label>
        <InlineTextarea
          name="stdin"
          placeholder="Optional input for your code"
          style={{ fontFamily: 'monospace', minHeight: '60px' }}
        />
      </InlineGroup>

      <button
        onClick={runCode}
        disabled={loading || !data.code || !data.language}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Running...' : 'Run / Preview'}
      </button>

      <div style={{ marginTop: '1rem' }}>
        <h4>Code Preview:</h4>
        <SyntaxHighlighter language={data.language || 'javascript'} style={coy}>
          {data.code || ''}
        </SyntaxHighlighter>

        {output && (
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setExpandedOutput(!expandedOutput)}
              style={{
                marginBottom: '0.5rem',
                padding: '0.25rem 0.5rem',
                background: '#eee',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {expandedOutput ? 'Collapse Output' : 'Expand Output'}
            </button>

            {expandedOutput && (
              <div
                style={{
                  padding: '1rem',
                  background: '#f7f7f7',
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  color: output.startsWith('Error:') ? 'red' : 'green',
                  position: 'relative',
                }}
              >
                <button
                  onClick={() => copyToClipboard(output)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Copy
                </button>
                {output}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeExampleBlock;

export const codeExampleBlockSchema: Template = {
  name: 'codeExample',
  label: 'Code Example',
  ui: {
    previewSrc: '/blocks/code-example.png',
    defaultItem: {
      title: 'Code Example',
      code: 'console.log("Hello World");',
      language: 'javascript',
      stdin: '',
    },
  },
  fields: [
    { type: 'string', label: 'Title', name: 'title' },
    { type: 'string', label: 'Language', name: 'language' },
    { type: 'string', label: 'Code', name: 'code', ui: { component: 'textarea' } },
    { type: 'string', label: 'Input (optional)', name: 'stdin', ui: { component: 'textarea' } },
  ],
};

