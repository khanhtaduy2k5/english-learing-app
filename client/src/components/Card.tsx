import * as React from "react"
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter,
} from "@/components/ui/card"

interface CardProps extends React.ComponentProps<typeof ShadcnCard> {
  interactive?: boolean
}

export const Card: React.FC<CardProps> = ({ children, interactive = true, ...props }) => {
  return <ShadcnCard interactive={interactive} {...props}>{children}</ShadcnCard>
}

export const CardHeader: React.FC<React.ComponentProps<typeof ShadcnCardHeader>> = ({ children, ...props }) => {
  return <ShadcnCardHeader {...props}>{children}</ShadcnCardHeader>
}

export const CardBody: React.FC<React.ComponentProps<typeof ShadcnCardContent>> = ({ children, ...props }) => {
  return <ShadcnCardContent {...props}>{children}</ShadcnCardContent>
}

export const CardFooter: React.FC<React.ComponentProps<typeof ShadcnCardFooter>> = ({ children, ...props }) => {
  return <ShadcnCardFooter {...props}>{children}</ShadcnCardFooter>
}
