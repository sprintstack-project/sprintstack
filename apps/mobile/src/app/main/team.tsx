import { Button } from '@sprintstack/ui';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { MainScreen } from '@/components/main/main-screen';
import { Team } from '@/components/main/team';
import { ME, newDraft, TIME_OFF, type TimeOffDraft } from '@/components/main/team/data';

const TeamPage = () => {
  const [timeOff, setTimeOff] = useState(TIME_OFF);
  const [draft, setDraft] = useState<TimeOffDraft | null>(null);
  return (
    <MainScreen
      fab={
        <Button variant="brand" size="lg" icon={Plus} onClick={() => setDraft(newDraft(ME))}>
          Time off
        </Button>
      }
    >
      <Team timeOff={timeOff} onTimeOffChange={setTimeOff} draft={draft} onDraftChange={setDraft} />
    </MainScreen>
  );
};

export default TeamPage;
