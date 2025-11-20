"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, MessageCircle, Users, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("[v0] Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  const statsData = stats || {
    costEur: 0,
    cap: 19.99,
    conversations: 0,
    conversationsGrowth: 0,
    leads: 0,
    leadsGrowth: 0,
    conversionRate: 0,
    conversionGrowth: 0,
    recentConversations: [],
    dailyChart: [],
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Here's a snapshot of your AI agent's performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly AI Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{statsData.costEur.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">vs. €{statsData.cap} monthly cap</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.conversations}</div>
            <p className="text-xs text-muted-foreground">
              {statsData.conversationsGrowth > 0 ? "+" : ""}
              {statsData.conversationsGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Captured</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.leads}</div>
            <p className="text-xs text-muted-foreground">
              {statsData.leadsGrowth > 0 ? "+" : ""}
              {statsData.leadsGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {statsData.conversionGrowth > 0 ? "+" : ""}
              {statsData.conversionGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {statsData.dailyChart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Trend</CardTitle>
            <CardDescription>Daily conversations over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statsData.dailyChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#624CAB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
          <CardDescription>A list of the most recent interactions with your agent.</CardDescription>
        </CardHeader>
        <CardContent>
          {statsData.recentConversations.length === 0 ? (
            <p className="text-muted-foreground">No recent conversations to display.</p>
          ) : (
            <div className="space-y-3">
              {statsData.recentConversations.map((conv: any) => (
                <div key={conv.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium capitalize">{conv.source}</p>
                    <p className="text-sm text-muted-foreground">{new Date(conv.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">€{conv.costEur.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{conv.tokensIn + conv.tokensOut} tokens</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
