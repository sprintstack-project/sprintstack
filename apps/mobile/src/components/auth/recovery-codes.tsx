import { Button, Checkbox, Text } from '@sprintstack/ui';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Share, View } from 'react-native';
import { AuthHeading } from '@/components/auth/auth-heading';
import { AuthScreen } from '@/components/auth/auth-screen';

/** Shown once, right after the authenticator is turned on. */
export const RecoveryCodes = ({ codes, onDone }: { codes: string[]; onDone: () => void }) => {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = `SprintStack recovery codes\nEach code signs you in once.\n\n${codes.join('\n')}`;

  const copy = async () => {
    await Clipboard.setStringAsync(codes.join('\n'), { android: { isSensitive: true } });
    setCopied(true);
  };

  return (
    <AuthScreen
      left={
        <Text className="text-[0.8125rem] leading-4 font-bold uppercase tracking-[.4px] text-ink-muted">
          Two-step verification is on
        </Text>
      }
    >
      <AuthHeading title="Save your" accent="recovery codes.">
        Each one signs you in once if you lose this phone. We won’t show them again.
      </AuthHeading>

      <View
        accessibilityLabel={`Recovery codes: ${codes.join(', ')}`}
        className="flex-row flex-wrap gap-y-2.5 rounded-[1.25rem] border border-line bg-surface p-5"
      >
        {codes.map((code) => (
          <Text key={code} className="w-1/2 font-mono text-[1.0625rem] leading-7 text-ink">
            {code}
          </Text>
        ))}
      </View>

      <View className="flex-row gap-2.5">
        <View className="flex-1">
          <Button variant="secondary" block onClick={() => Share.share({ message: text })}>
            Share or save
          </Button>
        </View>
        <View className="flex-1">
          <Button variant="secondary" block onClick={copy}>
            {copied ? 'Copied' : 'Copy all'}
          </Button>
        </View>
      </View>

      <View className="rounded-2xl bg-surface-muted px-4.5 py-4">
        <Checkbox checked={saved} onCheckedChange={setSaved}>
          I’ve saved my recovery codes
        </Checkbox>
      </View>

      <View className="mt-auto">
        <Button variant="brand" size="lg" block disabled={!saved} onClick={onDone}>
          Go to my workspace
        </Button>
      </View>
    </AuthScreen>
  );
};
