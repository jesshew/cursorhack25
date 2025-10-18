export interface PageSpread {
  id: string;
  spreadNumber: number;
  leftPage: {
    type: 'photo' | 'text' | 'blank';
    imageSrc?: string;
    imageAlt?: string;
    text?: string;
    pageNumber?: number;
  };
  rightPage: {
    type: 'photo' | 'text' | 'blank';
    imageSrc?: string;
    imageAlt?: string;
    text?: string;
    pageNumber?: number;
  };
}

// Legacy interface for backward compatibility
export interface Page {
  id: string;
  pageNumber: number;
  layout: 'cover' | 'spread-left' | 'spread-right' | 'end';
  visual: {
    type: 'image';
    src: string;
    alt: string;
  };
  text?: {
    content: string;
    language: string;
  };
}

export const storybook = {
  id: "gardener-garden-city",
  title: "The Gardener of the Garden City",
  author: "Siddhant Shrivastava",
  description: "A story about transformation and growth",
  spreads: [
    {
      id: "spread-1",
      spreadNumber: 1,
      leftPage: {
        type: 'photo' as const,
        imageSrc: '/page-1',
        imageAlt: 'A small muddy island with tangled roots and green vegetation in the sea',
        pageNumber: 1
      },
      rightPage: {
        type: 'text' as const,
        text: 'Once, there was a small, muddy island, warmed by the sun and washed by the sea. It was a place of tangled roots and sleepy swamps, with very little room to grow.',
        pageNumber: 2
      }
    },
    {
      id: "spread-2",
      spreadNumber: 2,
      leftPage: {
        type: 'photo' as const,
        imageSrc: '/page-2',
        imageAlt: 'Two clay figures working together to build tall houses from the earth',
        pageNumber: 3
      },
      rightPage: {
        type: 'text' as const,
        text: 'With his friends, Lee rolled up his sleeves. The first task was the biggest: clearing the mud and giving everyone a clean, sturdy pot to live in. Together, they shaped tall, neat houses from the earth, reaching for the sky.',
        pageNumber: 4
      }
    },
    {
      id: "spread-3",
      spreadNumber: 3,
      leftPage: {
        type: 'photo' as const,
        imageSrc: '/page-3',
        imageAlt: 'A clay figure demonstrating how to build water channels in the ground',
        pageNumber: 5
      },
      rightPage: {
        type: 'text' as const,
        text: 'Next, Lee knew the garden needed clean water to flourish. He showed his friends how to build clever channels and wide basins, catching every precious drop of rain to keep their new garden green and its people healthy.',
        pageNumber: 6
      }
    },
    {
      id: "spread-4",
      spreadNumber: 4,
      leftPage: {
        type: 'photo' as const,
        imageSrc: '/page-4',
        imageAlt: 'An aerial view of a thriving garden city with colorful buildings, trees, boats, and an airplane overhead',
        pageNumber: 7
      },
      rightPage: {
        type: 'text' as const,
        text: 'Soon, the little island was famous. Ships and aeroplanes came from far and wide, not to see a muddy patch, but to marvel at the clever, green, and bustling garden city that had blossomed from the sea.',
        pageNumber: 8
      }
    },
    {
      id: "spread-5",
      spreadNumber: 5,
      leftPage: {
        type: 'photo' as const,
        imageSrc: '/page-5',
        imageAlt: 'An elderly clay figure sitting peacefully under a large tree, overlooking the thriving garden city',
        pageNumber: 9
      },
      rightPage: {
        type: 'text' as const,
        text: 'The wise gardener, now an old man, smiled. The seeds of hard work, bright ideas, and friendship had grown into a home for everyone. The little garden that could, did.',
        pageNumber: 10
      }
    }
  ] as PageSpread[],
  pages: [
    {
      id: "cover",
      pageNumber: 0,
      layout: "cover",
      visual: {
        type: "image",
        src: "/cover",
        alt: "The Gardener of the Garden City - A 3D clay figure of a man standing on a small island with twisted roots and green vegetation"
      }
    },
    {
      id: "page-1",
      pageNumber: 1,
      layout: "spread-left",
      visual: {
        type: "image",
        src: "/page-1",
        alt: "A small muddy island with tangled roots and green vegetation in the sea"
      },
      text: {
        content: "Once, there was a small, muddy island, warmed by the sun and washed by the sea. It was a place of tangled roots and sleepy swamps, with very little room to grow.",
        language: "en"
      }
    },
    {
      id: "page-2",
      pageNumber: 2,
      layout: "spread-right",
      visual: {
        type: "image",
        src: "/page-2",
        alt: "Two clay figures working together to build tall houses from the earth"
      },
      text: {
        content: "With his friends, Lee rolled up his sleeves. The first task was the biggest: clearing the mud and giving everyone a clean, sturdy pot to live in. Together, they shaped tall, neat houses from the earth, reaching for the sky.",
        language: "en"
      }
    },
    {
      id: "page-3",
      pageNumber: 3,
      layout: "spread-left",
      visual: {
        type: "image",
        src: "/page-3",
        alt: "A clay figure demonstrating how to build water channels in the ground"
      },
      text: {
        content: "Next, Lee knew the garden needed clean water to flourish. He showed his friends how to build clever channels and wide basins, catching every precious drop of rain to keep their new garden green and its people healthy.",
        language: "en"
      }
    },
    {
      id: "page-4",
      pageNumber: 4,
      layout: "spread-right",
      visual: {
        type: "image",
        src: "/page-4",
        alt: "An aerial view of a thriving garden city with colorful buildings, trees, boats, and an airplane overhead"
      },
      text: {
        content: "Soon, the little island was famous. Ships and aeroplanes came from far and wide, not to see a muddy patch, but to marvel at the clever, green, and bustling garden city that had blossomed from the sea.",
        language: "en"
      }
    },
    {
      id: "page-5",
      pageNumber: 5,
      layout: "end",
      visual: {
        type: "image",
        src: "/page-5",
        alt: "An elderly clay figure sitting peacefully under a large tree, overlooking the thriving garden city"
      },
      text: {
        content: "The wise gardener, now an old man, smiled. The seeds of hard work, bright ideas, and friendship had grown into a home for everyone. The little garden that could, did.",
        language: "en"
      }
    }
  ] as Page[]
};
