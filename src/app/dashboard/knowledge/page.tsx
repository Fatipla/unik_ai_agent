'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function KnowledgePage() {
  const [urls, setUrls] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/train/jobs', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setJobs(data.jobs);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const urlList = urls.split('\n').filter(u => u.trim()).map(u => u.trim());
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/train/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ urls: urlList }),
      });

      if (response.ok) {
        setUrls('');
        fetchJobs();
        alert('Training job queued successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to queue training job');
      }
    } catch (error) {
      alert('Error submitting URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/train/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchJobs();
        alert('Files uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload files');
      }
    } catch (error) {
      alert('Error uploading files');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Train your AI agent with custom data from URLs or file uploads
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Train from URLs</CardTitle>
            <CardDescription>
              Add URLs to crawl and extract content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="urls">URLs (one per line)</Label>
                <textarea
                  id="urls"
                  className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="https://example.com/page1&#10;https://example.com/page2"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading || !urls.trim()}>
                {loading ? 'Processing...' : 'Start Training'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Upload documents (PDF, DOCX, TXT) to train from
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="files">Select Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileUpload}
                disabled={loading}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Supported: PDF, DOCX, TXT, MD (max 10MB each)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Jobs</CardTitle>
          <CardDescription>Recent training job history</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No training jobs yet</p>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{job.type}</span>
                      <Badge variant={
                        job.status === 'done' ? 'default' :
                        job.status === 'failed' ? 'destructive' :
                        'secondary'
                      }>
                        {job.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.sources?.length || 0} sources • {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
