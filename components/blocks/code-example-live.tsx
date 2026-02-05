'use client';

import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  code: string;
  language: string;
  stdin?: string;
}

export const CodeExampleBlockLive: React.FC<Props> = ({ code, language, stdin }) => {
  const [input, setInput] = useState(stdin || '');
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          version: '*',
          files: [{ name: 'code', content: code }],
          stdin: input,
        }),
      });

      const data = await res.json();
      if (data.output) setOutput(data.output);
      else setOutput('No output returned.');
    } catch (err: any) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 mb-8">
      <h2 className="text-xl font-semibold mb-2">{language} Example</h2>

      <label className="block font-medium mt-2">Code:</label>
      <SyntaxHighlighter language={language} style={coy}>
        {code}
      </SyntaxHighlighter>

      <label className="block font-medium mt-2">Input (optional):</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Optional stdin"
        className="w-full border p-2 rounded font-mono min-h-[60px]"
      />

      <button
        onClick={runCode}
        disabled={loading}
        className="mt-3 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? 'Running...' : 'Run'}
      </button>

      {output && (
        <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
};
