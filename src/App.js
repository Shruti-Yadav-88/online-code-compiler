
import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';

const languages = [
  { id: 63, name: 'JavaScript', value: 'javascript', icon: '🟨' },
  { id: 71, name: 'Python', value: 'python', icon: '🐍' },
  { id: 54, name: 'C++', value: 'cpp', icon: '💙' },
  { id: 62, name: 'Java', value: 'java', icon: '☕' },
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
  const [theme, setTheme] = useState('vs-dark');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleRun = async () => {
    setIsLoading(true);
    setOutput('');
    const RAPIDAPI_KEY = 'ab358d09d8msh9a0844b081be905p12a8dejsnf9825df8e863';
    try {
      const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        source_code: code,
        language_id: language,
      }, {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      });
      setOutput(response.data.stdout || response.data.stderr || response.data.compile_output || 'No output');
      setToastMsg('Code executed successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setOutput('Error running code');
      setToastMsg('Error running code!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
    setIsLoading(false);
  };

  const handleThemeSwitch = () => {
    setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark');
  };

  return (
    <div className="App-bg">
      <header className="App-header-bar-centered">
        <h1 className="App-title-centered">⚡ Online Code Compiler</h1>
        <button className="App-theme-btn" onClick={handleThemeSwitch}>
          {theme === 'vs-dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <div className="App-container">
        <div className="App-card glass">
          <div className="App-controls">
            <select
              className="App-select"
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
                <option key={lang.id} value={lang.id}>{lang.icon} {lang.name}</option>
              ))}
            </select>
            <button className="App-run-btn" onClick={handleRun} disabled={isLoading}>
              {isLoading ? (
                <span className="App-spinner"></span>
              ) : (
                'Run ▶'
              )}
            </button>
          </div>
          <div className="App-editor">
            <MonacoEditor
              height="350px"
              language={languages.find(l => l.id === language)?.value || 'javascript'}
              value={code}
              onChange={value => setCode(value)}
              theme={theme}
              options={{ fontSize: 16, minimap: { enabled: false } }}
            />
          </div>
          <div className="App-output-section">
            <h3 className="App-output-title">Output</h3>
            <pre className="App-output-box" style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '1.25rem' }}>{output}</pre>
          </div>
        </div>
        {showToast && (
          <div className="App-toast">{toastMsg}</div>
        )}
      </div>
      <footer className="App-footer">
        <span>Made with <span style={{color:'#ff4081'}}>❤</span> by Shruti Yadav</span>
      </footer>
    </div>
  );
}

export default App;