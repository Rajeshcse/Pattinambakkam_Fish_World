import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Amazing Children's Books with AI
          </h2>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Write, illustrate, and format professional picture books for Amazon KDP in minutes, not months.
          </p>
          
          {/* Dynamic CTA based on auth state */}
          {user ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">Ready to create your next masterpiece?</p>
              <Button variant="primary" size="lg" className="mt-4">
                Create New Book →
              </Button>
            </div>
          ) : (
            <Link to="/register">
              <Button variant="primary" size="lg" className="mt-4">
                Start Writing Now →
              </Button>
            </Link>
          )}
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="text-5xl mb-4">✍️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">AI Story Writer</h3>
            <p className="text-gray-600">
              Generate engaging, age-appropriate stories with just a prompt. Our AI creates compelling narratives perfect for children aged 2-12.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">AI Illustrations</h3>
            <p className="text-gray-600">
              Create beautiful, consistent illustrations that match your story. No design skills needed.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">KDP Ready</h3>
            <p className="text-gray-600">
              Export in Amazon KDP format instantly. Your book is ready to publish without any technical work.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white mb-16">
          <h2 className="text-4xl font-bold mb-12 text-center">How Kidzo Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">1</div>
              <h4 className="text-xl font-bold mb-2">Write Your Idea</h4>
              <p className="text-sm text-purple-100">Share your story concept or let AI suggest one</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">2</div>
              <h4 className="text-xl font-bold mb-2">AI Generates Story</h4>
              <p className="text-sm text-purple-100">Get a complete picture book manuscript</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">3</div>
              <h4 className="text-xl font-bold mb-2">Create Illustrations</h4>
              <p className="text-sm text-purple-100">Generate or customize AI artwork</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">4</div>
              <h4 className="text-xl font-bold mb-2">Publish on KDP</h4>
              <p className="text-sm text-purple-100">Download formatted file & publish</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">✨ Why Choose Kidzo?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Create 10+ books per month instead of 1</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>No writing or design experience needed</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Professional quality in minutes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Amazon KDP compliant format</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Start earning royalties faster</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-8 shadow-lg text-white">
            <h3 className="text-2xl font-bold mb-4">🚀 Get Started Free</h3>
            <p className="mb-6 text-blue-100">
              Create your first picture book today. No credit card required.
            </p>
            <Link to="/register" className="block">
              <Button variant="primary" size="lg" fullWidth className="bg-white text-blue-600 hover:bg-gray-100">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Pricing Teaser */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Flexible Plans for Every Creator</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're just starting or scaling your publishing business, we have a plan for you.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-bold mb-2">Starter</h4>
              <p className="text-3xl font-bold text-primary-600 mb-4">Free</p>
              <p className="text-sm text-gray-600">Perfect for trying</p>
            </div>
            <div className="border-2 border-primary-500 rounded-lg p-6 bg-primary-50">
              <h4 className="text-lg font-bold mb-2">Pro</h4>
              <p className="text-3xl font-bold text-primary-600 mb-4">$29/mo</p>
              <p className="text-sm text-gray-600">Best for creators</p>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-bold mb-2">Agency</h4>
              <p className="text-3xl font-bold text-primary-600 mb-4">$99/mo</p>
              <p className="text-sm text-gray-600">For teams</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Your First Book?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of creators publishing on Amazon KDP with Kidzo
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
