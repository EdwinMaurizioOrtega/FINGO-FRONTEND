import { CONFIG } from 'src/config-global';

import {LogsView} from "../../../sections/logs/logs";

// ----------------------------------------------------------------------

export const metadata = { title: `Page two | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <LogsView title="Logs" />;
}
