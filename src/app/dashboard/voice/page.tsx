'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function VoicePage() {
  const [transcription, setTranscription] = useState('');
  const [intent, setIntent] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('audio', file);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTranscription(data.transcription);

        // Classify intent
        const intentRes = await fetch('/api/voice/intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            callId: data.callId,
            transcription: data.transcription,
          }),
        });

        if (intentRes.ok) {
          const intentData = await intentRes.json();
          setIntent(intentData.intent);
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Transcription failed');
      }
    } catch (error) {
      alert('Error processing audio');
    } finally {
      setLoading(false);
    }
  };

  const handleTTS = async () => {
    if (!transcription) return;

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: transcription.substring(0, 500) }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        alert('TTS generation failed');
      }
    } catch (error) {
      alert('Error generating speech');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Voice Agent</h1>
        <p className="text-muted-foreground">
          Transcribe audio, classify intent, and generate speech
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transcribe Audio</CardTitle>
            <CardDescription>
              Upload an audio file to transcribe and classify intent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={loading}
              className="w-full"
            />
            {loading && <p className="text-sm text-muted-foreground">Processing...</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Text-to-Speech</CardTitle>
            <CardDescription>
              Convert transcription to speech
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleTTS} disabled={!transcription || loading}>
              Generate Speech
            </Button>
            {audioUrl && (
              <audio controls src={audioUrl} className="w-full" />
            )}
          </CardContent>
        </Card>
      </div>

      {transcription && (
        <Card>
          <CardHeader>
            <CardTitle>Transcription</CardTitle>
            {intent && (
              <Badge variant="secondary" className="capitalize">
                Intent: {intent}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{transcription}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
