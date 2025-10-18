"use client";

import { Response } from "./elements/response";

export function Recipe({ recipe }: { recipe: any }) {
  if (!recipe) return null;
  return (
    <div className="prose prose-sm dark:prose-invert">
        <Response>{recipe.recipe}</Response>
    </div>
  );
}
