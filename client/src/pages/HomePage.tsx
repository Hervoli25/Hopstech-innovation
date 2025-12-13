import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Code2, Cloud, Cog, Star, ExternalLink, Github } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { trpc } from '../lib/trpc';
import SkillsSection from '../components/SkillsSection';
import { MetricsDashboard } from '../components/MetricsDashboard';
import { CodeShowcase } from '../components/CodeShowcase';
import { DevOpsPipeline } from '../components/DevOpsPipeline';

const HomePage = () => {
  const { data: projects, isLoading: projectsLoading } = trpc.projects.getFeatured.useQuery();
  const { data: services, isLoading: servicesLoading } = trpc.services.getAll.useQuery();
  const { data: testimonials, isLoading: testimonialsLoading } = trpc.testimonials.getFeatured.useQuery();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-purple-900/20" />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-block">
              <Badge variant="outline" className="text-blue-400 border-blue-400 px-4 py-2 text-sm">
                DevOps Engineer & Full-Stack Developer
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Building the Future
              <br />
              One Line at a Time
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Hi, I'm <span className="text-blue-400 font-semibold">Herve Kajingu</span>. 
              I transform ideas into scalable, high-performance solutions with cutting-edge DevOps practices and modern web technologies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portfolio">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  View My Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
                  Get in Touch
                </Button>
              </Link>
            </div>

            {/* Tech Stack Icons */}
            <div className="mt-16">
              <p className="text-sm text-gray-500 mb-4">Core Technologies</p>
              <div className="flex flex-wrap justify-center gap-6 text-gray-400">
                {['Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Flask', 'Django', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis', 'Nginx', 'GitHub Actions', 'Terraform'].map((tech) => (
                  <div key={tech} className="text-sm hover:text-blue-400 transition-colors cursor-default font-medium">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <SkillsSection />

      {/* Metrics Dashboard */}
      <MetricsDashboard />

      {/* Services Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What I Do</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Specialized services to help your business thrive in the digital age
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesLoading ? (
              <div className="col-span-3 text-center text-gray-400">Loading services...</div>
            ) : services && services.length > 0 ? (
              services.slice(0, 3).map((service) => (
                <Card key={service.id} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                      {service.icon === 'DevOps' && <Cog className="h-6 w-6 text-blue-400" />}
                      {service.icon === 'Code' && <Code2 className="h-6 w-6 text-blue-400" />}
                      {service.icon === 'Cloud' && <Cloud className="h-6 w-6 text-blue-400" />}
                    </div>
                    <CardTitle className="text-white">{service.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features && service.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-400 flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-400">No services available</div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-xl text-gray-400">
                Recent work that showcases my expertise
              </p>
            </div>
            <Link href="/portfolio">
              <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsLoading ? (
              <div className="col-span-3 text-center text-gray-400">Loading projects...</div>
            ) : projects && projects.length > 0 ? (
              projects.slice(0, 3).map((project) => (
                <Link key={project.id} href={`/portfolio/${project.slug}`}>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer group">
                    <div className="aspect-video bg-slate-700 relative overflow-hidden">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Code2 className="h-16 w-16 text-slate-600" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies && project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-400">No projects available</div>
            )}
          </div>
        </div>
      </section>

      {/* Code Showcase Section */}
      <CodeShowcase />

      {/* DevOps Pipeline Section */}
      <DevOpsPipeline />

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              What people say about working with me
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsLoading ? (
              <div className="col-span-3 text-center text-gray-400">Loading testimonials...</div>
            ) : testimonials && testimonials.length > 0 ? (
              testimonials.slice(0, 3).map((testimonial) => (
                <Card key={testimonial.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 font-semibold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{testimonial.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {testimonial.role} at {testimonial.company}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex mt-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-400">No testimonials available</div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4 text-white">Ready to Start Your Project?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Let's discuss how I can help bring your ideas to life with cutting-edge technology and DevOps best practices.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomePage;
