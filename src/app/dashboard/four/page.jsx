import { CONFIG } from 'src/config-global';

import { CooperativaView } from '../../../sections/cooperativa/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Page three | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CooperativaView title="Page three" />;
}
