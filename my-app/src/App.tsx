import React, { useRef, useState } from 'react';
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

type ActionType = 'text' | 'images' | 'links' | 'qa' | null;

function App() {
    const uploadSectionRef = useRef<HTMLElement>(null);
    const featuresSectionRef = useRef<HTMLElement>(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [selectedAction, setSelectedAction] = useState<ActionType>(null);
    const [extractedContent, setExtractedContent] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(''); // State to store the answer

    const handleUploadClick = () => {
        uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            setIsFileUploaded(true);
            setSelectedAction(null);
            setExtractedContent('');
            setAnswer(''); // Clear previous answer
            setQuestion('');

            // Upload to backend
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await axios.post('http://127.0.0.1:8000/upload/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('File uploaded:', res.data);
            } catch (error) {
                console.error('Upload failed:', error);
                alert('Failed to upload the file.');
                setIsFileUploaded(false);
            }
        }
    };

    const handleCopyContent = () => {
        navigator.clipboard.writeText(extractedContent);
    };

    const handleActionClick = async (action: ActionType) => {
        if (!uploadedFile) {
            alert("Please upload a document first.");
            return;
        }

        setSelectedAction(action);
        setExtractedContent("Processing...");
        setAnswer(''); // Clear previous answer

        try {
            let backendEndpoint = '';
            let response;

            switch (action) {
                case 'text':
                    backendEndpoint = `http://127.0.0.1:8000/extract-text/?filename=${uploadedFile.name}`;
                    response = await axios.get(backendEndpoint);
                    if (response?.data?.text) {
                        setExtractedContent(response.data.text);
                    } else {
                        setExtractedContent("Error: No text data received.");
                    }
                    break;
                case 'images':
                    backendEndpoint = `http://127.0.0.1:8000/extract-images/?filename=${uploadedFile.name}`;
                    response = await axios.get(backendEndpoint);
                    if (response?.data?.image_paths) {
                        setExtractedContent(response.data.image_paths.join('\n'));
                    } else {
                        setExtractedContent("Error: No image data received.");
                    }
                    break;
                case 'links':
                    backendEndpoint = `http://127.0.0.1:8000/extract-links/?filename=${uploadedFile.name}`;
                    response = await axios.get(backendEndpoint);
                    if (response?.data?.links) {
                        setExtractedContent(response.data.links.join('\n'));
                    } else {
                        setExtractedContent("Error: No link data received.");
                    }
                    break;
                case 'qa':
                    backendEndpoint = 'http://127.0.0.1:8000/ask-question/';
                    const formData = new FormData();
                    formData.append('filename', uploadedFile.name);
                    formData.append('question', question);
                    response = await axios.post(backendEndpoint, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (response?.data?.answer) {
                        // Store the answer in the answer state
                        setAnswer(response.data.answer);
                        setExtractedContent(''); // Clear extracted content
                    } else {
                        setAnswer("Error: No answer received.");
                        setExtractedContent('');
                    }
                    break;
                default:
                    return;
            }
            console.log("Response data for", action, ":", response?.data);

        } catch (error: any) {
            console.error("Error calling backend:", error);
            setExtractedContent(`Error: ${error.message || 'An unexpected error occurred.'}`);
            setAnswer('');
        }
    };

    const renderActionResult = () => (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => {
                            setSelectedAction(null);
                            setAnswer(''); // Clear answer when going back
                            setQuestion('');
                        }}
                        className="flex items-center text-gray-600 hover:text-purple-600 transition"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Choose Another Action
                    </button>
                    {selectedAction !== 'qa' && (
                        <button
                            onClick={handleCopyContent}
                            className="flex items-center text-purple-600 hover:text-purple-700 transition"
                        >
                            <Copy className="w-5 h-5 mr-2" />
                            Copy to Clipboard
                        </button>
                    )}
                </div>

                <h2 className="text-3xl font-bold mb-6">
                    {selectedAction === 'text' && 'Extracted Text'}
                    {selectedAction === 'images' && 'Extracted Images'}
                    {selectedAction === 'links' && 'Extracted Links'}
                    {selectedAction === 'qa' && 'Ask Questions'}
                </h2>

                {selectedAction === 'qa' ? (
                    <div className="space-y-4">
                        <textarea
                            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-600 transition"
                            placeholder="Ask a question about your document..."
                            rows={4}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <button
                            onClick={() => handleActionClick('qa')}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            Ask Question
                        </button>
                        {answer && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Answer:</h3>
                                <p className="whitespace-pre-wrap">{answer}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <pre className="whitespace-pre-wrap">{extractedContent}</pre>
                    </div>
                )}
            </div>
        </div>
    );

    const handleLearnMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        featuresSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
            {/* Header Section */}
            <header className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-6xl font-bold mb-6">
                    Welcome to <span className="text-purple-600">DocAnalyzer</span>
                </h1>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                    Transform your documents into actionable insights. Upload any file and let our intelligent parser do the heavy lifting for you.
                </p>
                <div className="flex gap-4 justify-center mt-8">
                    <button
                        onClick={handleUploadClick}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                        Upload Document
                    </button>
                    <button
                        onClick={handleLearnMoreClick}
                        className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
                    >
                        Learn More
                    </button>
                </div>
            </header>

            {/* Features Section */}
            <section ref={featuresSectionRef} className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
                <div className="grid md:grid-cols-4 gap-8">
                    {[
                        { icon: Search, title: 'Smart Document Analysis', desc: 'Advanced parsing capabilities for various document formats' },
                        { icon: Cpu, title: 'AI-Powered Extraction', desc: 'Intelligent content extraction using cutting-edge AI technology' },
                        { icon: Lock, title: 'Secure Processing', desc: 'Your documents are processed securely and privately' },
                        { icon: MessageSquare, title: 'Q&A Feature', desc: 'Ask questions and get answers based on document content' },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="bg-white p-8 rounded-xl shadow-lg text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">{title}</h3>
                            <p className="text-gray-600">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Upload Section */}
            <section ref={uploadSectionRef} className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-center mb-4">
                    Upload Your <span className="text-purple-600">Documents</span>
                </h2>
                <p className="text-center text-gray-600 mb-12">
                    Our intelligent parser will analyze your documents in seconds
                </p>
                <label className="max-w-3xl mx-auto border-2 border-dashed border-purple-200 rounded-xl p-12 text-center bg-white block cursor-pointer hover:border-purple-400 transition">
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".pdf,.png,.jpg,.jpeg,.tiff"
                    />
                    <div className="mb-6">
                        <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-gray-600 mb-2">Drag & drop your files here, or click to select files</p>
                    <p className="text-sm text-gray-500">Supported formats: PDF, PNG, JPG, JPEG, TIFF</p>
                </label>
            </section>

            {/* Actions Section */}
            {isFileUploaded && !selectedAction && (
                <section className="container mx-auto px-4 py-16">
                    <h2 className="text-4xl font-bold text-center mb-4">
                        Choose an <span className="text-purple-600">Action</span>
                    </h2>
                    <p className="text-center text-gray-600 mb-12">
                        Select what you'd like to do with "{uploadedFile?.name}"
                    </p>
                    <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {[
                            { type: 'text' as ActionType, icon: List, title: 'Extract Text', desc: 'Extract plain text content from the document' },
                            { type: 'images' as ActionType, icon: Image, title: 'Extract Images', desc: 'Extract all images from the document' },
                            { type: 'links' as ActionType, icon: LinkIcon, title: 'Extract Links', desc: 'Get all links mentioned in the document' },
                            { type: 'qa' as ActionType, icon: MessageSquare, title: 'Q&A', desc: 'Ask questions about your document content' },
                        ].map(({ type, icon: Icon, title, desc }) => (
                            <div
                                key={type}
                                onClick={() => handleActionClick(type)}
                                className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-purple-50 group"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-100">
                                    <Icon className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-600">{title}</h3>
                                <p className="text-gray-600">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Result Section */}
            {selectedAction && renderActionResult()}

            {/* Footer Section */}
            <footer className="bg-gray-900 text-gray-300 py-16 mt-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Document Parser</h3>
                            <p className="text-gray-400">
                                Transform your documents into structured data with our
                                powerful AI-driven parsing solution.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition">Home</a></li>
                                <li><a href="#" className="hover:text-white transition">Features</a></li>
                                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Connect</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="hover:text-white transition">
                                    <Github className="w-6 h-6" />
                                </a>
                                <a href="#" className="hover:text-white transition">
                                    <Twitter className="w-6 h-6" />
                                </a>
                                <a href="#" className="hover:text-white transition">
                                    <Linkedin className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                        <p>© 2025 Document Parser. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
    export default App;