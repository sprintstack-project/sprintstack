import { ACTIVITY } from './data';

const RecentActivity = () => {
  return (
    <div className="flex flex-col gap-6">
      {ACTIVITY.map((group) => (
        <section key={group.title} aria-label={group.title}>
          <h3 className="eyebrow">{group.title}</h3>
          <ul className="mt-3 flex flex-col gap-5">
            {group.items.map((item) => (
              <li key={item.id} className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-[0.8125rem] font-extrabold text-on-ink font-stretch-condensed"
                >
                  {item.avatar}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body text-ink-muted">
                    <strong className="font-bold text-ink">{item.actor}</strong> {item.action}{' '}
                    <strong className="font-bold text-brand-ink">{item.issueKey}</strong>
                    {item.target && (
                      <>
                        {' '}
                        {item.target.prefix}{' '}
                        <strong className="font-bold text-ink">{item.target.label}</strong>
                      </>
                    )}
                    {item.quote && <span className="text-ink"> “{item.quote}”</span>}
                  </p>
                  <p className="text-meta text-ink-muted">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default RecentActivity;
