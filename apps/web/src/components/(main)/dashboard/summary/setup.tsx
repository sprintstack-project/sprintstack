'use client';

import { useGetCurrentSprint } from '@sprintstack/api-client/sprints';
import { useGetWorkItemsByProjectId } from '@sprintstack/api-client/work-items';
import Card from '@ui/card';
import { Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useProjectContext } from '@/providers/(main)/project';
import { SETUP_STEPS } from '../data';
import CreateProject from './create-project';

type StepContentProps = { index: number; label: string; href?: string; done?: boolean };

const StepContent = ({ index, label, href, done = false }: StepContentProps) => (
  <li>
    {done ? (
      <div className="flex items-center gap-4 py-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-on-brand">
          <Check aria-hidden strokeWidth={2.5} className="size-5" />
        </span>
        <s className="text-body-strong opacity-60 font-stretch-semi-condensed text-lg">{label}</s>
        <span className="sr-only">(done)</span>
      </div>
    ) : (
      <Link
        href={href ?? ''}
        className="kbd-focus flex items-center gap-4 rounded-xs py-4 hover:opacity-85 hover:bg-on-ink/5 px-2 cursor-pointer"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-current text-meta font-extrabold tabular-nums">
          {index}
        </span>
        <span className="flex-1 text-body-strong font-stretch-semi-condensed text-lg">{label}</span>
        <ChevronRight aria-hidden strokeWidth={2.5} className="size-5" />
      </Link>
    )}
  </li>
);

const Setup = () => {
  const { projectId, project } = useProjectContext();
  const { data: currentSprint } = useGetCurrentSprint(projectId);
  const { data: workItems } = useGetWorkItemsByProjectId(projectId);

  const totalDone = [
    !!projectId,
    project && project?.memberCount >= 1,
    workItems && workItems.length > 0,
    !!currentSprint,
  ]?.filter(Boolean)?.length;

  return (
    <Card variant="ink">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="headline text-[3.5rem] leading-[0.92]">
            Get set up
            <br />
            <em>in four steps</em>
          </h2>
          <p className="text-right">
            <span className="headline block text-headline tabular-nums">
              {totalDone}
              <span className="opacity-60">/{SETUP_STEPS.length}</span>
            </span>
            <span className="text-meta font-semibold font-stretch-semi-condensed">done</span>
          </p>
        </div>
        <ol className="divide-y divide-on-ink/20 border-t border-on-ink/20">
          {projectId ? (
            <StepContent done index={1} label="Create your first project" />
          ) : (
            <CreateProject className="w-full">
              <StepContent index={1} label="Create your first project" />
            </CreateProject>
          )}
          <StepContent
            done={project && project?.memberCount >= 1}
            href="/team"
            index={2}
            label="Invite your team"
          />
          <StepContent
            done={workItems && workItems?.length > 0}
            href="/taskboard"
            index={3}
            label="Create your first work item"
          />
          <StepContent
            done={!!currentSprint}
            href="/backlog"
            index={4}
            label="Plan and start a sprint"
          />
        </ol>
      </div>
    </Card>
  );
};

export default Setup;
