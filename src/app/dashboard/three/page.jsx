import { CONFIG } from 'src/config-global';

import { ChatView } from '../../../sections/chat/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Page three | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ChatView title="Page three" />;
}
