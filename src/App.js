
import React, { useState, useRef } from 'react';
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
  // Helper to detect language from code
  function detectLanguage(code) {
    if (/^\s*#include\s*<iostream>/m.test(code)) return 'cpp';
    if (/^\s*public\s+class\s+/m.test(code)) return 'java';
    if (/^\s*def\s+|^\s*import\s+|^\s*print\s*\(/m.test(code)) return 'python';
    if (/^\s*function\s+|^\s*const\s+|^\s*let\s+|^\s*var\s+|console\.log/m.test(code)) return 'javascript';
    return null;
  }
  const defaultTemplates = {
    javascript: '// Write your code here',
    python: '# Write your code here',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  };
  const [language, setLanguage] = useState(languages[0].id);
  const [code, setCode] = useState(defaultTemplates[languages[0].value]);
  const outputSectionRef = useRef(null);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleRun = async () => {
    setIsLoading(true);
    setOutput('');
    // Add active class to output section for hover effect
    if (outputSectionRef.current) {
      outputSectionRef.current.classList.add('active');
      setTimeout(() => {
        outputSectionRef.current.classList.remove('active');
      }, 1800);
    }
    // Remove comment lines starting with // for all languages before running
    let codeToRun = code.split('\n').filter(line => !line.trim().startsWith('//')).join('\n');
    const RAPIDAPI_KEY = 'ab358d09d8msh9a0844b081be905p12a8dejsnf9825df8e863';
    try {
      const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        source_code: codeToRun,
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

  // Detect language on code change
  const handleCodeChange = (value) => {
    setCode(value);
    const detected = detectLanguage(value);
    if (detected) {
      const langObj = languages.find(l => l.value === detected);
      if (langObj && langObj.id !== language) {
        setLanguage(langObj.id);
      }
    }
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
              onChange={handleCodeChange}
              theme={theme}
              options={{ fontSize: 16, minimap: { enabled: false } }}
            />
          </div>
          <div className="App-output-section" ref={outputSectionRef}>
            <h3 className="App-output-title">Output</h3>
            <pre className="App-output-box" tabIndex={0}>{output}</pre>
          </div>
        </div>
        {showToast && (
          <div className="App-toast">{toastMsg}</div>
        )}
      </div>
      <footer className="App-footer">
        <span>Made with <span style={{color:'#ff4081'}}>❤</span> for students</span>
      </footer>
    </div>
  );
}

export default App;