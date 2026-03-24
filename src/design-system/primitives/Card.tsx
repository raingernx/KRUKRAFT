import * as React from "react";

import {
  Card as UICard,
  CardAction as UICardAction,
  CardContent as UICardContent,
  CardDescription as UICardDescription,
  CardFooter as UICardFooter,
  CardHeader as UICardHeader,
  CardTitle as UICardTitle,
} from "@/components/ui/Card";

type UICardProps = React.ComponentProps<typeof UICard>;

function Card(props: UICardProps) {
  return <UICard {...props} />;
}

function CardHeader(props: React.ComponentProps<typeof UICardHeader>) {
  return <UICardHeader {...props} />;
}

function CardTitle(props: React.ComponentProps<typeof UICardTitle>) {
  return <UICardTitle {...props} />;
}

function CardDescription(props: React.ComponentProps<typeof UICardDescription>) {
  return <UICardDescription {...props} />;
}

function CardAction(props: React.ComponentProps<typeof UICardAction>) {
  return <UICardAction {...props} />;
}

function CardContent(props: React.ComponentProps<typeof UICardContent>) {
  return <UICardContent {...props} />;
}

function CardFooter(props: React.ComponentProps<typeof UICardFooter>) {
  return <UICardFooter {...props} />;
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
