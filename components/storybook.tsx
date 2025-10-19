import React from 'react';

interface StorybookPageVisual {
  type: 'image';
  src: string;
  alt: string;
}

interface StorybookPageText {
  content: string;
  language: string;
}

interface StorybookPage {
  id: string;
  pageNumber: number;
  layout: string;
  visual?: StorybookPageVisual;
  text?: StorybookPageText;
}

interface StorybookSpreadPage {
  type: string;
  imageSrc?: string;
  imageAlt?: string;
  text?: string;
  pageNumber: number;
}

interface StorybookSpread {
  id: string;
  spreadNumber: number;
  leftPage: StorybookSpreadPage;
  rightPage: StorybookSpreadPage;
}

export interface StorybookData {
  storybook_id: string;
  title: string;
  author: string;
  description: string;
  pages: StorybookPage[];
  spreads: StorybookSpread[];
  cover_url: string;
}

interface StorybookProps {
  storybook: StorybookData;
}

export const Storybook: React.FC<StorybookProps> = ({ storybook }) => {
  if (!storybook) return null;

  return (
    <div className="storybook-container bg-gray-100 p-4 rounded-lg dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-2">{storybook.title}</h1>
      <h2 className="text-lg italic mb-4">{storybook.author}</h2>

      {/* Cover */}
      {storybook.cover_url && (
        <div className="mb-4">
          <img
            src={storybook.cover_url}
            alt={`${storybook.title} Cover`}
            className="w-full h-auto rounded-md shadow-lg"
          />
        </div>
      )}

      {/* Spreads */}
      {storybook.spreads?.map(spread => (
        <div key={spread.id} className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Left Page */}
          <div className="w-full md:w-1/2">
            {spread.leftPage.type === 'photo' && spread.leftPage.imageSrc && (
              <img
                src={spread.leftPage.imageSrc}
                alt={spread.leftPage.imageAlt}
                className="w-full h-auto rounded-md shadow-lg"
              />
            )}
            {spread.leftPage.type === 'text' && (
              <div className="p-4 bg-white rounded-md shadow-lg h-full dark:bg-zinc-800">
                <p className="whitespace-pre-wrap">{spread.leftPage.text}</p>
              </div>
            )}
            <div className="text-center mt-1 text-sm text-gray-500">
              {spread.leftPage.pageNumber}
            </div>
          </div>
          {/* Right Page */}
          <div className="w-full md:w-1/2">
            {spread.rightPage.type === 'photo' &&
              spread.rightPage.imageSrc && (
                <img
                  src={spread.rightPage.imageSrc}
                  alt={spread.rightPage.imageAlt}
                  className="w-full h-auto rounded-md shadow-lg"
                />
              )}
            {spread.rightPage.type === 'text' && (
              <div className="p-4 bg-white rounded-md shadow-lg h-full dark:bg-zinc-800">
                <p className="whitespace-pre-wrap">{spread.rightPage.text}</p>
              </div>
            )}
            <div className="text-center mt-1 text-sm text-gray-500">
              {spread.rightPage.pageNumber}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
