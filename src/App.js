
import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';

const languages = [
  { id: 63, name: 'JavaScript', value: 'javascript' },
  { id: 71, name: 'Python', value: 'python' },
  { id: 54, name: 'C++', value: 'cpp' },
  { id: 62, name: 'Java', value: 'java' },
];

function App() {
  const defaultTemplates = {
    javascript: '// Write your code here',
    python: '# Write your code here',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  };
  const [language, setLanguage] = useState(languages[0].id);
  const [code, setCode] = useState(defaultTemplates[languages[0].value]);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    setOutput('');
    // TODO: Replace 'your_actual_key_here' with your RapidAPI key from https://rapidapi.com/
    const RAPIDAPI_KEY = 'ab358d09d8msh9a0844b081be905p12a8dejsnf9825df8e863';
    try {
      const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        source_code: code,
        language_id: language,
      }, {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY, // <-- Add your RapidAPI key here
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      });
      setOutput(response.data.stdout || response.data.stderr || response.data.compile_output || 'No output');
    } catch (err) {
      setOutput('Error running code');
    }
    setIsLoading(false);
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <h2>Online Code Compiler</h2>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="language">Language: </label>
        <select
          id="language"
          value={language}
          onChange={e => {
            const selectedId = Number(e.target.value);
            setLanguage(selectedId);
            const selectedLang = languages.find(l => l.id === selectedId)?.value;
            if (selectedLang && defaultTemplates[selectedLang]) {
              setCode(defaultTemplates[selectedLang]);
            }
          }}
        >
          {languages.map(lang => (
            <option key={lang.id} value={lang.id}>{lang.name}</option>
          ))}
        </select>
      </div>
      <MonacoEditor
        height="300px"
        language={languages.find(l => l.id === language)?.value || 'javascript'}
        value={code}
        onChange={value => setCode(value)}
        theme="vs-dark"
      />
      <button onClick={handleRun} disabled={isLoading} style={{ marginTop: 10 }}>
        {isLoading ? 'Running...' : 'Run'}
      </button>
      <div style={{ marginTop: 20 }}>
        <h3>Output:</h3>
        <pre style={{ background: '#222', color: '#fff', padding: 10 }}>{output}</pre>
      </div>
    </div>
  );
}

export default App;
