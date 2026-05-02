import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Find the Home function
const homeRegex = /function Home\(\{ categories, activeVideo, setActiveVideo, user \}: any\) \{([\s\S]*?)\n\}\n\nfunction WhiteLabelHome/g;
let homeBody = '';
appContent = appContent.replace(homeRegex, (match, p1) => {
  homeBody = p1;
  return 'function WhiteLabelHome'; // leave WhiteLabelHome
});

const homeContent = `import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import WhatsOnNow from '../components/WhatsOnNow';
import SliderSection from '../components/SliderSection';
import { Category, VideoItem, User } from '../types';

const LiveChat = lazy(() => import('../components/LiveChat'));

interface HomeProps {
  categories: Category[];
  activeVideo: VideoItem | null;
  setActiveVideo: (video: VideoItem | null) => void;
  user: User | null;
}

export default function Home({ categories, activeVideo, setActiveVideo, user }: HomeProps) {${homeBody}
}
`;

fs.mkdirSync(path.join(process.cwd(), 'src/pages'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'src/pages/Home.tsx'), homeContent, 'utf8');

// Find WhiteLabelHome function
const wlRegex = /function WhiteLabelHome\(\{ wlConfig, categories, user, activeVideo, setActiveVideo \}: any\) \{([\s\S]*?)\n\}\n\nexport default App;/g;
let wlBody = '';
appContent = appContent.replace(wlRegex, (match, p1) => {
  wlBody = p1;
  return 'export default App;';
});

const wlContent = `import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { lazy, Suspense } from 'react';
import SliderSection from '../components/SliderSection';
import { supabase } from '../supabaseClient';
import { WhiteLabelConfig, Category, VideoItem, User } from '../types';

interface WhiteLabelHomeProps {
  wlConfig: WhiteLabelConfig;
  categories: Category[];
  user: User | null;
  activeVideo: VideoItem | null;
  setActiveVideo: (video: VideoItem | null) => void;
}

export default function WhiteLabelHome({ wlConfig, categories, user, activeVideo, setActiveVideo }: WhiteLabelHomeProps) {${wlBody}
}
`;

fs.writeFileSync(path.join(process.cwd(), 'src/pages/WhiteLabelHome.tsx'), wlContent, 'utf8');

// The home component is no longer in App.tsx, so we need to import it
appContent = appContent.replace("import { supabase, storageKey } from './supabaseClient';", "import { supabase, storageKey } from './supabaseClient';\\nimport Home from './pages/Home';\\nimport WhiteLabelHome from './pages/WhiteLabelHome';");

appContent = appContent.replace("import Hero from './components/Hero';\\n", "");
appContent = appContent.replace("import WhatsOnNow from './components/WhatsOnNow';\\n", "");
appContent = appContent.replace("import SliderSection from './components/SliderSection';\\n", "");

fs.writeFileSync(appPath, appContent, 'utf8');

console.log("Extraction complete");
