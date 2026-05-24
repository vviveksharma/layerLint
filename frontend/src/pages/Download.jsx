import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowLeft, FiGithub, FiMonitor } from 'react-icons/fi';
import { SiApple, SiLinux } from 'react-icons/si';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Download = () => {
  const [selectedOS, setSelectedOS] = useState('Darwin');
  const [selectedArch, setSelectedArch] = useState('x86_64');
  const [selectedVersion, setSelectedVersion] = useState('v1.0.1');
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/repos/vviveksharma/layerLint/releases')
      .then(res => res.json())
      .then(data => {
        setReleases(data);
        if (data.length > 0) {
          setSelectedVersion(data[0].tag_name);
        }
        setLoading(false);
      })
      .catch(() => {
        setReleases([
          { tag_name: 'v1.0.1', name: 'v1.0.1' },
          { tag_name: 'v1.0.0', name: 'v1.0.0' }
        ]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
      setSelectedOS('Darwin');
      const isMacARM = userAgent.includes('arm') || navigator.platform === 'MacIntel';
      setSelectedArch('arm64');
    } else if (userAgent.includes('linux')) {
      setSelectedOS('Linux');
      setSelectedArch('x86_64');
    } else if (userAgent.includes('win')) {
      setSelectedOS('Windows');
      setSelectedArch('x86_64');
    }
  }, []);

  const osOptions = [
    { name: 'macOS', value: 'Darwin', icon: SiApple, archs: ['arm64', 'x86_64'] },
    { name: 'Linux', value: 'Linux', icon: SiLinux, archs: ['x86_64', 'arm64'] },
    { name: 'Windows', value: 'Windows', icon: FiMonitor, archs: ['x86_64'] }
  ];

  const currentOS = osOptions.find(os => os.value === selectedOS);

  const buildDownloadURL = () => {
    const release = releases.find(r => r.tag_name === selectedVersion);
    if (release && release.assets) {
      const ext = selectedOS === 'Windows' ? 'zip' : 'tar.gz';
      const version = selectedVersion.replace('v', '');
      const assetName = `layerLint_${version}_${selectedOS}_${selectedArch}.${ext}`;
      const asset = release.assets.find(a => a.name === assetName);
      
      if (asset?.browser_download_url) {
        return asset.browser_download_url;
      }
    }
    
    const version = selectedVersion.replace('v', '');
    const ext = selectedOS === 'Windows' ? 'zip' : 'tar.gz';
    return `https://github.com/vviveksharma/layerLint/releases/download/${selectedVersion}/layerLint_${version}_${selectedOS}_${selectedArch}.${ext}`;
  };

  const handleDownload = () => {
    const url = buildDownloadURL();
    window.open(url, '_blank');
  };

  const getInstallCommand = () => {
    if (selectedOS === 'Windows') {
      return '# Extract zip and add layerlint.exe to PATH';
    }
    return `# Download and extract
curl -sSL ${buildDownloadURL()} | tar xz
chmod +x layerlint
sudo mv layerlint /usr/local/bin/`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8">
            <FiArrowLeft />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Download</span>
            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mt-4 mb-6">
              Get LayerLint
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your platform and start optimizing your Dockerfiles in seconds
            </p>
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg mb-8"
          >
            {/* OS Selection */}
            <div className="mb-6">
              <label className="block text-gray-900 text-sm font-semibold mb-3">
                Operating System
              </label>
              <div className="grid grid-cols-3 gap-4">
                {osOptions.map((os) => {
                  const Icon = os.icon;
                  return (
                    <motion.button
                      key={os.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedOS(os.value);
                        if (!os.archs.includes(selectedArch)) {
                          setSelectedArch(os.archs[0]);
                        }
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedOS === os.value
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 bg-white hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">{os.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Architecture Selection */}
            <div className="mb-6">
              <label className="block text-gray-900 text-sm font-semibold mb-3">
                Architecture
              </label>
              <div className="flex gap-4">
                {currentOS?.archs.map((arch) => (
                  <motion.button
                    key={arch}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedArch(arch)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                      selectedArch === arch
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-900'
                    }`}
                  >
                    <span className="font-mono text-sm font-medium">{arch}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Version Selection */}
            <div className="mb-8">
              <label className="block text-gray-900 text-sm font-semibold mb-3">
                Version
              </label>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                disabled={loading}
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <option>Loading versions...</option>
                ) : (
                  releases.map((release, index) => (
                    <option key={release.tag_name} value={release.tag_name}>
                      {release.tag_name} {index === 0 ? '(latest)' : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Download Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              disabled={loading}
              className="w-full bg-gray-900 text-white font-medium py-4 rounded-full flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload className="w-5 h-5" />
              Download LayerLint {selectedVersion} for {currentOS?.name} ({selectedArch})
            </motion.button>

            {/* Install Instructions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-900 text-xs font-semibold mb-2">Installation:</p>
              <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap overflow-x-auto">
                {getInstallCommand()}
              </pre>
            </div>
          </motion.div>

          {/* Alternative Options */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center space-y-6"
          >
            <a
              href="https://github.com/vviveksharma/layerLint/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              <FiGithub className="w-4 h-4" />
              View all releases on GitHub
            </a>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-4">Other Installation Methods</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <h4 className="text-gray-900 font-medium mb-3 text-base">Install Script (Linux/macOS)</h4>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <code className="text-xs text-gray-700 font-mono block break-all">
                      curl -sSL https://raw.githubusercontent.com/vviveksharma/layerLint/main/install.sh | bash
                    </code>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <h4 className="text-gray-900 font-medium mb-3 text-base">Build from Source</h4>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto space-y-1">
                    <code className="text-xs text-gray-700 font-mono block break-all">
                      git clone https://github.com/vviveksharma/layerLint.git
                    </code>
                    <code className="text-xs text-gray-700 font-mono block">
                      cd layerLint && go build ./cmd/layerlint
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Download;
