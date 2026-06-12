import { Ionicons } from "@expo/vector-icons";

import { EmptyStateCard } from "@/components/ui/EmptyStateCard";

type MessagesEmptyCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
};

export function MessagesEmptyCard({ icon, title, message, primaryLabel, onPrimaryPress }: MessagesEmptyCardProps) {
  return <EmptyStateCard icon={icon} title={title} body={message} primaryLabel={primaryLabel} onPrimaryPress={onPrimaryPress} />;
}
