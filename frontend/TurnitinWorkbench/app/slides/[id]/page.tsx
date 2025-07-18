"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data - replace with API call
const mockSlides = {
  bullets: [
    "The transition to renewable energy is a critical challenge.",
    "Perovskite solar cells show remarkable efficiency gains.",
    "Long-term stability is a hurdle for perovskite commercialization.",
    "Bifacial solar panels increase energy yield by up to 30%.",
    "Bifacial panels are effective in large-scale solar farms.",
  ],
  chart_svg: `<svg width="640" height="400" viewBox="0 0 640 400" style="max-width: 100%; height: auto; height: intrinsic;"><path fill="currentColor" d="M1,1h638v398h-638z" fill-opacity="0"></path><g transform="translate(0.5,0.5)"><g stroke="currentColor" stroke-opacity="0.1"><line x1="40" x2="600" y1="360" y2="360"></line><line x1="40" x2="40" y1="40" y2="360"></line></g><g><g transform="translate(153.33333333333331,0)"><rect y="148" width="133.33333333333331" height="212" fill="steelblue"></rect><text y="143" dy="-0.32em" fill="currentColor" text-anchor="middle" font-family="sans-serif" font-size="10">28</text></g><g transform="translate(286.66666666666663,0)"><rect y="40" width="133.33333333333331" height="320" fill="steelblue"></rect><text y="35" dy="-0.32em" fill="currentColor" text-anchor="middle" font-family="sans-serif" font-size="10">55</text></g><g transform="translate(420,0)"><rect y="92" width="133.33333333333331" height="268" fill="steelblue"></rect><text y="87" dy="-0.32em" fill="currentColor" text-anchor="middle" font-family="sans-serif" font-size="10">43</text></g></g><g fill="currentColor" text-anchor="middle" font-family="sans-serif" font-size="10" transform="translate(0,365)"><g transform="translate(153.33333333333331,0)"><text y="0.71em">A</text></g><g transform="translate(286.66666666666663,0)"><text y="0.71em">B</text></g><g transform="translate(420,0)"><text y="0.71em">C</text></g></g></g></svg>`
};

export default function SlidesPage() {
  const params = useParams();
  const { id } = params;
  const [slides, setSlides] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // TODO: Fetch slide and chart data from an API endpoint
      setSlides(mockSlides);
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Loading slides...</div>;
  if (!slides) return <div>Slides not found.</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Slides for Document {id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Key Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {slides.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: slides.chart_svg }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}