'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  emoji: string;
  href: string;
  description: string;
}

const categories: Category[] = [
  {
    id: 'clothes',
    name: 'Clothes',
    emoji: '👕',
    href: '/products?category=clothes',
    description: 'Premium clothing for men, women, and kids',
  },
  {
    id: 'plants',
    name: 'Plants & Trees',
    emoji: '🌿',
    href: '/products?category=plants',
    description: 'Beautiful indoor and outdoor plants',
  },
  {
    id: 'puja',
    name: 'Puja Samagri',
    emoji: '🕯️',
    href: '/products?category=puja_samagri',
    description: 'Sacred items for your spiritual needs',
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-responsive">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="card p-8 text-center hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="text-6xl mb-4">{category.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-6">{category.description}</p>
              <div className="inline-flex items-center gap-2 text-saffron font-semibold">
                Explore <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
