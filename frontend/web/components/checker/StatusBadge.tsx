import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'open':
        return 'secondary';
      case 'checking':
        return 'default';
      case 'needs_edit':
        return 'warning';
      case 'done':
        return 'success';
      case 'telegram_failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};