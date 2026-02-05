import React, { useState, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeExampleBlockLive = ({ code, language, stdin }) => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCode, setUserCode] = useState(code || '');
  const [userInput, setUserInput] = useState(stdin || '');
  const [languages, setLanguages] = useState([]);

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
          language,
          source: userCode,
          stdin: userInput,
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
      <div>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Code:</label>
        <textarea
          value={userCode}
          onChange={e => setUserCode(e.target.value)}
          style={{ width: '100%', fontFamily: 'monospace', minHeight: '120px', marginBottom: '1rem' }}
        />
      </div>

      <div>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Input (optional):</label>
        <textarea
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          style={{ width: '100%', fontFamily: 'monospace', minHeight: '60px', marginBottom: '1rem' }}
        />
      </div>

      <button
        onClick={runCode}
        disabled={loading || !userCode || !language}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Running...' : 'Run Code'}
      </button>

      <div>
        <h4>Output:</h4>
        {output && (
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

      <h4>Code Preview:</h4>
      <SyntaxHighlighter language={language} style={coy}>
        {userCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeExampleBlockLive;
