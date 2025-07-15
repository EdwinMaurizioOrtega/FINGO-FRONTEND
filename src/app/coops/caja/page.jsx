import { CONFIG } from 'src/config-global';

import { CooperativaView } from '../../../sections/cooperativa/view';
import { AuthGuard } from '../../../auth/guard';

// ----------------------------------------------------------------------

export const metadata = { title: `Caja | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (

      <AuthGuard>
        <CooperativaView title="Caja" />
      </AuthGuard>

  );
}
