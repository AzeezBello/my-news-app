"use client";
// import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


export default function TopTopics({ topics }) {
  return (
    <div>
      <h3 className="text-2xl font-bold mt-6 mb-1">Top Topics</h3>
      <div className="flex flex-col space-y-1 mb-6">
        <div className="h-0.5 w-full bg-gray-700"></div>
        <div className="h-0.5 w-full bg-gray-400"></div>
        <div className="h-0.5 w-full bg-gray-200"></div>
      </div>
      <div className="flex flex-col space-y-4">
        {topics.slice(0, 4).map((topic, index) => (
          <Link key={index} href={`/categories/${topic.id}`} passHref>
            <div className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center space-x-3">
                <Image
                  src={topic.image ? (topic.image.startsWith('http') ? topic.image : `http://127.0.0.1:8000${topic.image}`) : '/placeholder-icon.png'}
                  alt={topic.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="text-md font-semibold">{topic.name}</p>
              </div>
              <button className="text-gray-500">+</button>
            </div>
          </Link>
        ))}
      </div>
      <Link href="/categories" className="text-blue-500 hover:underline mt-4 inline-block">
        View More &rarr;
      </Link>
    </div>
  );
}
