'use client'

import React, { useState } from 'react'
import { Download, Calendar, Clock, User, Filter, Search, ArrowRight, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MainLayout } from '@/components/layout/main-layout'

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { value: 'all', label: 'All Resources' },
    { value: 'guides', label: 'Planning Guides' },
    { value: 'tips', label: 'Pro Tips' },
    { value: 'bts', label: 'Behind the Scenes' },
    { value: 'case-studies', label: 'Case Studies' }
  ]

  const resources = [
    {
      id: 1,
      title: 'Ultimate Video Production Planning Guide',
      description: 'A comprehensive guide to planning your next video project, from concept to delivery.',
      category: 'guides',
      type: 'PDF Guide',
      downloadCount: '2.3K',
      readTime: '15 min read',
      image: '/placeholder-guide.jpg',
      href: '/resources/ultimate-video-production-guide'
    },
    {
      id: 2,
      title: 'Luxury Resort Marketing Checklist',
      description: 'Essential checklist for creating compelling resort marketing content that converts.',
      category: 'guides',
      type: 'Checklist',
      downloadCount: '1.8K',
      readTime: '8 min read',
      image: '/placeholder-checklist.jpg',
      href: '/resources/luxury-resort-marketing-checklist'
    },
    {
      id: 3,
      title: 'Real Estate Video Best Practices',
      description: 'Pro tips for creating property videos that sell faster and for higher prices.',
      category: 'tips',
      type: 'Article',
      downloadCount: '3.1K',
      readTime: '12 min read',
      image: '/placeholder-tips.jpg',
      href: '/resources/real-estate-video-best-practices'
    },
    {
      id: 4,
      title: 'Behind the Scenes: Resort Shoot',
      description: 'Go behind the scenes of our luxury resort production and see how we work.',
      category: 'bts',
      type: 'Video',
      downloadCount: '5.2K',
      readTime: '6 min watch',
      image: '/placeholder-bts.jpg',
      href: '/resources/behind-scenes-resort-shoot'
    },
    {
      id: 5,
      title: 'Hospitality Content Strategy Template',
      description: 'A complete template for planning your hospitality content marketing strategy.',
      category: 'guides',
      type: 'Template',
      downloadCount: '1.5K',
      readTime: '10 min read',
      image: '/placeholder-template.jpg',
      href: '/resources/hospitality-content-strategy-template'
    },
    {
      id: 6,
      title: 'Drone Cinematography Techniques',
      description: 'Master the art of aerial cinematography with these professional techniques.',
      category: 'tips',
      type: 'Article',
      downloadCount: '2.7K',
      readTime: '18 min read',
      image: '/placeholder-drone.jpg',
      href: '/resources/drone-cinematography-techniques'
    },
    {
      id: 7,
      title: 'Case Study: $2.5M Property Sale',
      description: 'How our video content helped sell a luxury property in record time.',
      category: 'case-studies',
      type: 'Case Study',
      downloadCount: '4.1K',
      readTime: '8 min read',
      image: '/placeholder-case-study.jpg',
      href: '/resources/case-study-2-5m-property-sale'
    },
    {
      id: 8,
      title: 'Equipment Guide for Beginners',
      description: 'Everything you need to know about video production equipment for beginners.',
      category: 'guides',
      type: 'Guide',
      downloadCount: '3.8K',
      readTime: '20 min read',
      image: '/placeholder-equipment.jpg',
      href: '/resources/equipment-guide-beginners'
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const featuredResource = resources[0]

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black">
        {/* Hero Section */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Resources
              </h1>
              <p className="text-xl text-mp-gray-light mb-8">
                Free guides, templates, and insights to help you create better content 
                and grow your business with professional media production.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Resource */}
        <section className="py-20 bg-mp-gray-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-mp-charcoal border border-mp-gray-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 lg:p-12">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-mp-gold/10 text-mp-gold text-sm font-medium mb-4">
                      Featured Resource
                    </div>
                <h2 className="text-display text-2xl lg:text-3xl font-bold text-white mb-4">
                      {featuredResource.title}
                    </h2>
                    <p className="text-mp-gray mb-6">
                      {featuredResource.description}
                    </p>
                    <div className="flex items-center space-x-6 mb-8 text-sm text-mp-gray">
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        {featuredResource.downloadCount} downloads
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {featuredResource.readTime}
                      </div>
                    </div>
                    <Button 
                      href={featuredResource.href}
                      size="lg"
                      className="bg-mp-gold text-mp-black hover:bg-mp-gold-dark shadow-gold group"
                    >
                      Download Free Guide
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                  <div className="aspect-square lg:aspect-auto bg-mp-charcoal flex items-center justify-center">
                    <div className="text-center text-mp-white">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mp-gold/20 flex items-center justify-center">
                        <Download className="w-8 h-8 text-mp-gold" />
                      </div>
                      <p>Guide Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-12 bg-mp-black border-b border-mp-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mp-gray" />
                    <Input
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setActiveCategory(category.value)}
                      className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                        activeCategory === category.value
                          ? 'bg-mp-gold text-mp-black'
                          : 'bg-mp-charcoal text-mp-gray-300 hover:bg-mp-gray-800'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                    <div className="aspect-video bg-mp-charcoal overflow-hidden rounded-t-xl">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-mp-white">
                          {resource.type === 'Video' ? (
                            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-mp-gold/20 flex items-center justify-center">
                              <Play className="w-6 h-6 text-mp-gold" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-mp-gold/20 flex items-center justify-center">
                              <Download className="w-6 h-6 text-mp-gold" />
                            </div>
                          )}
                          <p className="text-sm">{resource.type}</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-mp-gold uppercase tracking-wide">
                          {resource.category}
                        </span>
                        <span className="text-xs text-mp-gray">
                          {resource.type}
                        </span>
                      </div>
                      <h3 className="text-display text-lg font-semibold text-white mb-2 group-hover:text-mp-gold transition-colors duration-200">
                        {resource.title}
                      </h3>
                      <p className="text-mp-gray text-sm mb-4 line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-mp-gray mb-4">
                        <div className="flex items-center">
                          <Download className="w-3 h-3 mr-1" />
                          {resource.downloadCount}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {resource.readTime}
                        </div>
                      </div>
                      <Button 
                        href={resource.href}
                        variant="outline"
                        className="w-full group"
                      >
                        {resource.type === 'Video' ? 'Watch Now' : 'Download'}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredResources.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-mp-gray text-lg">
                  No resources found matching your search criteria.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-mp-charcoal text-mp-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-display text-3xl sm:text-4xl font-bold mb-6">
                Stay Updated
              </h2>
              <p className="text-xl text-mp-gray-light mb-8">
                Get the latest resources, tips, and insights delivered straight to your inbox. 
                No spam, just valuable content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button className="bg-mp-gold text-mp-black hover:bg-mp-gold-600">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
