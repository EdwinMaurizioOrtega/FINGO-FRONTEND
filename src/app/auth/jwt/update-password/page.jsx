import { CONFIG } from 'src/config-global';

import { JwtUpdatePasswordView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Actualizar contraseña - ${CONFIG.appName}` };

export default function Page() {
  return <JwtUpdatePasswordView />;
}
