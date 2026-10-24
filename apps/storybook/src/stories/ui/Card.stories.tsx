import { Button, Card } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/Card',
  component: Card,
  args: { title: 'Sprint summary', children: '12 issues, 3 blocked. Ends Friday.' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Same states as design-system/reference/previews/Card.html, plus a panel and a muted tile. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <div>
        <div className="eyebrow">Sprint 24</div>
        <div className="mt-1 flex items-center justify-between">
          <h2 className="headline text-headline">Board (12)</h2>
          <Button variant="link">See all</Button>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Card
          variant="issue"
          issueKey="PAY-1482"
          title="Checkout fails on saved cards"
          project="Payments · iOS"
          priority="highest"
          points={3}
          due="2 days overdue"
          overdue
          assignee="MO"
          age="Updated 2h ago"
          onPress={() => {}}
        />
        <Card
          variant="issue"
          status="review"
          issueKey="PAY-1477"
          project="Payments"
          title="Add Apple Pay to checkout"
          updated="Updated 2d ago"
          progress={60}
          selected
          onPress={() => {}}
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        <Card variant="tile" tone="ink">
          <p className="headline text-poster">
            Ship it.
            <br />
            <em>Sprint 24.</em>
          </p>
        </Card>
        <Card variant="tile" tone="brand" eyebrow="Release notes">
          <p className="headline text-headline">v4.2</p>
        </Card>
        <Card variant="tile" tone="muted" eyebrow="Career toolkit">
          <p className="headline text-headline">Reviews</p>
        </Card>
      </div>
      <Card
        title="Sprint summary"
        actions={<Button variant="link">Edit</Button>}
        footer={
          <>
            <span className="text-meta font-semibold text-ink-muted">Ends 30 Oct 2026</span>
            <span className="flex-1" />
            <Button variant="primary" size="sm">
              Close sprint
            </Button>
          </>
        }
      >
        12 issues, 3 blocked. Velocity is up 8% on last sprint.
      </Card>
    </div>
  ),
};

export const Keyboard: Story = {
  parameters: { singleTheme: true },
  args: { onPress: fn() },
  render: (args) => (
    <div className="max-w-md">
      <Card
        variant="issue"
        issueKey="PAY-1482"
        title="Checkout fails on saved cards"
        project="Payments · iOS"
        assignee="MO"
        age="Updated 2h ago"
        onPress={args.onPress}
      />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('article', { name: 'Checkout fails on saved cards' });

    // The card is one stop; Enter and Space open it.
    await userEvent.tab();
    await expect(card).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onPress).toHaveBeenCalledTimes(2);

    // Watch toggles without opening the card.
    await userEvent.tab();
    const watch = canvas.getByRole('button', { name: 'Watch' });
    await expect(watch).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(watch).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onPress).toHaveBeenCalledTimes(2);

    // The footer link opens it too.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'View issue' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onPress).toHaveBeenCalledTimes(3);
  },
};

export const Labels: Story = {
  parameters: { singleTheme: true },
  render: () => (
    <div className="max-w-md">
      <Card
        variant="issue"
        status="review"
        issueKey="PAY-1477"
        title="Add Apple Pay"
        project="Payments"
        progress={60}
        updated="Updated 2d ago"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('article', { name: 'Add Apple Pay' })).toBeInTheDocument();
    // Status in words; progress is announced with its value.
    await expect(canvas.getByText('In review')).toBeInTheDocument();
    await expect(canvas.getByRole('progressbar', { name: 'Subtasks done' })).toHaveAttribute(
      'aria-valuenow',
      '60',
    );
    await expect(canvas.getByText('PAY-1477 · Payments')).toBeInTheDocument();
  },
};
