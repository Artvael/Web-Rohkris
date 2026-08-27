import { Studio } from 'sanity';
import config from '../../../sanity.config';

export function SanityStudio() {
  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <Studio config={config} />
    </div>
  );
}
