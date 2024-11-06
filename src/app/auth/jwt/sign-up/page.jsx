import { CONFIG } from 'src/config-global';

import { JwtSignUpView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `REGISTRARSE - ${CONFIG.appName}` };

export default function Page() {
  return <JwtSignUpView />;
}
