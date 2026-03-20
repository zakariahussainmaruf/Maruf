import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signOut, db } from './src/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import Header from './components/Header';
import Hero from './components/Hero';
import PracticeTests from './components/PracticeTests';
import Mission from './components/Mission';
import Footer from './components/Footer';
import TestModal from './components/TestModal';
import AuthModal from './components/AuthModal';
import ResourceModal from './components/ResourceModal';
import NotificationPanel from './components/NotificationPanel';
import ModuleStudyPage from './components/ModuleStudyPage';
import ServicesPage from './components/ServicesPage';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import StudyGallery from './components/StudyGallery';
import ParallaxShapes from './components/ParallaxShapes';
import RainEffect from './components/RainEffect';
import RocketAnimation from './components/RocketAnimation';

type View = 'landing' | 'reading' | 'listening' | 'writing' | 'master-guide' | 'online-batch' | 'offline-batch' | 'course-fees' | 'ielts' | 'iec' | 'exam-partial' | 'exam-mock' | 'admin' | 'user-panel';

const cleanData = (obj: any): any => {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(cleanData).filter(item => item !== undefined);
  }
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    const val = cleanData(obj[key]);
    cleaned[key] = val === undefined ? null : val;
  });
  return cleaned;
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [activeTest, setActiveTest] = useState<any | null>(null);
  const [activeMockPart, setActiveMockPart] = useState<number>(0);
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
  const [activeResource, setActiveResource] = useState<'privacy' | 'services' | 'about' | 'success_stories' | 'blog' | 'career' | 'contact' | 'philosophy' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [customPartialTests, setCustomPartialTests] = useState<any[]>([]);
  const [customMockTests, setCustomMockTests] = useState<any[]>([]);

  useEffect(() => {
    const qPartial = query(collection(db, 'tests'), where('testCategory', '==', 'partial'));
    const unsubPartial = onSnapshot(qPartial, (snapshot) => {
      const tests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomPartialTests(tests);
    });

    const qMock = query(collection(db, 'tests'), where('testCategory', '==', 'mock'));
    const unsubMock = onSnapshot(qMock, (snapshot) => {
      const tests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomMockTests(tests);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false);
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        const userEmail = user.email?.toLowerCase() || '';
        const isAdminCredentials = userEmail === 'thelearninghubisc02.bd@gmail.com' || userEmail === 'projectsshuvoxmaruf@gmail.com';
        setIsAdmin(isAdminCredentials);
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubPartial();
      unsubMock();
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveTest(null);
        setShowAuth(null);
        setActiveResource(null);
        setActiveMockPart(0);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleResourceOpen = (type: string) => {
    const studyViews: Record<string, View> = {
      'reading': 'reading',
      'listening': 'listening',
      'writing': 'writing',
      'others': 'master-guide',
      'online-private': 'online-batch',
      'offline-batch': 'offline-batch',
      'course-fees': 'course-fees',
      'ielts': 'ielts',
      'iec': 'iec',
      'exam-partial': 'exam-partial',
      'exam-mock': 'exam-mock'
    };

    if (studyViews[type]) {
      setCurrentView(studyViews[type]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveResource(type as any);
    }
  };

  const handleStartTest = (test: any) => {
    setActiveTest(test);
    setActiveMockPart(0);
  };

  const handleCloseTest = () => {
    if (activeTest && activeTest.data && (activeTest.data.listening || activeTest.data.reading || activeTest.data.writing)) {
      const parts = [];
      if (activeTest.data.listening) parts.push({ type: 'listening', data: activeTest.data.listening });
      if (activeTest.data.reading) parts.push({ type: 'reading', data: activeTest.data.reading });
      if (activeTest.data.writing) parts.push({ type: 'writing', data: activeTest.data.writing });

      if (activeMockPart < parts.length - 1) {
        setActiveMockPart(prev => prev + 1);
        return;
      }
    }
    setActiveTest(null);
    setActiveMockPart(0);
  };

  const getActiveModuleData = () => {
    if (!activeTest) return null;
    if (activeTest.data && (activeTest.data.listening || activeTest.data.reading || activeTest.data.writing)) {
      const parts = [];
      if (activeTest.data.listening) parts.push({ type: 'listening', data: activeTest.data.listening, title: `${activeTest.title} - Listening` });
      if (activeTest.data.reading) parts.push({ type: 'reading', data: activeTest.data.reading, title: `${activeTest.title} - Reading` });
      if (activeTest.data.writing) parts.push({ type: 'writing', data: activeTest.data.writing, title: `${activeTest.title} - Writing` });
      return parts[activeMockPart];
    }
    return activeTest;
  };

  const currentModule = getActiveModuleData();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F27D26]"></div>
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <div>
        <AdminPanel 
          user={currentUser}
          onBack={() => setCurrentView('landing')} 
          onPublishPartial={async (test) => {
            try {
              if (!auth.currentUser) {
                // Quick retry for auth
                await new Promise(resolve => setTimeout(resolve, 500));
                if (!auth.currentUser) throw new Error("Authentication required to publish tests.");
              }
              await addDoc(collection(db, 'tests'), cleanData({ ...test, testCategory: 'partial', createdAt: serverTimestamp() }));
            } catch (e) {
              console.error("Error publishing partial test:", e);
            }
          }}
          onPublishMock={async (test) => {
            try {
              if (!auth.currentUser) {
                // Quick retry for auth
                await new Promise(resolve => setTimeout(resolve, 500));
                if (!auth.currentUser) throw new Error("Authentication required to publish tests.");
              }
              await addDoc(collection(db, 'tests'), cleanData({ ...test, testCategory: 'mock', createdAt: serverTimestamp() }));
            } catch (e) {
              console.error("Error publishing mock test:", e);
            }
          }}
          partialTests={customPartialTests}
          mockTests={customMockTests}
        />
      </div>
    );
  }

  if (currentView === 'user-panel') {
    return (
      <div>
        <UserPanel user={currentUser} onBack={() => setCurrentView('landing')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
      <Header 
        onAuthOpen={(type) => setShowAuth(type)} 
        onResourceOpen={handleResourceOpen}
        onTestOpen={(name) => {
           let type = 'reading';
           if (name.toLowerCase().includes('listening')) type = 'listening';
           if (name.toLowerCase().includes('writing')) type = 'writing';
           handleStartTest({ name, type });
        }}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={async () => {
          try {
            await signOut(auth);
            setIsLoggedIn(false);
            setIsAdmin(false);
            setCurrentView('landing');
            setShowAuth('login'); // Return to authentication screen
          } catch (error) {
            console.error("Logout Error:", error);
          }
        }}
        onHomeClick={() => setCurrentView('landing')}
        onAdminClick={() => setCurrentView('admin')}
        onUserDashboardClick={() => setCurrentView('user-panel')}
        currentView={currentView}
      />
      
      <main>
        {currentView === 'landing' ? (
          <>
            <RainEffect />
            <RocketAnimation />
            <ParallaxShapes />
            <Hero 
              onStartClick={() => {
                if (customMockTests.length > 0) {
                  handleStartTest(customMockTests[0]);
                } else {
                  handleResourceOpen('exam-mock');
                }
              }} 
              onPartialClick={() => handleResourceOpen('exam-partial')}
              onIELTSClick={() => handleResourceOpen('ielts')}
              onIECClick={() => handleResourceOpen('iec')}
            />
            <StudyGallery />
            <PracticeTests 
              customTests={customPartialTests}
              onStartTest={handleStartTest}
              onViewChange={handleResourceOpen}
            />
            <Mission />
          </>
        ) : ['reading', 'listening', 'writing', 'master-guide'].includes(currentView) ? (
          <ModuleStudyPage 
            type={currentView as any} 
            onBack={() => setCurrentView('landing')} 
            onStartTest={(name) => {
               const type = currentView === 'master-guide' ? 'reading' : currentView;
               handleStartTest({ name, type });
            }}
            onViewChange={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <ServicesPage 
            user={currentUser}
            type={currentView as any} 
            partialTests={customPartialTests}
            mockTests={customMockTests}
            onBack={() => setCurrentView('landing')} 
            onStartTest={handleStartTest}
          />
        )}
      </main>

      <Footer 
        onResourceOpen={handleResourceOpen}
        onContactClick={() => {
          const toggle = document.getElementById('notification-panel-toggle');
          toggle?.click();
        }}
      />

      <NotificationPanel user={currentUser} />

      {activeTest && currentModule && (
        <TestModal 
          key={`${activeTest.id || 'test'}-${activeMockPart}`}
          testData={currentModule}
          testName={currentModule.title || currentModule.name || "IELTS Assessment"} 
          onClose={handleCloseTest} 
        />
      )}

      {showAuth && (
        <AuthModal 
          type={showAuth} 
          onClose={() => setShowAuth(null)} 
          onSuccess={(adminStatus) => {
            setIsLoggedIn(true);
            setIsAdmin(adminStatus);
            setShowAuth(null);
            // Redirect to appropriate dashboard
            setCurrentView(adminStatus ? 'admin' : 'user-panel');
          }}
        />
      )}

      {activeResource && (
        <ResourceModal 
          type={activeResource} 
          onClose={() => setActiveResource(null)} 
        />
      )}
    </div>
  );
};

export default App;