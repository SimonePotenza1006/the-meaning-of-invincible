import { CreationWizard } from './CreationWizard';
import { saveNewCharacter } from './actions';

export const metadata = {
  title: 'Crea il tuo personaggio — D&D 5e',
};

export default function CreaPage() {
  return <CreationWizard save={saveNewCharacter} />;
}
