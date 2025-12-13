import { useParams, Link } from 'wouter';
import { ArrowLeft, ExternalLink, Github, Calendar, User, TrendingUp } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { trpc } from '../lib/trpc';

const ProjectDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="text-gray-400">Loading project...</div>
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-8">The project you're looking for doesn't exist.</p>
          <Link href="/portfolio">
            <Button variant="outline" className="border-blue-400 text-blue-400">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-900/20 via-slate-950 to-purple-900/20">
        <div className="container mx-auto px-4">
          <Link href="/portfolio">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>

          <div className="max-w-4xl">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
              {project.category}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              {project.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-4">
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-slate-700 text-gray-300 hover:bg-slate-800">
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Image */}
              {project.thumbnail && (
                <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 whitespace-pre-line">
                      {project.longDescription}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics */}
              {project.metrics && Object.keys(project.metrics).length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
                      Key Metrics & Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="bg-slate-900/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400 mb-1">{value}</div>
                          <div className="text-sm text-gray-400">{key}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.client && (
                    <div>
                      <div className="flex items-center text-gray-400 text-sm mb-1">
                        <User className="mr-2 h-4 w-4" />
                        Client
                      </div>
                      <div className="text-white font-medium">{project.client}</div>
                    </div>
                  )}
                  {project.publishedAt && (
                    <div>
                      <div className="flex items-center text-gray-400 text-sm mb-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        Completed
                      </div>
                      <div className="text-white font-medium">
                        {new Date(project.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technologies */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies && project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Interested in a Similar Project?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Let's discuss how I can help bring your vision to life with the same level of expertise and dedication.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start a Conversation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
};

export default ProjectDetailPage;
