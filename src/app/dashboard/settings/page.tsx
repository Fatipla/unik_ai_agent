import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your AI agent's behavior and appearance.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Manage your agent's core settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="agent-id">Agent ID</Label>
            <Input id="agent-id" defaultValue="AGENT-XXXX" readOnly />
            <p className="text-xs text-muted-foreground">Your unique agent identifier for integrations.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="language">Default Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="al">Albanian</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tone">Default Tone</Label>
            <Select defaultValue="balanced">
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
            <Button>Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Module Activation</CardTitle>
          <CardDescription>
            Enable or disable specific agent modules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="voice-enabled">Voice Agent</Label>
              <p className="text-xs text-muted-foreground">Enable the voice agent for phone interactions.</p>
            </div>
            <Switch id="voice-enabled" defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="whatsapp-enabled">WhatsApp Handoff</Label>
              <p className="text-xs text-muted-foreground">Allow users to continue conversations on WhatsApp.</p>
            </div>
            <Switch id="whatsapp-enabled" defaultChecked={false} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="whatsapp-number">WhatsApp Number</Label>
            <Input id="whatsapp-number" placeholder="+1234567890" />
            <p className="text-xs text-muted-foreground">The number to use for WhatsApp handoffs.</p>
          </div>
        </CardContent>
        <CardFooter>
            <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
