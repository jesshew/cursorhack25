import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ItineraryProps = {
  itinerary: {
    itinerary: string;
  };
};

export const Itinerary = ({ itinerary }: ItineraryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Travel Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap">{itinerary.itinerary}</div>
      </CardContent>
    </Card>
  );
};
