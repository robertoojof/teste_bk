import type { ReactNode } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
} & Omit<React.ComponentProps<'section'>, 'title'>;

export function Section({
  title,
  description,
  action,
  children,
  ...props
}: SectionProps) {
  const headingId = `${props.id ?? title}-heading`;

  return (
    <section aria-labelledby={headingId} {...props}>
      <Card>
        <CardHeader>
          <CardTitle id={headingId} role='heading' aria-level={2}>
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  );
}
