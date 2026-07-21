import { useParams } from 'react-router-dom';
import JournalList from './JournalList';
import JournalEditor from './JournalEditor';

export default function JournalPage() {
  const { id } = useParams();

  if (!id) {
    return <JournalList />;
  }

  return <JournalEditor entryId={id} />;
}
