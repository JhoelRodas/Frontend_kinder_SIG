import { CONFIG } from 'src/config-global';

import { ChildView } from 'src/sections/child/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title> {`Niños - ${CONFIG.appName}`}</title>

      <ChildView />
    </>
  );
}
