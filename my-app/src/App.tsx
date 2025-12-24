import React, { useRef, useState } from 'react';
import Landing from './Landing';
import {
  Search,
  Cpu,
  Lock,
  Upload,
  List,
  Image,
  Link as LinkIcon,
  MessageSquare,
  Copy,
  ArrowLeft,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import axios from 'axios';

type ActionType = 'text' | 'images' | 'links' | 'qa' | 'summary' | null;

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const uploadSectionRef = useRef<HTMLElement>(null);
  const featuresSectionRef = useRef<HTMLElement>(null);
  const actionSectionRef = useRef<HTMLElement>(null);
  const learnMoreSectionRef = useRef<HTMLElement>(null);

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [extractedContent, setExtractedContent] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  if (showLanding && !isFileUploaded && !selectedAction) {
    return <Landing onGetStarted={() => setShowLanding(false)} />;
  }

  const handleUploadClick = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLearnMoreClick = () => {
    learnMoreSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsFileUploaded(true);
    setUploadSuccess(false);
    setSelectedAction(null);
    setExtractedContent('');
    setQuestion('');
    setAnswer('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://127.0.0.1:8000/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadSuccess(true);

      setTimeout(() => {
        actionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch {
      alert('Failed to upload the file.');
      setIsFileUploaded(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(extractedContent);
  };

  const handleActionClick = async (action: ActionType) => {
    if (!uploadedFile) {
      alert('Please upload a document first.');
      return;
    }

    setSelectedAction(action);
    setExtractedContent('Processing...');
    setAnswer('');

    try {
      let response;

      if (action === 'text') {
        response = await axios.get(
          `http://127.0.0.1:8000/extract-text/?filename=${uploadedFile.name}`
        );
        setExtractedContent(response.data?.text || '');
      }

      if (action === 'images') {
        response = await axios.get(
          `http://127.0.0.1:8000/extract-images/?filename=${uploadedFile.name}`
        );
        setExtractedContent(response.data?.image_paths?.join('\n') || '');
      }

      if (action === 'links') {
        response = await axios.get(
          `http://127.0.0.1:8000/extract-links/?filename=${uploadedFile.name}`
        );
        setExtractedContent(response.data?.links?.join('\n') || '');
      }

      if (action === 'summary') {
        response = await axios.get(
          `http://127.0.0.1:8000/summarize-document/?filename=${uploadedFile.name}`
        );
        setExtractedContent(response.data?.summary || '');
      }

      if (action === 'qa') {
        const fd = new FormData();
        fd.append('filename', uploadedFile.name);
        fd.append('question', question);

        response = await axios.post(
          'http://127.0.0.1:8000/ask-question/',
          fd
        );

        setAnswer(response.data?.answer || '');
        setExtractedContent('');
      }

    } catch {
      setExtractedContent('Error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100">

      {/* HEADER */}
      <header className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6">
          Welcome to <span className="text-purple-600">DocAnalyzer</span>
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Transform your documents into actionable insights using AI-powered extraction, summarization and Q&A.
        </p>
        <div className="flex gap-4 justify-center mt-10">
          <button
            onClick={handleUploadClick}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 hover:scale-105 transition"
          >
            Upload Document
          </button>
          <button
            onClick={handleLearnMoreClick}
            className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 hover:scale-105 transition"
          >
            Learn More
          </button>
        </div>
      </header>

      {/* FEATURES */}
      <section ref={featuresSectionRef} className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>

        <div className="grid md:grid-cols-5 gap-8">
          {[
            { icon: Search, title: 'Smart Document Analysis', desc: 'Advanced parsing for multiple formats' },
            { icon: Cpu, title: 'AI-Powered Extraction', desc: 'Cutting-edge AI intelligence' },
            { icon: Cpu, title: 'Document Summarization', desc: 'Structured, explainable summaries with key insights' },
            { icon: Lock, title: 'Secure Processing', desc: 'Your data stays private' },
            { icon: MessageSquare, title: 'Q&A Feature', desc: 'Ask questions from documents' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-purple-300/40"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Icon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UPLOAD */}
      <section ref={uploadSectionRef} className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">
          Upload Your <span className="text-purple-600">Documents</span>
        </h2>

        <label className="max-w-3xl mx-auto block border-2 border-dashed border-purple-300 rounded-xl p-14 bg-white text-center cursor-pointer hover:bg-purple-50 transition">
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.png,.jpg,.jpeg,.tiff"
          />
          <Upload className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">
            Drag & drop your file or click to upload
          </p>

          {uploadSuccess && (
            <p className="mt-4 text-green-600 font-semibold">
              ✔ File uploaded successfully
            </p>
          )}
        </label>
      </section>

      {/* LEARN MORE */}
      <section ref={learnMoreSectionRef} className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-8">
          How <span className="text-purple-600">DocAnalyzer</span> Helps
        </h2>
        <p className="max-w-4xl mx-auto text-center text-gray-700 text-lg leading-relaxed">
          DocAnalyzer eliminates manual document review by intelligently extracting text,
          images, links and generating structured summaries. Users gain instant clarity
          through explainable summaries and AI-powered Q&A, dramatically improving speed,
          accuracy and productivity across document-heavy workflows.
        </p>
      </section>

      {/* ACTIONS */}
      {isFileUploaded && !selectedAction && (
        <section ref={actionSectionRef} className="container mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Choose an <span className="text-purple-600">Action</span>
          </h2>

          <div className="grid md:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {[
              { type: 'text', icon: List, title: 'Extract Text' },
              { type: 'images', icon: Image, title: 'Extract Images' },
              { type: 'links', icon: LinkIcon, title: 'Extract Links' },
              { type: 'summary', icon: Cpu, title: 'Summarize Document' },
              { type: 'qa', icon: MessageSquare, title: 'Ask Questions' },
            ].map(({ type, icon: Icon, title }) => (
              <div
                key={type}
                onClick={() => handleActionClick(type as ActionType)}
                className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer transition-all hover:scale-105 hover:shadow-purple-300/50"
              >
                <Icon className="w-10 h-10 mx-auto text-purple-600 mb-4" />
                <h3 className="font-semibold">{title}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RESULT */}
      {selectedAction && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between mb-6">
              <button
                onClick={() => setSelectedAction(null)}
                className="flex items-center text-purple-600"
              >
                <ArrowLeft className="mr-2" /> Back
              </button>
              {selectedAction !== 'qa' && <button onClick={handleCopyContent}><Copy /></button>}
            </div>

            <h2 className="text-2xl font-bold mb-4">
              {selectedAction === 'text' && 'Here is the extracted text'}
              {selectedAction === 'images' && 'Here are the extracted images'}
              {selectedAction === 'links' && 'Here are the extracted links'}
              {selectedAction === 'summary' && 'Here is the structured document summary'}
              {selectedAction === 'qa' && 'Ask Questions'}
            </h2>

            {selectedAction === 'qa' ? (
              <>
                <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  className="w-full p-4 border rounded-lg mb-4"
                />
                <button
                  onClick={() => handleActionClick('qa')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg"
                >
                  Ask Question
                </button>
                {answer && <p className="mt-6">{answer}</p>}
              </>
            ) : (
              <pre className="whitespace-pre-wrap">{extractedContent}</pre>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-gradient-to-br from-slate-800 via-indigo-900 to-purple-900 text-gray-300 py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Document Parser</h3>
            <p className="text-gray-400">AI-driven document intelligence.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>Home</li>
              <li>Features</li>
              <li>Documentation</li>
            </ul>
          </div>
          <div className="flex space-x-4">
            <Github />
            <Twitter />
            <Linkedin />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
