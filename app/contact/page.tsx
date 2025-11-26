import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Na kontaktoni
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Kemi një ekip të dedikuar gati për t'ju ndihmuar me çdo pyetje.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card>
                <CardHeader>
                  <Mail className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">support@unik-ks.com</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MessageSquare className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Në dispozicion 24/7</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Phone className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Telefon</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">+383 XX XXX XXX</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dërgoni një mesazh</CardTitle>
                <CardDescription>
                  Plotësoni formularin më poshtë dhe do t'ju përgjigjemi brenda 24 orëve.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Emri</Label>
                      <Input id="name" placeholder="Emri juaj" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Tema</Label>
                    <Input id="subject" placeholder="Si mund t'ju ndihmojmë?" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="message">Mesazhi</Label>
                    <Textarea
                      id="message"
                      placeholder="Shkruani mesazhin tuaj këtu..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    Dërgo Mesazhin
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
