"use client";

import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Source, SourceContent, SourceTrigger } from "@/components/ui/source";
import {
  ChevronDown,
  ChefHat,
  CheckSquare,
  Info,
  Lightbulb,
  UtensilsCrossed,
} from "lucide-react";

// Map section types to icons
const iconMapping = {
  heading: <Info className="h-5 w-5" />,
  list: <CheckSquare className="h-5 w-5" />,
  steps: <UtensilsCrossed className="h-5 w-5" />,
  note: <Lightbulb className="h-5 w-5" />,
};

// Helper function to render the content of a section
const renderContent = (section: any) => {
  if (!section.content || (Array.isArray(section.content) && section.content.length === 0)) {
    return null;
  }

  if (section.type === "steps") {
    return (
      <ol className="list-decimal list-inside space-y-2">
        {(section.content as string[]).map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    );
  }

  if (Array.isArray(section.content)) {
    return (
      <ul className="list-disc list-inside space-y-2">
        {section.content.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p>{section.content}</p>;
};

export function Recipe({ recipe }: { recipe: any }) {
  if (!recipe || !recipe.selected) return null;

  const { title, summary, meta, content, imageUrl } = recipe.selected;

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      {imageUrl && (
        <div className="relative w-full h-64">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="bg-muted"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-3">
              <ChefHat className="h-6 w-6" />
              {title}
            </CardTitle>
            <CardDescription className="mt-2">{summary}</CardDescription>
          </div>
          <Source href="#">
            <SourceTrigger>{meta.source_file}</SourceTrigger>
            <SourceContent
              title={meta.source_file}
              description={`Similarity: ${meta.avg_similarity.toFixed(4)}`}
            />
          </Source>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.map((section: any, index: number) => (
          <Collapsible key={index} defaultOpen={true}>
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md border px-4 py-3 text-sm font-medium">
              <div className="flex items-center gap-3">
                {iconMapping[section.type as keyof typeof iconMapping] || <Info className="h-5 w-5" />}
                {section.label}
              </div>
              <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="prose prose-sm dark:prose-invert p-4">
              {renderContent(section)}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
