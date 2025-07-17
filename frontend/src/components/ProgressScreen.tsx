
import { useState } from 'react';
import { Home, ArrowLeft, Share2, Download, Brain, FileText, Briefcase, Star } from 'lucide-react';

interface ProgressScreenProps {
  onNavigate: (screen: 'wallet' | 'progress' | 'emergency' | 'setup') => void;
}

export const ProgressScreen = ({ onNavigate }: ProgressScreenProps) => {
  const [shareEnabled, setShareEnabled] = useState(false);

  // Progress data
  const progressData = {
    sessions: { completed: 8, total: 12, label: 'Sessions completed' },
    skills: { completed: 5, total: 8, label: 'Skills learned' },
    applications: { completed: 3, total: 5, label: 'Job attempts' }
  };

  const overallProgress = Math.round(
    ((progressData.sessions.completed / progressData.sessions.total) +
     (progressData.skills.completed / progressData.skills.total) +
     (progressData.applications.completed / progressData.applications.total)) / 3 * 100
  );

  console.log('Progress calculated:', overallProgress);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-purple-600';
    if (percentage >= 40) return 'text-blue-600';
    return 'text-gray-600';
  };

  const CircularProgress = ({ percentage, size = 120 }: { percentage: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgb(243 244 246)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgb(147 51 234)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-light ${getProgressColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('setup')}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg border border-purple-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Setup</span>
          </button>
          <button
            onClick={() => onNavigate('wallet')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Safe Space</span>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-gray-800 mb-2">Your Path</h1>
          <p className="text-gray-600">Every step forward matters</p>
        </div>

        {/* Main Progress Card */}
        <div className="mira-card p-8 mb-6 text-center">
          <div className="mb-6">
            <CircularProgress percentage={overallProgress} />
          </div>
          
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Overall Progress
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            You're building something beautiful
          </p>

          {/* Individual Progress Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800">
                    {progressData.sessions.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {progressData.sessions.completed} of {progressData.sessions.total}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-purple-600">
                  {Math.round((progressData.sessions.completed / progressData.sessions.total) * 100)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800">
                    {progressData.skills.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {progressData.skills.completed} of {progressData.skills.total}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">
                  {Math.round((progressData.skills.completed / progressData.skills.total) * 100)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Briefcase className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800">
                    {progressData.applications.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {progressData.applications.completed} of {progressData.applications.total}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">
                  {Math.round((progressData.applications.completed / progressData.applications.total) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Progress */}
        <div className="mira-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-800">Share My Progress</h3>
              <p className="text-xs text-gray-600">Create proof of your achievements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={shareEnabled}
                onChange={(e) => setShareEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {shareEnabled && (
            <div className="space-y-3 animate-slide-up">
              <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share with Support Team</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download Certificate</span>
              </button>
            </div>
          )}
        </div>

        {/* Encouragement */}
        <div className="mt-6 text-center">
          <Star className="w-5 h-5 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {overallProgress >= 75 ? "You're doing amazingly well!" :
             overallProgress >= 50 ? "You're making great progress!" :
             overallProgress >= 25 ? "Every step counts - keep going!" :
             "Your journey is just beginning"}
          </p>
        </div>
      </div>
    </div>
  );
};
