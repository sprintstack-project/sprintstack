import { isImageUrl } from '@lib/status';
import { Badge } from '@ui/badge';
import type { Option } from '@ui/types';

/** What an option shows, in the menu and in the trigger: icon or avatar, then a badge or label. */
const OptionContent = <V,>({ option, inTrigger }: { option: Option<V>; inTrigger?: boolean }) => {
  const Icon = option.icon;
  return (
    <>
      {Icon && <Icon aria-hidden strokeWidth={2} className="size-6 shrink-0" />}
      {option.avatar &&
        (isImageUrl(option.avatar) ? (
          <img src={option.avatar} alt="" className="size-7 shrink-0 rounded-full object-cover" />
        ) : (
          <span
            aria-hidden
            className="grid size-7 shrink-0 place-items-center rounded-full bg-ink-muted text-[0.6875rem] font-bold text-on-ink"
          >
            {option.avatar}
          </span>
        ))}
      {option.status ? (
        <Badge tone={option.status}>{option.label}</Badge>
      ) : (
        <span className="min-w-0 truncate">{option.label}</span>
      )}
      {option.description && !inTrigger && (
        <span className="ml-auto shrink-0 pl-2 text-meta font-semibold text-ink-muted font-stretch-semi-condensed">
          {option.description}
        </span>
      )}
    </>
  );
};

/** Text form of an option, for screen readers and typeahead when only a status badge is shown. */
export const optionText = <V,>(
  option: Option<V>,
  statusLabel: (tone: NonNullable<Option<V>['status']>) => string,
) => {
  return option.label ?? (option.status ? statusLabel(option.status) : String(option.value));
};

export default OptionContent;
