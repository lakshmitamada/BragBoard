import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ShoutOut {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  sender: {
    full_name: string | null;
    role: string;
    department: string;
    avatar_url: string | null;
  };
  recipients: {
    full_name: string | null;
    role: string;
  }[];
}

const parseLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>');
};

export const ShoutOutCard = ({ shoutOut }: { shoutOut: ShoutOut }) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={shoutOut.sender.avatar_url || undefined} />
          <AvatarFallback>
            {shoutOut.sender.full_name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">
              {shoutOut.sender.full_name || "Unknown User"}
            </h3>
            <Badge variant="outline" className="text-xs">
              {shoutOut.sender.role}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {shoutOut.sender.department} • {formatDistanceToNow(new Date(shoutOut.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      <p className="text-foreground whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: parseLinks(shoutOut.content) }} />

      {shoutOut.image_url && (
        <div className="rounded-lg overflow-hidden border">
          <img
            src={shoutOut.image_url}
            alt="Shout-out attachment"
            className="w-full h-auto max-h-96 object-cover"
          />
        </div>
      )}

      {shoutOut.recipients.length > 0 && (
        <div className="pt-2 border-t">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Tagged:</span>
            {shoutOut.recipients.map((recipient, index) => (
              <Badge key={index} variant="secondary">
                {recipient.full_name || "Unknown"} • {recipient.role}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
