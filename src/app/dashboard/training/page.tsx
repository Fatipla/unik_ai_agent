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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, UploadCloud } from "lucide-react";

export default function TrainingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Knowledge Base Training</h1>
        <p className="text-muted-foreground">
          Train your AI agent by providing content from URLs or uploading files.
        </p>
      </div>

      <Tabs defaultValue="url">
        <TabsList>
          <TabsTrigger value="url">
            <Globe className="mr-2 h-4 w-4" />
            From URLs
          </TabsTrigger>
          <TabsTrigger value="upload">
            <UploadCloud className="mr-2 h-4 w-4" />
            From Files
          </TabsTrigger>
        </TabsList>
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Crawl Website Content</CardTitle>
              <CardDescription>
                Enter URLs to be crawled. The agent will learn from the content on these pages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="urls">URLs (one per line)</Label>
                <Input id="urls" placeholder="https://www.example.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Start Training</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload documents (PDF, TXT, DOCX) for the agent to learn from.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PDF, TXT, DOCX (MAX. 10MB)</p>
                      </div>
                      <Input id="dropzone-file" type="file" className="hidden" />
                  </label>
              </div> 
            </CardContent>
             <CardFooter>
              <Button>Upload and Train</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Training Jobs</CardTitle>
          <CardDescription>Status of your recent training activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent training jobs.</p>
        </CardContent>
      </Card>
    </div>
  );
}
